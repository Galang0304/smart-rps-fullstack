#!/usr/bin/env pwsh
# Clean Database Script untuk SMART RPS
# Hapus semua data kecuali user admin

$SERVER = "galang0304@103.151.145.182"
$DB_NAME = "smart_rps"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  SMART RPS - Clean Database" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠  WARNING: This will delete ALL data except admin user!" -ForegroundColor Yellow
Write-Host ""

# Confirm
$confirmation = Read-Host "Are you sure? Type 'yes' to continue"
if ($confirmation -ne 'yes') {
    Write-Host "Cancelled." -ForegroundColor Gray
    exit 0
}

Write-Host ""
Write-Host "Cleaning database..." -ForegroundColor Yellow

$SQL_SCRIPT = @"
BEGIN;

-- Delete child tables first
DELETE FROM sub_cpmk WHERE course_id IN (SELECT id FROM courses WHERE deleted_at IS NULL);
DELETE FROM cpmk WHERE course_id IN (SELECT id FROM courses WHERE deleted_at IS NULL);

-- Delete generated RPS
DELETE FROM generated_rps;

-- Delete courses
DELETE FROM courses WHERE deleted_at IS NULL;

-- Delete prodi (except admin's prodi)
DELETE FROM prodi WHERE id != (SELECT prodi_id FROM users WHERE username = 'admin' LIMIT 1);

-- Delete users (except admin)
DELETE FROM users WHERE username != 'admin';

COMMIT;

-- Show remaining data
SELECT 'Database cleaned successfully!' AS status;
SELECT COUNT(*) AS remaining_users FROM users;
SELECT COUNT(*) AS remaining_prodi FROM prodi;
SELECT COUNT(*) AS remaining_courses FROM courses WHERE deleted_at IS NULL;
"@

# Execute SQL
ssh $SERVER "sudo -u postgres psql -d $DB_NAME -c `"$SQL_SCRIPT`""

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Database cleaned successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Only admin user remains in the database." -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "✗ Error cleaning database!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
