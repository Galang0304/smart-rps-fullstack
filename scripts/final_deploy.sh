#!/bin/bash
# Deploy script for Smart RPS

echo "=== Setting up backend ==="
cd /var/www/smart-rps/backend

# Create .env if not exists
cat > .env << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_USER=smart_rps_user
DB_PASSWORD=smartrps2024
DB_NAME=smart_rps
DB_SSLMODE=disable
APP_PORT=8080
GIN_MODE=release
JWT_SECRET=smart-rps-jwt-secret-2024-production
EOF

# Use pre-built binary
chmod +x smart_rps_linux

echo "=== Setting up Nginx ==="
cat > /etc/nginx/sites-available/smart-rps << 'NGINX'
server {
    listen 80;
    server_name _;
    client_max_body_size 50M;

    root /var/www/smart-rps/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/v1 {
        proxy_pass http://127.0.0.1:8080/api/v1;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    location /health {
        proxy_pass http://127.0.0.1:8080/health;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
}
NGINX

ln -sf /etc/nginx/sites-available/smart-rps /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "=== Setting up systemd service ==="
cat > /etc/systemd/system/smart-rps.service << 'SERVICE'
[Unit]
Description=Smart RPS Backend
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/smart-rps/backend
ExecStart=/var/www/smart-rps/backend/smart_rps_linux
Restart=always
RestartSec=5
Environment=GIN_MODE=release

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable smart-rps
systemctl restart smart-rps

echo "=== Checking status ==="
sleep 2
systemctl status smart-rps --no-pager
echo ""
echo "=== DEPLOYMENT COMPLETE ==="
