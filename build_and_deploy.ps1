param(
    [string]$skipTests = "true" # Default value is "true"
)

function Write-Log {
    param (
        [string]$Message,
        [string]$Level = "INFO"
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp][$Level] $Message"
}

function Verify-Command {
    param (
        [string]$Command
    )
    if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
        Write-Log "$Command is not installed or not in PATH. Exiting..." "ERROR"
        exit 1
    } else {
        Write-Log "$Command is installed ..."
    }
}

Verify-Command "mvn"
Verify-Command "docker"
Verify-Command "ng"
Verify-Command "npm"

# Step 1: Run Maven clean and package with or without skipping tests
Write-Host "Cleaning and packaging the Maven project..."

Set-Location .\backend-java\PXLFullstackJavaProjectBackend

if ($skipTests -eq "true") {
    mvn clean package -DskipTests
} else {
    mvn clean package
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "Maven build failed. Exiting..." -ForegroundColor Red
    exit $LASTEXITCODE
}

# Step 2: Find and build Docker images for each Dockerfile in the backend directory and subdirectories
Write-Host "Building Docker images for the backend..."

$currentDir = Get-Location

# Find all Dockerfiles in the current directory and subdirectories
$dockerfiles = Get-ChildItem -Path $currentDir -Recurse -Filter Dockerfile
foreach ($dockerfile in $dockerfiles) {
    # Get the directory containing the Dockerfile
    $dockerDir = $dockerfile.DirectoryName
    $imageName = (Split-Path -Leaf $dockerDir).ToLower()
    Write-Host "Building Docker image: $imageName from $dockerDir..."

    # Build the Docker image
    docker build -t $imageName $dockerDir
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker build failed for $dockerDir. Exiting..." -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

# Step 3: Package and test Angular application
Write-Host "Testing and packaging the Angular frontend application..."

Set-Location ..\..\frontend-web\PXLFullstackJavaProjectFrontend

# Install dependencies if necessary
Write-Host "Installing Angular dependencies..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "NPM install failed. Exiting..." -ForegroundColor Red
    exit $LASTEXITCODE
}

# Run Angular tests
Write-Host "Running Angular unit tests..."
ng test --code-coverage --no-watch         
if ($LASTEXITCODE -ne 0) {
    Write-Host "Angular unit tests failed. Exiting..." -ForegroundColor Red
    exit $LASTEXITCODE
}

# Build the Angular project
Write-Host "Building Angular application..."
ng build --configuration production --no-progress

if ($LASTEXITCODE -ne 0) {
    Write-Host "Angular build failed. Exiting..." -ForegroundColor Red
    exit $LASTEXITCODE
}

# Step 4: Build Docker image for the frontend
Write-Host "Building Docker image for the frontend application..."

# Ensure we are in the frontend directory
$frontendDockerDir = Get-Location
$frontendImageName = "frontend-application"

docker build -t $frontendImageName $frontendDockerDir
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed for the frontend. Exiting..." -ForegroundColor Red
    exit $LASTEXITCODE
}

# Step 5: Start Docker containers using docker-compose
Set-Location .. # Move back to the project root or where docker-compose.yml resides

Write-Host "Starting Docker containers with docker-compose..."
docker-compose up --build
if ($LASTEXITCODE -ne 0) {
    Write-Host "docker-compose failed. Exiting..." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "All steps completed successfully." -ForegroundColor Green
