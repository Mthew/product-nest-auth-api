# 🌱 Croper - Agricultural Product Management System

A full-stack agricultural product catalog and management platform built with modern technologies. This monorepo contains both the frontend web application and backend API, providing a complete solution for agricultural businesses to manage their product inventories.

## 🎯 Project Overview

**Croper** is designed to streamline agricultural product management with features including:

- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- 📦 **Product Catalog Management** - Complete CRUD operations for agricultural products
- 📄 **Smart Pagination & Filtering** - Efficient product browsing and search
- 📊 **Analytics Dashboard** - Product statistics and inventory insights
- 🏗️ **Clean Architecture** - Both frontend and backend follow Clean Architecture principles
- 📱 **Responsive Design** - Mobile-first approach with modern UI components

## 🏗️ Project Structure

This is a **pnpm workspace monorepo** containing two main applications:

```
product-nest-auth-api/
├── apps/
│   ├── web/                    # Frontend Application (Next.js)
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router
│   │   │   ├── components/    # UI Components (shadcn/ui)
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── modules/       # Domain modules
│   │   │   ├── stores/        # Zustand state management
│   │   │   └── services/      # API integration
│   │   ├── doc/context.md     # Web app documentation
│   │   └── README.md          # Web app setup guide
│   │
│   └── api/                    # Backend Application (NestJS)
│       ├── src/
│       │   ├── modules/       # Feature modules
│       │   │   ├── auth/      # Authentication module
│       │   │   ├── products/  # Product management
│       │   │   └── user/      # User management
│       │   └── core/          # Core infrastructure
│       ├── doc/context.md     # API documentation
│       └── README.md          # API setup guide
│
├── package.json               # Root package.json with workspace scripts
├── pnpm-workspace.yaml       # pnpm workspace configuration
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **pnpm** (recommended package manager)
- **MongoDB** (for the database)
- **Docker** (optional, for containerized setup)

### Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Mthew/product-nest-auth-api.git
   cd product-nest-auth-api
   ```

2. **Install dependencies for all workspaces**:

   ```bash
   pnpm install
   ```

3. **Build all applications**:

   ```bash
   pnpm run build
   ```

4. **Start development servers**:
   ```bash
   # Run both API and web app in parallel
   pnpm run dev
   ```

### Alternative Development Commands

```bash
# Run only the web application
pnpm run dev:web

# Run only the API
pnpm run dev:api

# Build specific applications
pnpm run build:web
pnpm run build:api
```

### Environment Setup

Each application requires environment variables:

**API** (`apps/api/.env`):

```env
DATABASE_URL=mongodb://root:mongopassword@localhost:27017/product_management?authSource=admin
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=24h
PORT=5000
```

**Web** (`apps/web/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🏛️ Architecture Overview

### 🖥️ Frontend (Next.js Web App)

**Technology Stack:**

- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript 5
- **shadcn/ui** + **Radix UI** for components
- **Tailwind CSS v4** for styling
- **Zustand** for state management
- **React Hook Form** + **Zod** for forms and validation

**Architecture:**

- **Clean Architecture** with clear layer separation
- **Domain-driven design** with feature modules
- **Custom hooks** for business logic encapsulation
- **Centralized state management** with Zustand stores
- **API integration** with custom HttpManager

**Key Features:**

- JWT authentication with persistent sessions
- Product CRUD operations with real-time updates
- Pagination (10 products per page)
- Advanced filtering and search capabilities
- Responsive dashboard with analytics

**[📖 View Web App Documentation](./apps/web/README.md)**

### 🔧 Backend (NestJS API)

**Technology Stack:**

- **NestJS 11** with TypeScript 5
- **MongoDB** with **TypeORM** for data persistence
- **Passport.js** + **JWT** for authentication
- **Docker & Docker Compose** for containerization
- **Swagger/OpenAPI** for API documentation

**Architecture:**

- **Clean Architecture** + **Domain-Driven Design (DDD)**
- **CQRS pattern** (Command Query Responsibility Segregation)
- **Repository pattern** with dependency injection
- **Modular structure** with feature-based modules
- **Role-based authorization** (Admin, Seller)

**Key Features:**

- JWT-based authentication with role management
- Complete product management with CRUD operations
- MongoDB integration with TypeORM
- Comprehensive API documentation with Swagger
- Docker support for easy deployment

**[📖 View API Documentation](./apps/api/README.md)**

## 🛠️ Development Workflow

### Workspace Management

This project uses **pnpm workspaces** for efficient dependency management:

```bash
# Install dependencies for all workspaces
pnpm install

# Add a dependency to a specific workspace
pnpm add lodash --filter api
pnpm add axios --filter web

# Run scripts across all workspaces
pnpm --recursive test
pnpm --parallel --recursive lint

# Work with specific workspace
cd apps/web && pnpm run dev
cd apps/api && pnpm run start:dev
```

### Available Scripts

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `pnpm install`       | Install dependencies for all workspaces |
| `pnpm run dev`       | Start both API and web app in parallel  |
| `pnpm run dev:web`   | Start only the web application          |
| `pnpm run dev:api`   | Start only the API server               |
| `pnpm run build`     | Build both applications                 |
| `pnpm run build:web` | Build only the web application          |
| `pnpm run build:api` | Build only the API                      |

### Docker Development

For a containerized development environment:

```bash
# Start all services (API + MongoDB)
cd apps/api
docker-compose up -d

# The API will be available at http://localhost:5000
# MongoDB will be available at localhost:27017
```

## 📊 System Integration

### Data Flow Architecture

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│   Web Frontend  │ ←─────────────────→ │   NestJS API    │
│   (Next.js)     │    JWT Auth         │                 │
└─────────────────┘                     └─────────────────┘
         │                                        │
         │                                        │
    ┌─────────┐                              ┌─────────┐
    │ Zustand │                              │ MongoDB │
    │  Store  │                              │Database │
    └─────────┘                              └─────────┘
```

### Authentication Flow

1. **Login**: User credentials → API validation → JWT token
2. **Token Storage**: Frontend stores JWT in Zustand + localStorage
3. **API Requests**: Automatic token attachment via HttpManager
4. **Role Authorization**: Backend validates roles for protected endpoints

### Product Management Flow

1. **Frontend**: Form submission → Zustand store → API service
2. **Backend**: Controller → Application service → Domain logic → Repository
3. **Database**: MongoDB with TypeORM for data persistence
4. **Response**: Database → API → Frontend store → UI update

## 🔧 Configuration

### Environment Variables

**Required for API:**

- `DATABASE_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `JWT_EXPIRATION`: Token expiration time (default: 24h)
- `PORT`: API server port (default: 5000)

**Required for Web:**

- `NEXT_PUBLIC_API_URL`: Backend API endpoint URL

### Database Setup

**Option 1: Docker (Recommended)**

```bash
cd apps/api
docker-compose up -d mongo
```

**Option 2: Local MongoDB**

- Install MongoDB locally
- Create database: `product_management`
- Update `DATABASE_URL` in environment variables

## 🧪 Testing

```bash
# Run tests for all workspaces
pnpm --recursive test

# Run tests for specific workspace
pnpm --filter api test
pnpm --filter web test

# E2E tests (API)
cd apps/api
pnpm run test:e2e
```

## 📖 Documentation

### Detailed Documentation

- **[Web App Architecture](./apps/web/doc/context.md)** - Complete frontend architecture guide
- **[API Architecture](./apps/api/doc/context.md)** - Complete backend architecture guide
- **[Web App Setup](./apps/web/README.md)** - Frontend installation and usage
- **[API Setup](./apps/api/README.md)** - Backend installation and usage

### API Documentation

When the API is running, visit `http://localhost:5000/api-docs` for interactive Swagger documentation.

## 🚀 Deployment

### Production Build

```bash
# Build all applications for production
pnpm run build

# Start production servers
cd apps/api && pnpm run start:prod
cd apps/web && pnpm run start
```

### Docker Deployment

```bash
# Build and run with Docker
cd apps/api
docker-compose up --build
```

## 🤝 Contributing

1. **Follow Clean Architecture** principles in both frontend and backend
2. **Use TypeScript** consistently with proper type definitions
3. **Maintain separation of concerns** across all layers
4. **Write comprehensive tests** for new features
5. **Update documentation** when adding new functionality
6. **Follow established naming conventions** and code patterns

### Code Quality

- **ESLint** and **Prettier** configured for both applications
- **TypeScript strict mode** enabled
- **Consistent file and folder structure**
- **Clean commit messages** and proper Git workflow

## 📄 License

This project is part of the Croper agricultural management system.

---

## 🆘 Getting Help

- **API Issues**: Check [API README](./apps/api/README.md) and [API Documentation](./apps/api/doc/context.md)
- **Frontend Issues**: Check [Web README](./apps/web/README.md) and [Web Documentation](./apps/web/doc/context.md)
- **General Issues**: Open an issue in this repository

**Happy farming! 🌾**
