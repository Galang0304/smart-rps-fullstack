#!/bin/bash
# Setup PostgreSQL database

sudo -u postgres psql -c "DROP DATABASE IF EXISTS smart_rps;"
sudo -u postgres psql -c "DROP USER IF EXISTS smart_rps_user;"
sudo -u postgres psql -c "CREATE USER smart_rps_user WITH PASSWORD 'smartrps2024';"
sudo -u postgres psql -c "CREATE DATABASE smart_rps OWNER smart_rps_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE smart_rps TO smart_rps_user;"
echo "Database setup complete!"
