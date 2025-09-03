#!/bin/bash
# Easy Docker Setup Script for Product Management API

echo "🚀 Starting Product Management API with Docker..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Clean up any existing containers (optional)
echo "🧹 Cleaning up existing containers..."
docker-compose down --remove-orphans

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Services started successfully!"
    echo ""
    echo "📱 API is available at: http://localhost:3000"
    echo "📚 API Documentation: http://localhost:3000/api-docs"
    echo "🗄️  MongoDB: localhost:27017"
    echo ""
    echo "🔐 Default credentials:"
    echo "   Admin: admin@example.com / password123"
    echo "   Seller: seller@example.com / password123"
    echo ""
    echo "📊 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
else
    echo ""
    echo "❌ Failed to start services. Check logs with: docker-compose logs"
    exit 1
fi
