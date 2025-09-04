# 🌱 Croper - Web Application

A modern agricultural product catalog and management system built with Next.js, featuring comprehensive CRUD operations, authentication, and real-time state management.

## ✨ Features

- 🔐 **JWT Authentication** - Secure login with role-based access control
- 📦 **Product Management** - Complete CRUD operations for agricultural products
- 📄 **Smart Pagination** - Efficient browsing with 10 products per page
- 🔍 **Advanced Filtering** - Search by name, category, and price range
- 📊 **Dashboard Analytics** - Product statistics and inventory insights
- 📱 **Responsive Design** - Mobile-first UI with Tailwind CSS
- ⚡ **Real-time State** - Zustand-powered state management with persistence

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Backend API running on port 5000

### Installation & Setup

1. **Clone and navigate to the web app**:

   ```bash
   cd apps/web
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up environment variables**:

   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
   ```

4. **Start the development server**:

   ```bash
   pnpm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build the application
pnpm run build

# Start production server
pnpm run start
```

## 🏗️ Architecture Overview

Croper follows **Clean Architecture** principles with a modern React ecosystem. The application is structured in distinct layers:

- **Domain Layer**: Pure business logic and entities (`/modules`)
- **Application Layer**: Use cases and custom hooks (`/hooks`)
- **Infrastructure Layer**: API services and external integrations (`/services`, `/lib`)
- **Presentation Layer**: UI components and pages (`/components`, `/app`)

**State Management** is handled by **Zustand** with persistent stores for authentication and product data. **shadcn/ui** components provide a consistent, accessible design system built on **Radix UI** primitives, styled with **Tailwind CSS**.

The **HttpManager** centrally handles all API communications with automatic token management, request/response interceptors, and error handling.

**[📖 View Complete Architecture Documentation](./doc/context.md)**

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router (pages & layouts)
├── components/
│   ├── ui/          # shadcn/ui base components
│   └── features/    # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── modules/         # Domain modules (Clean Architecture)
├── services/        # API service layer
└── stores/          # Zustand state stores
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with Turbopack
- **Language**: TypeScript 5
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand with persistence
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with custom wrapper
- **Icons**: Lucide React

## 🎯 Available Scripts

| Command          | Description                             |
| ---------------- | --------------------------------------- |
| `pnpm run dev`   | Start development server with Turbopack |
| `pnpm run build` | Build production application            |
| `pnpm run start` | Start production server                 |
| `pnpm run lint`  | Run ESLint for code quality             |

## 🔧 Configuration

### Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:5000  # Backend API endpoint

# Optional
NEXT_PUBLIC_APP_ENV=development           # Application environment
```

### shadcn/ui Configuration

The project uses shadcn/ui with the following setup:

- **Style**: New York
- **Base Color**: Neutral
- **CSS Variables**: Enabled
- **Icon Library**: Lucide

## 📝 Usage Examples

### Authentication

```typescript
const { user, isAuthenticated, login, logout } = useAuth();

// Login user
await login({ email: "user@example.com", password: "password" });

// Check authentication status
if (isAuthenticated) {
  console.log("User logged in:", user.email);
}
```

### Product Management

```typescript
const { products, createProduct, updateProduct, deleteProduct } = useProduct();

// Create new product
const newProduct = await createProduct({
  name: "Organic Tomatoes",
  description: "Fresh organic tomatoes",
  price: 5.99,
  category: "Vegetables",
});
```

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript interfaces for all data types
3. Maintain component separation of concerns
4. Write self-documenting code with clear naming
5. Test changes thoroughly before committing

## 📄 License

This project is part of the Croper agricultural management system.

---

**Need help?** Check out the [detailed documentation](./doc/context.md) or open an issue in the repository.
