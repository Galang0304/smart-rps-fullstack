$SERVER = 'galang0304@103.151.145.182'
$PROJECT_PATH = '/root/smart-rps-fullstack'

Write-Host '=====================================' -ForegroundColor Cyan
Write-Host '  SMART RPS - Deploy ke Server' -ForegroundColor Cyan
Write-Host '=====================================' -ForegroundColor Cyan
Write-Host ''

Write-Host '[1/6] Pulling latest code...' -ForegroundColor Yellow
ssh $SERVER "sudo su root -c 'cd $PROJECT_PATH && git reset --hard origin/main && git pull origin main'"
Write-Host 'Code updated' -ForegroundColor Green
Write-Host ''

Write-Host '[2/6] Installing npm dependencies...' -ForegroundColor Yellow
ssh $SERVER "sudo su root -c 'cd $PROJECT_PATH && npm install'"
Write-Host 'Dependencies installed' -ForegroundColor Green
Write-Host ''

Write-Host '[3/6] Building frontend...' -ForegroundColor Yellow
ssh $SERVER "sudo su root -c 'cd $PROJECT_PATH && npm run build'"
Write-Host 'Frontend built' -ForegroundColor Green
Write-Host ''

Write-Host '[4/6] Deploying frontend...' -ForegroundColor Yellow
ssh $SERVER "sudo su root -c 'rm -rf /var/www/html/* && cp -r $PROJECT_PATH/dist/* /var/www/html/'"
Write-Host 'Frontend deployed' -ForegroundColor Green
Write-Host ''

Write-Host '[5/6] Building backend...' -ForegroundColor Yellow
ssh $SERVER "sudo su root -c 'cd $PROJECT_PATH/backend && /usr/local/go/bin/go build -o smart_rps'"
Write-Host 'Backend built' -ForegroundColor Green
Write-Host ''

Write-Host '[6/6] Restarting backend...' -ForegroundColor Yellow
ssh $SERVER "sudo su root -c 'pkill smart_rps; sleep 2; cd $PROJECT_PATH/backend && nohup ./smart_rps > /tmp/smart_rps.log 2>&1 &'"
Start-Sleep -Seconds 3
Write-Host 'Backend restarted' -ForegroundColor Green
Write-Host ''

Write-Host '=====================================' -ForegroundColor Cyan
Write-Host '  Deployment Completed!' -ForegroundColor Green
Write-Host '=====================================' -ForegroundColor Cyan
Write-Host 'Frontend: http://103.151.145.182' -ForegroundColor White
Write-Host 'Backend:  http://103.151.145.182:8080' -ForegroundColor White
