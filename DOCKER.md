# 🐳 Docker Configuration for Product Management API

This document provides comprehensive instructions for running the Product Management API using Docker.

## 🚀 Quick Start

### Option 1: Use the automated scripts

**Windows:**

```bash
./docker-start.bat
```

**Linux/Mac:**

```bash
chmod +x docker-start.sh
./docker-start.sh
```

### Option 2: Manual Docker commands

1. **Start the application:**

```bash
docker-compose up --build -d
```

2. **View logs:**

```bash
docker-compose logs -f
```

3. **Stop the application:**

```bash
docker-compose down
```

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)
- At least 2GB of available RAM
- Ports 3000 and 27017 available

## 🏗️ Architecture

The Docker setup includes:

- **API Container**: NestJS application running on port 3000
- **MongoDB Container**: Database running on port 27017
- **Network**: Isolated Docker network for secure communication
- **Volume**: Persistent storage for MongoDB data

## 🔧 Configuration Files

### docker-compose.yml

Main orchestration file that defines:

- Services configuration
- Network setup
- Volume mounting
- Environment variables
- Health checks

### Dockerfile

Multi-stage build configuration:

- **Build stage**: Compiles TypeScript to JavaScript
- **Production stage**: Minimal runtime image with only necessary files
- Uses pnpm for faster and more efficient package management
- Non-root user for security
- Health check endpoint

### .dockerignore

Excludes unnecessary files from Docker build context for faster builds.

## 🌍 Environment Variables

### Development (.env)

Used when running locally with `pnpm run start:dev`

### Docker (.env.docker)

Production-ready configuration for Docker containers

### Key Variables:

- `DB_HOST`: Database hostname (mongodb in Docker, localhost for local dev)
- `DB_USERNAME/DB_PASSWORD`: MongoDB authentication
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Environment mode (development/production)

## 🔐 Default Credentials

The application automatically seeds these users:

**Admin User:**

- Email: `admin@example.com`
- Password: `password123`
- Role: Admin (full access)

**Seller User:**

- Email: `seller@example.com`
- Password: `password123`
- Role: Seller (limited access)

## 🏥 Health Checks

Both containers include health checks:

**MongoDB:**

- Checks database connectivity using mongosh ping
- Retries 5 times with 10s intervals

**API:**

- Checks if the API docs endpoint responds
- Retries 3 times with 30s intervals
- Waits for MongoDB to be healthy first

## 🛠️ Development Workflow

### Building and Testing

```bash
# Build without starting
docker-compose build

# Start in development mode with logs
docker-compose up --build

# Run specific service
docker-compose up mongodb

# Execute commands in running container
docker-compose exec app /bin/sh
```

### Database Operations

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u root -p password123

# Backup database
docker-compose exec mongodb mongodump --out /backup

# View MongoDB logs
docker-compose logs mongodb
```

### Troubleshooting

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs mongodb

# Restart services
docker-compose restart

# Clean rebuild
docker-compose down --volumes
docker-compose up --build
```

## 📊 Monitoring

### Container Status

```bash
# Check running containers
docker-compose ps

# View resource usage
docker stats
```

### API Endpoints

- **Health Check**: `http://localhost:3000`
- **API Documentation**: `http://localhost:3000/api-docs`
- **Authentication**: `POST http://localhost:3000/auth/login`
- **Products**: `http://localhost:3000/products`

## 🔒 Security Features

- Non-root user in production container
- Database authentication enabled
- JWT-based authentication
- Rate limiting configured
- CORS protection
- Input validation

## 📈 Performance Optimization

- Multi-stage Docker build reduces final image size
- pnpm for faster package installation
- Production-only dependencies in final stage
- Efficient caching layers in Dockerfile
- MongoDB connection pooling

## 🚨 Common Issues

### Port Conflicts

If ports 3000 or 27017 are in use:

```bash
# Check what's using the port
netstat -tulpn | grep :3000
netstat -tulpn | grep :27017

# Kill the process or change ports in docker-compose.yml
```

### Permission Issues

```bash
# Fix file permissions (Linux/Mac)
sudo chown -R $USER:$USER .

# Windows: Run Docker Desktop as administrator
```

### Memory Issues

```bash
# Increase Docker Desktop memory allocation
# Settings > Resources > Memory > Increase to 4GB+
```

## 🔄 Updates and Maintenance

### Updating Dependencies

1. Update package.json
2. Rebuild containers: `docker-compose up --build`

### Database Migration

1. Update entities in `/src/modules/*/domain/entities/`
2. Restart containers to apply schema changes
3. Use synchronize: true in development (already configured)

### Scaling

```bash
# Scale API instances (load balancer required)
docker-compose up --scale app=3
```

This Docker configuration provides a production-ready, scalable, and maintainable setup for the Product Management API.
