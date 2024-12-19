# Step 1: Start Docker containers using docker-compose
Write-Host "Starting Docker containers with docker-compose..."
docker-compose up
if ($LASTEXITCODE -ne 0) {
    Write-Host "docker-compose failed. Exiting..." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "All steps completed successfully." -ForegroundColor Green