# Panduan Deployment Smart RPS ke Server Ubuntu (Proxmox CT)

## 📋 Informasi Server
- Container: CT 100 (rps)
- OS: Ubuntu
- RAM: 16 GB
- CPU: 16 cores
- Disk: ~15.58 GB

---

## 1️⃣ Update Sistem & Install Dependencies

Login ke server via SSH atau Console Proxmox, kemudian jalankan:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies dasar
sudo apt install -y curl wget git build-essential unzip
```

---

## 2️⃣ Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start dan enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Buat database dan user
sudo -u postgres psql
```

Di dalam PostgreSQL shell, jalankan:

```sql
-- Buat user
CREATE USER smart_rps_user WITH PASSWORD 'smartrps2024';

-- Buat database
CREATE DATABASE smart_rps OWNER smart_rps_user;

-- Berikan privileges
GRANT ALL PRIVILEGES ON DATABASE smart_rps TO smart_rps_user;

-- Keluar
\q
```

---

## 3️⃣ Install Node.js (untuk Build Frontend)

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi instalasi
node --version
npm --version
```

---

## 4️⃣ Install Go (untuk Backend)

```bash
# Download Go 1.22
wget https://go.dev/dl/go1.22.0.linux-amd64.tar.gz

# Extract ke /usr/local
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz

# Setup environment variables
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.bashrc
source ~/.bashrc

# Verifikasi instalasi
go version
```

---

## 5️⃣ Install Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install -y nginx

# Start dan enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 6️⃣ Upload Project ke Server

Dari komputer Windows Anda, gunakan SCP atau SFTP:

```powershell
# Menggunakan SCP (dari PowerShell di Windows)
scp -r C:\Users\andia\Documents\SMARTRPS\smart-rps root@103.151.145.166:/var/www/
```

Atau gunakan WinSCP/FileZilla untuk upload folder project.

---

## 7️⃣ Setup Backend

```bash
# Masuk ke folder backend
cd /var/www/smart-rps/backend

# Buat file .env
cat > .env << 'EOF'
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

# JWT Secret (ganti dengan secret yang aman)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Email Configuration (opsional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EOF

# Download dependencies dan build
go mod download
go build -o smart_rps_server .

# Test jalankan
./smart_rps_server
```

---

## 8️⃣ Setup Frontend

```bash
# Masuk ke folder frontend
cd /var/www/smart-rps

# Install dependencies
npm install

# Buat file .env untuk production
cat > .env.production << 'EOF'
VITE_API_URL=http://103.151.145.166/api
EOF

# Build untuk production
npm run build

# Hasil build ada di folder 'dist'
```

---

## 9️⃣ Konfigurasi Nginx

```bash
# Buat konfigurasi Nginx untuk Smart RPS
sudo nano /etc/nginx/sites-available/smart-rps
```

Isi dengan konfigurasi berikut:

```nginx
server {
    listen 80;
    server_name 103.151.145.166;  # Ganti dengan domain jika ada

    # Frontend (React)
    root /var/www/smart-rps/dist;
    index index.html;

    # Handle React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy (semua request ke /api/v1/*)
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
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
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
}
```

Aktifkan konfigurasi:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/smart-rps /etc/nginx/sites-enabled/

# Hapus default site (opsional)
sudo rm /etc/nginx/sites-enabled/default

# Test konfigurasi
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔟 Setup Systemd Service untuk Backend

Buat service agar backend berjalan otomatis:

```bash
sudo nano /etc/systemd/system/smart-rps-backend.service
```

Isi dengan:

```ini
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
```

Aktifkan service:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable dan start service
sudo systemctl enable smart-rps-backend
sudo systemctl start smart-rps-backend

# Cek status
sudo systemctl status smart-rps-backend
```

---

## 1️⃣1️⃣ Setup Firewall (UFW)

```bash
# Install UFW jika belum ada
sudo apt install -y ufw

# Allow SSH, HTTP, HTTPS
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Enable firewall
sudo ufw enable

# Cek status
sudo ufw status
```

---

## 🔍 Perintah Berguna untuk Monitoring

```bash
# Cek status backend
sudo systemctl status smart-rps-backend

# Lihat log backend
sudo journalctl -u smart-rps-backend -f

# Cek status Nginx
sudo systemctl status nginx

# Lihat log Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Restart services
sudo systemctl restart smart-rps-backend
sudo systemctl restart nginx

# Cek koneksi database
sudo -u postgres psql -c "\l"
```

---

## 🚀 Quick Deploy Script

Buat script untuk mempermudah deployment:

```bash
cat > /var/www/smart-rps/deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

cd /var/www/smart-rps

# Pull latest changes (jika pakai git)
# git pull origin main

# Build frontend
echo "📦 Building frontend..."
npm install
npm run build

# Build backend
echo "🔧 Building backend..."
cd backend
go build -o smart_rps_server .

# Restart backend service
echo "🔄 Restarting backend..."
sudo systemctl restart smart-rps-backend

echo "✅ Deployment complete!"
EOF

chmod +x /var/www/smart-rps/deploy.sh
```

---

## ⚠️ Troubleshooting

### Backend tidak bisa connect ke database
```bash
# Cek PostgreSQL running
sudo systemctl status postgresql

# Cek konfigurasi pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Pastikan ada baris: local all all md5
```

### Port 8080 sudah digunakan
```bash
# Cek proses yang menggunakan port
sudo lsof -i :8080

# Kill proses jika perlu
sudo kill -9 <PID>
```

### Permission denied
```bash
# Berikan permission ke folder
sudo chown -R root:root /var/www/smart-rps
sudo chmod -R 755 /var/www/smart-rps
```

---

## 📱 Akses Aplikasi

Setelah semua setup selesai, akses aplikasi di:
- **Frontend**: http://103.151.145.166
- **Backend API**: http://103.151.145.166/api

---

## 🔐 Security Checklist

- [ ] Ganti password database default
- [ ] Ganti JWT_SECRET dengan nilai yang aman
- [ ] Setup SSL/HTTPS dengan Let's Encrypt
- [ ] Batasi akses SSH (gunakan key-based auth)
- [ ] Regular backup database
