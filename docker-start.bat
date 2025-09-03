@echo off
REM Easy Docker Setup Script for Product Management API (Windows)

echo 🚀 Starting Product Management API with Docker...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Check if docker-compose is available  
docker-compose --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ docker-compose is not installed. Please install Docker Compose and try again.
    pause
    exit /b 1
)

echo ✅ Docker is running
echo.

REM Clean up any existing containers (optional)
echo 🧹 Cleaning up existing containers...
docker-compose down --remove-orphans

REM Build and start services
echo 🔨 Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 15 /nobreak >nul

REM Check if services are running
docker-compose ps | findstr "Up" >nul
if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ Services started successfully!
    echo.
    echo 📱 API is available at: http://localhost:3000
    echo 📚 API Documentation: http://localhost:3000/api-docs
    echo 🗄️  MongoDB: localhost:27017
    echo.
    echo 🔐 Default credentials:
    echo    Admin: admin@example.com / password123
    echo    Seller: seller@example.com / password123
    echo.
    echo 📊 To view logs: docker-compose logs -f
    echo 🛑 To stop: docker-compose down
    echo.
    echo Press any key to continue...
    pause >nul
) else (
    echo.
    echo ❌ Failed to start services. Check logs with: docker-compose logs
    pause
    exit /b 1
)
