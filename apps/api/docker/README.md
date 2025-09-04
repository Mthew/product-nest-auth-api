# Docker Configuration Scripts

This directory contains Docker configuration files and scripts for the Product Management API.

## Files:

### mongo-init/init-db.sh

MongoDB initialization script that runs when the container starts for the first time. It:

- Creates the required database collections
- Sets up proper user permissions
- Ensures database is ready for the application

## Usage:

These files are automatically used by docker-compose.yml when starting the containers.
