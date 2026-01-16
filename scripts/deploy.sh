#!/bin/bash
# ============================================
# SMART RPS - Deploy Script
# Jalankan setelah upload project ke server
# ============================================

set -e

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

PROJECT_DIR="/var/www/smart-rps"

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    print_error "Project directory not found: $PROJECT_DIR"
    exit 1
fi

cd $PROJECT_DIR

# ============================================
# 1. Setup Backend Environment
# ============================================
print_status "Setting up backend environment..."

if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
    cat > $PROJECT_DIR/backend/.env << 'EOF'
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=smart_rps_user
DB_PASSWORD=smartrps2024
DB_NAME=smart_rps
DB_SSLMODE=disable

# App Configuration
APP_PORT=8080
GIN_MODE=release

# JWT Secret (GANTI DENGAN SECRET YANG AMAN!)
JWT_SECRET=smart-rps-jwt-secret-key-change-this-in-production

# Email Configuration (optional)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
EOF
    print_success "Backend .env created"
else
    print_status "Backend .env already exists, skipping..."
fi

# ============================================
# 2. Build Frontend
# ============================================
print_status "Building frontend..."

# Check if package.json exists
if [ -f "$PROJECT_DIR/package.json" ]; then
    npm install
    npm run build
    print_success "Frontend built successfully"
else
    print_error "package.json not found in $PROJECT_DIR"
fi

# ============================================
# 3. Build Backend
# ============================================
print_status "Building backend..."

cd $PROJECT_DIR/backend

# Add Go to PATH
export PATH=$PATH:/usr/local/go/bin

if [ -f "go.mod" ]; then
    go mod download
    go build -o smart_rps_server .
    chmod +x smart_rps_server
    print_success "Backend built successfully"
else
    print_error "go.mod not found in $PROJECT_DIR/backend"
fi

# ============================================
# 4. Restart Services
# ============================================
print_status "Restarting services..."

systemctl restart smart-rps-backend
systemctl reload nginx

# Wait a moment for service to start
sleep 2

# Check if backend is running
if systemctl is-active --quiet smart-rps-backend; then
    print_success "Backend service is running"
else
    print_error "Backend service failed to start. Check logs: journalctl -u smart-rps-backend -f"
fi

# ============================================
# Summary
# ============================================
echo ""
echo "============================================"
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo "============================================"
echo ""
echo "Services status:"
systemctl is-active smart-rps-backend && echo "  - Backend: ✅ Running" || echo "  - Backend: ❌ Stopped"
systemctl is-active nginx && echo "  - Nginx: ✅ Running" || echo "  - Nginx: ❌ Stopped"
systemctl is-active postgresql && echo "  - PostgreSQL: ✅ Running" || echo "  - PostgreSQL: ❌ Stopped"
echo ""
echo "Check backend logs: sudo journalctl -u smart-rps-backend -f"
echo "============================================"
