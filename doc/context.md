# Product Management API - Project Context

## Project Overview

This is a **Product and Patient Management System** built with NestJS that provides authentication, authorization, and comprehensive management capabilities. The system is designed as a technical test demonstrating modern backend development practices with TypeScript, following Domain-Driven Design (DDD) and Clean Architecture principles.

## 🎯 Business Domain

**Product & Healthcare Management**: The system manages both product catalogs and patient records, providing AI-assisted medical diagnosis suggestions based on medical history.

### Core Features:

- **Product Management**: Full CRUD operations for product catalog
- **Patient Management**: CRUD operations for patient records
- **User Authentication**: JWT-based authentication system
- **Role-Based Authorization**: Doctor and Patient roles with different permissions
- **AI Diagnosis**: Integration with OpenAI and simulated AI services for medical diagnosis suggestions
- **Medical History Tracking**: Comprehensive patient medical history management
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
   - AI Service Provider for multiple AI implementations
   - Repository providers for data access abstraction

4. **Strategy Pattern**
   - Multiple AI diagnosis services (OpenAI, Simulated)
   - Configurable service selection

5. **Dependency Injection**
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

### AI & External Services

- **OpenAI SDK 4.x** - AI diagnosis integration
- **Simulated AI Service** - Fallback/development AI service

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
    ├── patients/                    # Patient management module
    │   ├── application/             # Patient business logic
    │   │   ├── commands/           # CQRS commands
    │   │   ├── queries/            # CQRS queries
    │   │   ├── dtos/               # Data transfer objects
    │   │   └── services/           # Application services
    │   ├── domain/                  # Patient domain
    │   │   ├── entities/           # Domain entities
    │   │   ├── exceptions/         # Domain exceptions
    │   │   └── interfaces/         # Domain interfaces
    │   ├── infrastructure/          # Patient infrastructure
    │   │   ├── ai/                 # AI service implementations
    │   │   └── persistence/        # Repository implementations
    │   └── presentation/            # Patient controllers
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
- **Role-Based Authorization** (Doctor, Patient)
- **Password Hashing** using bcrypt
- **Input Validation** using class-validator
- **CORS** enabled for cross-origin requests
- **Global Exception Handling** for security error responses

### User Roles & Permissions

| Role        | Permissions                                                     |
| ----------- | --------------------------------------------------------------- |
| **Doctor**  | Full CRUD on patients, Generate AI diagnosis, View all patients |
| **Patient** | View/Update own patient record                                  |

## 🤖 AI Integration

### AI Diagnosis System

- **Primary Provider**: OpenAI GPT-4o-mini
- **Fallback Provider**: Simulated diagnosis service
- **Configuration**: Environment-based provider selection

### AI Capabilities

- Medical history analysis
- Symptom pattern recognition
- Diagnosis suggestions with professional recommendations
- Configurable prompts for medical context
- Error handling and fallback mechanisms

### AI Service Architecture

```typescript
IAiDiagnosisService (Interface)
├── OpenAiDiagnosisService (Production)
└── SimulatedDiagnosisService (Development/Testing)
```

## 🗄️ Database Schema

### Core Collections (MongoDB)

#### Users Collection

```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "passwordHash": "string",
  "roles": ["Doctor" | "Patient"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Patients Collection

```json
{
  "_id": "ObjectId",
  "firstName": "string",
  "lastName": "string",
  "birthDate": "Date",
  "medicalHistory": ["string"],
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

- `GET /products` - List all products (Doctor & Patient)
- `GET /products?category=Electronics` - Filter products by category (Doctor & Patient)
- `GET /products/:id` - Get product by ID (Doctor & Patient)
- `POST /products` - Create product (Doctor only)
- `PATCH /products/:id` - Update product (Doctor only)
- `DELETE /products/:id` - Delete product (Doctor only)

### Patient Management

- `GET /patients` - List all patients (Doctor only)
- `GET /patients/:id` - Get patient by ID (Doctor & Patient)
- `POST /patients` - Create patient (Doctor only)
- `PATCH /patients/:id` - Update patient (Doctor & Patient)
- `DELETE /patients/:id` - Delete patient (Doctor only)
- `POST /patients/:id/diagnosis-ai` - Generate AI diagnosis (Doctor only)

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

# AI Services
AI_SERVICE_PROVIDER=simulated  # or 'openai'
OPENAI_API_KEY=your_openai_key

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
- AI service failover mechanisms
- Comprehensive error handling and logging

## 🎯 Key Business Rules

1. **Patient Data Access**: Patients can only access their own records
2. **Doctor Privileges**: Doctors have full access to all patient records
3. **AI Diagnosis**: Only doctors can generate AI diagnosis
4. **Medical History**: Automatically tracked with timestamps
5. **Data Validation**: Strict validation on all patient data inputs

## 🔄 CQRS Implementation

### Commands (Write Operations)

**Products:**

- `CreateProductCommand` - Create new product
- `UpdateProductCommand` - Update product information
- `DeleteProductCommand` - Remove product record

**Patients:**

- `CreatePatientCommand` - Create new patient
- `UpdatePatientCommand` - Update patient information
- `DeletePatientCommand` - Remove patient record
- `GenerateDiagnosisCommand` - Generate AI diagnosis

### Queries (Read Operations)

**Products:**

- `FindAllProductsQuery` - Retrieve all products (with optional category filter)
- `FindProductByIdQuery` - Get specific product

**Patients:**

- `FindAllPatientsQuery` - Retrieve all patients
- `FindPatientByIdQuery` - Get specific patient

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

_This documentation provides a comprehensive understanding of the Patient Management System architecture, technologies, and implementation details. It serves as a reference for developers working on the project and stakeholders understanding the system capabilities._
