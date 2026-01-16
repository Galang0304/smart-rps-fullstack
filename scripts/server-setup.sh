#!/bin/bash
# ============================================
# SMART RPS - Server Setup Script
# Untuk Ubuntu Server (Proxmox CT)
# ============================================

set -e

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ============================================
# 1. Update System
# ============================================
print_status "Updating system packages..."
apt update && apt upgrade -y

# ============================================
# 2. Install Dependencies
# ============================================
print_status "Installing basic dependencies..."
apt install -y curl wget git build-essential unzip software-properties-common

# ============================================
# 3. Install PostgreSQL
# ============================================
print_status "Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib

systemctl start postgresql
systemctl enable postgresql

print_success "PostgreSQL installed successfully"

# ============================================
# 4. Setup Database
# ============================================
print_status "Setting up database..."

sudo -u postgres psql << 'EOSQL'
-- Buat user jika belum ada
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'smart_rps_user') THEN
      CREATE USER smart_rps_user WITH PASSWORD 'smartrps2024';
   END IF;
END
$do$;

-- Buat database jika belum ada
SELECT 'CREATE DATABASE smart_rps OWNER smart_rps_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'smart_rps')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE smart_rps TO smart_rps_user;
EOSQL

print_success "Database setup complete"

# ============================================
# 5. Install Node.js 20 LTS
# ============================================
print_status "Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

print_success "Node.js $(node --version) installed"

# ============================================
# 6. Install Go 1.22
# ============================================
print_status "Installing Go 1.22..."

if [ ! -f "/usr/local/go/bin/go" ]; then
    wget -q https://go.dev/dl/go1.22.0.linux-amd64.tar.gz -O /tmp/go.tar.gz
    rm -rf /usr/local/go
    tar -C /usr/local -xzf /tmp/go.tar.gz
    rm /tmp/go.tar.gz
fi

# Add Go to PATH for current session
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# Add to bashrc if not already there
if ! grep -q "/usr/local/go/bin" ~/.bashrc; then
    echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
    echo 'export GOPATH=$HOME/go' >> ~/.bashrc
    echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.bashrc
fi

print_success "Go $(/usr/local/go/bin/go version | cut -d' ' -f3) installed"

# ============================================
# 7. Install Nginx
# ============================================
print_status "Installing Nginx..."
apt install -y nginx

systemctl start nginx
systemctl enable nginx

print_success "Nginx installed successfully"

# ============================================
# 8. Create project directory
# ============================================
print_status "Creating project directory..."
mkdir -p /var/www/smart-rps
chown -R root:root /var/www/smart-rps

print_success "Project directory created at /var/www/smart-rps"

# ============================================
# 9. Setup Nginx Configuration
# ============================================
print_status "Configuring Nginx..."

cat > /etc/nginx/sites-available/smart-rps << 'NGINXCONF'
server {
    listen 80;
    server_name _;

    # Increase max body size for file uploads
    client_max_body_size 50M;

    # Frontend (React)
    root /var/www/smart-rps/dist;
    index index.html;

    # Handle React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api/v1 {
        proxy_pass http://127.0.0.1:8080/api/v1;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:8080/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    gzip_min_length 1000;
}
NGINXCONF

# Enable site and disable default
ln -sf /etc/nginx/sites-available/smart-rps /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t && systemctl reload nginx

print_success "Nginx configured successfully"

# ============================================
# 10. Create Backend Systemd Service
# ============================================
print_status "Creating backend systemd service..."

cat > /etc/systemd/system/smart-rps-backend.service << 'SERVICECONF'
[Unit]
Description=Smart RPS Backend Service
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/smart-rps/backend
ExecStart=/var/www/smart-rps/backend/smart_rps_server
Restart=always
RestartSec=5
Environment=GIN_MODE=release

[Install]
WantedBy=multi-user.target
SERVICECONF

systemctl daemon-reload
systemctl enable smart-rps-backend

print_success "Backend service created"

# ============================================
# 11. Setup Firewall (UFW)
# ============================================
print_status "Configuring firewall..."

apt install -y ufw
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

print_success "Firewall configured"

# ============================================
# Summary
# ============================================
echo ""
echo "============================================"
echo -e "${GREEN}✅ Server setup complete!${NC}"
echo "============================================"
echo ""
echo "Installed components:"
echo "  - PostgreSQL (database: smart_rps, user: smart_rps_user)"
echo "  - Node.js $(node --version)"
echo "  - Go $(/usr/local/go/bin/go version | cut -d' ' -f3)"
echo "  - Nginx (reverse proxy)"
echo ""
echo "Next steps:"
echo "  1. Upload your project to /var/www/smart-rps/"
echo "  2. Create /var/www/smart-rps/backend/.env file"
echo "  3. Build frontend: cd /var/www/smart-rps && npm install && npm run build"
echo "  4. Build backend: cd /var/www/smart-rps/backend && go build -o smart_rps_server ."
echo "  5. Start backend: sudo systemctl start smart-rps-backend"
echo ""
echo "Access your application at: http://YOUR_SERVER_IP"
echo "============================================"
