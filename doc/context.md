# Product Management API - Project Context

## Project Overview

This is a **Product Management System** built with NestJS that provides authentication, authorization, and comprehensive management capabilities. The system is designed as a technical test demonstrating modern backend development practices with TypeScript, following Domain-Driven Design (DDD) and Clean Architecture principles.

## 🎯 Business Domain

**Product Management**: The system manages product catalogs, providing a comprehensive solution for product administration.

### Core Features:

- **Product Management**: Full CRUD operations for product catalog
- **User Authentication**: JWT-based authentication system
- **Role-Based Authorization**: Admin and Seller roles with different permissions
- **Product Catalog**: Comprehensive product management with categories and pricing

## 🏗️ Architecture & Design Patterns

### Architecture Style: **Clean Architecture + Domain-Driven Design (DDD)**

```
┌─ Presentation Layer (Controllers) ──────────┐
│                                            │
├─ Application Layer (CQRS, DTOs, Services) ─┤
│                                            │
├─ Domain Layer (Entities, Interfaces) ──────┤
│                                            │
└─ Infrastructure Layer (Repos, External) ───┘
```

### Key Patterns Implemented:

1. **CQRS (Command Query Responsibility Segregation)**
   - Commands: Create, Update, Delete operations
   - Queries: Read operations
   - Handlers: Separate business logic for each operation

2. **Repository Pattern**
   - Abstract interfaces in domain layer
   - Concrete implementations in infrastructure layer
   - Dependency injection for loose coupling

3. **Provider Pattern**
   - Repository providers for data access abstraction

4. **Dependency Injection**
   - NestJS native DI container
   - Interface-based dependencies

## 🛠️ Technology Stack

### Core Framework & Language

- **NestJS 11.x** - Progressive Node.js framework
- **TypeScript 5.7.x** - Strongly typed JavaScript
- **Node.js 18+** - Runtime environment

### Database & ORM

- **MongoDB** - Primary NoSQL database for flexible document storage
- **TypeORM 0.3.x** - Object-Document Mapping for MongoDB

### Authentication & Security

- **Passport.js** - Authentication middleware
- **JWT (JSON Web Tokens)** - Token-based authentication
- **bcrypt** - Password hashing
- **class-validator** - Input validation
- **class-transformer** - Data transformation

### Development & Build Tools

- **pnpm** - Package manager
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **SWC** - Fast TypeScript/JavaScript compiler
- **Docker & Docker Compose** - Containerization

### Documentation & API

- **Swagger/OpenAPI** - API documentation
- **swagger-ui-express** - Interactive API docs

## 📁 Project Structure

```
src/
├── main.ts                           # Application bootstrap
├── app.module.ts                     # Root module
├── core/                            # Core infrastructure
│   ├── filters/                     # Global exception filters
│   ├── infrastructure/              # Infrastructure concerns
│   │   └── persistence/             # Database configuration
│   ├── interfaces/                  # Core interfaces
│   └── services/                    # Core services (seeding)
└── modules/                         # Feature modules
    ├── auth/                        # Authentication module
    │   ├── application/             # Auth business logic
    │   │   ├── dtos/               # Data transfer objects
    │   │   ├── guards/             # Auth guards
    │   │   ├── services/           # Auth services
    │   │   └── strategies/         # Passport strategies
    │   ├── domain/                  # Auth domain logic
    │   │   └── decorators/         # Custom decorators
    │   └── presentation/            # Auth controllers
    ├── products/                    # Product management module
    │   ├── application/             # Product business logic
    │   │   ├── commands/           # CQRS commands
    │   │   ├── queries/            # CQRS queries
    │   │   ├── dtos/               # Data transfer objects
    │   │   └── services/           # Application services
    │   ├── domain/                  # Product domain
    │   │   ├── entities/           # Domain entities
    │   │   ├── exceptions/         # Domain exceptions
    │   │   └── interfaces/         # Domain interfaces
    │   ├── infrastructure/          # Product infrastructure
    │   │   └── persistence/        # Repository implementations
    │   └── presentation/            # Product controllers
    └── user/                        # User management module
        ├── application/             # User business logic
        ├── domain/                  # User domain
        └── infrastructure/          # User infrastructure
```

## 🔐 Security & Authentication

### Authentication Flow

1. **User Registration/Login** → JWT token generation
2. **Token Validation** → JWT strategy validates incoming requests
3. **Role-Based Access** → Guards check user roles for endpoint access

### Security Features

- **JWT Authentication** with configurable expiration
- **Role-Based Authorization** (Admin, Seller)
- **Password Hashing** using bcrypt
- **Input Validation** using class-validator
- **CORS** enabled for cross-origin requests
- **Global Exception Handling** for security error responses

### User Roles & Permissions

| Role       | Permissions                                        |
| ---------- | -------------------------------------------------- |
| **Admin**  | Full CRUD on products, View all records            |
| **Seller** | View/Update products, Read-only access to catalogs |

## 🗄️ Database Schema

### Core Collections (MongoDB)

#### Users Collection

```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "passwordHash": "string",
  "roles": ["Admin" | "Seller"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Products Collection

```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "price": "decimal",
  "category": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 🛠️ Development Workflow

### Environment Setup

```bash
# Install dependencies
pnpm install

# Development mode
pnpm run start:dev

# Production build
pnpm run build
pnpm run start:prod
```

### Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api
```

### Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 🌐 API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Product Management

- `GET /products` - List all products (Admin & Seller)
- `GET /products?category=Electronics` - Filter products by category (Admin & Seller)
- `GET /products/:id` - Get product by ID (Admin & Seller)
- `POST /products` - Create product (Admin only)
- `PATCH /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)

### API Documentation

- Available at `/api-docs` when running the application
- Interactive Swagger UI with authentication support

## ⚙️ Configuration

### Environment Variables

```env
# Database
DATABASE_URL=mongodb://root:mongopassword@mongo:27017/product_management?authSource=admin

# JWT
JWT_SECRET=LUtFvBbMYwx0vXnf
JWT_EXPIRATION=24h

# Application
PORT=3000
NODE_ENV=development
```

## 🧪 Testing Strategy

### Test Types

- **Unit Tests**: Individual component testing
- **Integration Tests**: Module interaction testing
- **E2E Tests**: Full application flow testing

### Testing Tools

- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertion library for E2E tests
- **NestJS Testing**: Framework-specific testing utilities

## 🚀 Deployment

### Docker Deployment

- Multi-stage Dockerfile for optimized production builds
- Docker Compose for local development environment
- PostgreSQL container for data persistence

### Production Considerations

- Environment-based configuration
- Database migrations (TypeORM synchronize in development only)
- Comprehensive error handling and logging

## 🎯 Key Business Rules

1. **Admin Privileges**: Admins have full access to all product records
2. **Data Validation**: Strict validation on all product data inputs

## 🔄 CQRS Implementation

### Commands (Write Operations)

**Products:**

- `CreateProductCommand` - Create new product
- `UpdateProductCommand` - Update product information
- `DeleteProductCommand` - Remove product record

### Queries (Read Operations)

**Products:**

- `FindAllProductsQuery` - Retrieve all products (with optional category filter)
- `FindProductByIdQuery` - Get specific product

### Benefits

- **Separation of Concerns**: Read/write operations isolated
- **Scalability**: Different optimization strategies for reads vs writes
- **Maintainability**: Clear business logic separation
- **Testing**: Easier to test individual operations

## 📝 Code Quality & Standards

### Code Style

- **ESLint**: Enforced coding standards
- **Prettier**: Consistent code formatting
- **TypeScript**: Strong typing throughout

### Best Practices

- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Depend on abstractions
- **Single Responsibility**: Each class has one purpose
- **Error Boundaries**: Comprehensive error handling
- **Logging**: Structured logging throughout application

---

_This documentation provides a comprehensive understanding of the Product Management System architecture, technologies, and implementation details. It serves as a reference for developers working on the project and stakeholders understanding the system capabilities._
