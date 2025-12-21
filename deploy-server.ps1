#!/usr/bin/env pwsh
# Deploy Script untuk SMART RPS
# Otomatis pull, build, dan restart backend & frontend

$SERVER = "galang0304@103.151.145.182"
$PROJECT_PATH = "/root/smart-rps-fullstack"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  SMART RPS - Deploy ke Server" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Pull latest code
Write-Host "[1/6] Pulling latest code from GitHub..." -ForegroundColor Yellow
ssh $SERVER "sudo su root -c 'cd $PROJECT_PATH && git reset --hard origin/main && git pull origin main'"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Git pull failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Code updated" -ForegroundColor Green
Write-Host ""

# Step 2: Install npm dependencies
Write-Host "[2/6] Installing npm dependencies..." -ForegroundColor Yellow
ssh $SERVER "sudo su root -c 'cd $PROJECT_PATH && npm install'"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 3: Build frontend
Write-Host "[3/6] Building frontend..." -ForegroundColor Yellow
ssh $SERVER "sudo su root -c 'cd $PROJECT_PATH && npm run build'"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend built" -ForegroundColor Green
Write-Host ""

# Step 4: Deploy frontend to nginx
Write-Host "[4/6] Deploying frontend to nginx..." -ForegroundColor Yellow
ssh $SERVER "sudo su root -c 'rm -rf /var/www/html/* && cp -r $PROJECT_PATH/dist/* /var/www/html/'"
Write-Host "✓ Frontend deployed" -ForegroundColor Green
Write-Host ""

# Step 5: Build backend
Write-Host "[5/6] Building backend..." -ForegroundColor Yellow
ssh $SERVER "sudo su root -c 'cd $PROJECT_PATH/backend && /usr/local/go/bin/go build -o smart_rps'"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Backend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend built" -ForegroundColor Green
Write-Host ""

# Step 6: Restart backend
Write-Host "[6/6] Restarting backend..." -ForegroundColor Yellow
ssh $SERVER "sudo su root -c 'pkill smart_rps; sleep 2; cd $PROJECT_PATH/backend && nohup ./smart_rps > /tmp/smart_rps.log 2>&1 &'"
Start-Sleep -Seconds 3

# Check backend health
Write-Host "Checking backend health..." -ForegroundColor Yellow
$health = ssh $SERVER "curl -s http://localhost:8080/health"
if ($health -match "ok" -or $health -match "healthy") {
    Write-Host "✓ Backend is running" -ForegroundColor Green
}
else {
    Write-Host "⚠ Backend might not be running. Check logs with:" -ForegroundColor Yellow
    Write-Host "ssh $SERVER 'sudo tail -50 /tmp/smart_rps.log'" -ForegroundColor Gray
}
Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Deployment Completed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://103.151.145.182" -ForegroundColor White
Write-Host "Backend:  http://103.151.145.182:8080" -ForegroundColor White
Write-Host ""
