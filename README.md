# Product Management API

This is a **Product and Patient Management System** built with NestJS that provides authentication, authorization, and comprehensive management capabilities. The system is designed as a technical test demonstrating modern backend development practices with TypeScript, following Domain-Driven Design (DDD) and Clean Architecture principles.

## 🎯 Goals

The system manages both product catalogs and patient records, providing AI-assisted medical diagnosis suggestions based on medical history.

### Core Features:

- **Product Management**: Full CRUD operations for product catalog
- **Patient Management**: CRUD operations for patient records
- **User Authentication**: JWT-based authentication system
- **Role-Based Authorization**: Admin and Seller roles with different permissions
- **AI Diagnosis**: Integration with OpenAI and simulated AI services for medical diagnosis suggestions
- **Medical History Tracking**: Comprehensive patient medical history management
- **Product Catalog**: Comprehensive product management with categories and pricing

## 🛠️ Technology Stack

- **NestJS 11.x**
- **TypeScript 5.7.x**
- **Node.js 18+**
- **MongoDB** & **TypeORM**
- **Passport.js** & **JWT**
- **Docker & Docker Compose**
- **pnpm**

## 🚀 Getting Started

There are a few ways to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started) (for Docker-based setup)

### Option 1: Clone the repository

1.  Clone the repository to your local machine:
    ```bash
    git clone https://github.com/Mthew/product-nest-auth-api.git
    cd product-nest-auth-api
    ```

### Option 2: Download the ZIP

1.  Download the ZIP file from the repository's main page on GitHub.
2.  Extract the contents to a folder on your local machine.
3.  Open a terminal or command prompt and navigate to the project's root directory.

### Installation

Once you have the code, install the dependencies using `pnpm`:

```bash
pnpm install
```

### Running the Application Locally

1.  You will need a `.env` file for environment variables. You can create one from the `DOCKER.md` or `doc/context.md` file. Create a `.env` file in the root directory and add the necessary variables, like `DATABASE_URL`, `JWT_SECRET`, etc.

2.  Start the application in development mode:
    ```bash
    pnpm run start:dev
    ```
    The application will be available at `http://localhost:3000`.

### Running with Docker

This is the recommended way to run the project for development, as it sets up the database and the application in one command.

1.  Make sure you have Docker and Docker Compose installed.
2.  Run the following command from the project root:

    ```bash
    docker-compose up -d
    ```

    This will build the images and start the containers for the NestJS API and the MongoDB database.

3.  The API will be available at `http://localhost:3000`.
4.  To stop the services, run:
    ```bash
    docker-compose down
    ```

## 🌐 API Documentation

Once the application is running, you can access the Swagger UI for interactive API documentation at:

`http://localhost:3000/api-docs`

## 🧪 Testing

To run the tests, use the following commands:

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```
