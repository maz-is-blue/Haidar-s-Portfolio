# Start Haidar Mustafa Portfolio — React + Laravel
# Run this script once to start both servers.

Write-Host "Starting Laravel API on http://localhost:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location `"$PSScriptRoot\backend`"; php artisan serve"

Start-Sleep 2

Write-Host "Starting Vite dev server on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location `"$PSScriptRoot`"; npm run dev"

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Portfolio:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Admin:      http://localhost:5173/admin/login" -ForegroundColor Cyan
Write-Host "  API:        http://localhost:8000/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Admin login:" -ForegroundColor Yellow
Write-Host "    Email:    admin@haidar.com" -ForegroundColor Yellow
Write-Host "    Password: admin123" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan
