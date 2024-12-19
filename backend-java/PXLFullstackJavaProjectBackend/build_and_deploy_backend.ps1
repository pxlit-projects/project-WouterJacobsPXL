# Step 1: Run Maven clean and package with skipping tests
Write-Host "Cleaning and packaging the Maven project..."
mvn clean package -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "Maven build failed. Exiting..." -ForegroundColor Red
    exit $LASTEXITCODE
}

# Step 2: Find and build Docker images for each Dockerfile in the current directory and subdirectories
Write-Host "Building Docker images..."

# Get the current directory
$currentDir = Get-Location

# Find all Dockerfiles in the current directory and subdirectories
$dockerfiles = Get-ChildItem -Path $currentDir -Recurse -Filter Dockerfile
foreach ($dockerfile in $dockerfiles) {
    # Get the directory containing the Dockerfile
    $dockerDir = $dockerfile.DirectoryName
    $imageName = (Split-Path -Leaf $dockerDir).ToLower() # Use folder name as Docker image name and force it to lowercase

    Write-Host "Building Docker image: $imageName from $dockerDir..."

    # Build the Docker image
    docker build -t $imageName $dockerDir
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker build failed for $dockerDir. Exiting..." -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

# Step 3: Start Docker containers using docker-compose
Write-Host "Starting Docker containers with docker-compose..."
docker-compose up --build
if ($LASTEXITCODE -ne 0) {
    Write-Host "docker-compose failed. Exiting..." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "All steps completed successfully." -ForegroundColor Green