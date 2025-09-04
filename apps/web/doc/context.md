# Web Application - Croper Product Catalog

## Project Overview

**Croper** is a modern web application built for agricultural product management and catalog display. It provides a comprehensive CRUD (Create, Read, Update, Delete) interface for managing agricultural products with authentication, pagination, and real-time state management.

### Key Features

- 🌱 **Agricultural Product Catalog**: Display and manage agricultural products with categories like Vegetables, Fruits, Grains, etc.
- 🔐 **Authentication System**: JWT-based authentication with role-based access control
- 📄 **Pagination**: Efficient pagination system displaying 10 products per page
- 🔍 **Advanced Filtering**: Search and filter products by category, name, and price
- 📊 **Dashboard Analytics**: Product statistics, total value, and low stock alerts
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- ⚡ **Real-time State Management**: Using Zustand for efficient state management

## Technology Stack

### Core Framework

- **Next.js 15.5.2** - React framework with Turbopack for fast development
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5** - Full TypeScript support for type safety

### UI & Styling

- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful & consistent icon library
- **Class Variance Authority (CVA)** - Component variant management

### State Management

- **Zustand 5.0.8** - Lightweight state management with persistence
- **Zustand Persist Middleware** - Automatic state persistence to localStorage

### Forms & Validation

- **React Hook Form 7.60.0** - Performant forms with minimal re-renders
- **Zod 3.25.67** - TypeScript-first schema validation
- **@hookform/resolvers** - Form validation resolvers

### HTTP & API

- **Axios 1.11.0** - Promise-based HTTP client
- **Custom HttpManager** - Centralized API management with interceptors

### Development & Quality

- **ESLint 9** - Code linting and formatting
- **PostCSS** - CSS processing and autoprefixing
- **Geist Font** - Modern font family by Vercel

## Project Architecture

The application follows a **Clean Architecture** approach with clear separation of concerns:

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx          # Login page (root route)
│   └── home/             # Product management page
│       ├── layout.tsx    # Home layout
│       └── page.tsx      # Main product catalog page
│
├── components/           # Reusable UI Components
│   ├── ui/              # shadcn/ui base components
│   │   ├── button.tsx   # Button component
│   │   ├── card.tsx     # Card component
│   │   ├── dialog.tsx   # Modal dialogs
│   │   ├── pagination.tsx # Custom pagination component
│   │   └── ...          # Other UI primitives
│   │
│   └── features/        # Feature-specific components
│       ├── auth/        # Authentication components
│       │   ├── login-form.tsx
│       │   └── auth-guard.tsx
│       │
│       └── product/     # Product-related components
│           ├── card.tsx              # Product card display
│           ├── product-form.tsx      # Create/Edit form
│           ├── product-filter.tsx    # Search and filter
│           └── product-management-header.tsx
│
├── hooks/               # Custom React Hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useProduct.ts   # Product management hook
│   └── usePagination.ts # Pagination logic hook
│
├── lib/                 # Utility Libraries
│   ├── httpManager.ts  # Centralized HTTP client
│   └── utils.ts        # Common utilities
│
├── modules/            # Domain Modules (Clean Architecture)
│   ├── auth/           # Authentication domain
│   │   ├── domain/
│   │   │   └── entities/  # Auth entities and interfaces
│   │   └── application/   # Auth use cases
│   │
│   └── product/        # Product domain
│       ├── domain/
│       │   └── entities/  # Product entities and interfaces
│       └── application/   # Product use cases
│
├── services/           # External Services
│   └── api.service.ts  # API service layer
│
├── stores/             # Zustand State Stores
│   ├── auth.ts         # Authentication state
│   └── product.ts      # Product management state
│
└── tests/              # Test files
    └── api-test.ts     # API testing utilities
```

## Architectural Patterns

### 1. **Clean Architecture Implementation**

The project implements Clean Architecture principles:

- **Domain Layer**: Pure business logic in `modules/*/domain/`
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: External concerns (API, storage)
- **Presentation Layer**: UI components and hooks

### 2. **State Management with Zustand**

```typescript
// Centralized state with persistence
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (credentials) => {
        /* ... */
      },
      logout: async () => {
        /* ... */
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### 3. **Custom Hook Pattern**

Business logic is encapsulated in custom hooks:

```typescript
// useProduct.ts - Product management logic
export const useProduct = (): UseProductReturn => {
  const store = useProductStore();

  return {
    products: store.products,
    loading: store.loading,
    createProduct: store.createProduct,
    // ... other methods
  };
};
```

### 4. **HTTP Management Layer**

Centralized HTTP client with interceptors:

```typescript
class HttpManager {
  private axiosInstance: AxiosInstance;

  // Request/Response interceptors
  // Auto token management
  // Error handling
  // Retry logic
}
```

## Key Components

### 1. **Authentication System**

- **JWT-based authentication** with automatic token management
- **Role-based access control** (Seller, Admin, etc.)
- **Persistent login state** with localStorage
- **Auth guards** for route protection

### 2. **Product Management**

- **CRUD operations** for agricultural products
- **Real-time state updates** with Zustand
- **Form validation** with React Hook Form + Zod
- **Image upload support** (planned)

### 3. **Pagination System**

- **Custom pagination hook** (`usePagination`)
- **Reusable pagination component** with ellipsis
- **10 items per page** with configurable sizing
- **Integration with filtering and search**

### 4. **Dashboard Analytics**

- **Product statistics**: Total count, value, low stock alerts
- **Category breakdown**: Products per category
- **Real-time calculations** based on current data

## Data Flow

### Authentication Flow

```
Login Form → useAuth → AuthStore → HttpManager → API → Token Storage
```

### Product Management Flow

```
Product Form → useProduct → ProductStore → ApiService → HttpManager → API
```

### State Persistence

```
Zustand Store → Persist Middleware → localStorage → Hydration on Load
```

## Environment Configuration

### Required Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000  # Backend API URL
```

### Build Configuration

- **Turbopack** enabled for faster builds
- **TypeScript** strict mode enabled
- **ESLint** with Next.js configuration
- **PostCSS** with Tailwind processing

## Development Workflow

### 1. **Component Development**

- Components follow shadcn/ui patterns
- Proper TypeScript interfaces
- Responsive design with Tailwind
- Accessibility considerations with Radix UI

### 2. **State Management**

- Zustand stores for each domain
- Persistence for critical state
- Custom hooks for component integration

### 3. **API Integration**

- Centralized API service layer
- Automatic error handling
- Token-based authentication

## Performance Optimizations

### 1. **Next.js Optimizations**

- **App Router** for improved performance
- **Turbopack** for faster builds
- **Automatic code splitting**
- **Image optimization** (ready for implementation)

### 2. **React Optimizations**

- **useMemo** for expensive calculations
- **Custom hooks** to avoid prop drilling
- **Controlled re-renders** with Zustand

### 3. **Bundle Optimizations**

- **Tree shaking** with ES modules
- **Dynamic imports** for code splitting
- **Minimal dependencies** approach

## Security Considerations

### 1. **Authentication Security**

- JWT tokens with expiration
- Automatic token removal on logout
- HTTP-only considerations for production

### 2. **API Security**

- Request/Response interceptors
- Automatic error handling
- CORS considerations

### 3. **Input Validation**

- Client-side validation with Zod
- XSS prevention with React's built-in protection
- Form sanitization

## Future Enhancements

### Planned Features

- [ ] **Image Upload**: Product image management
- [ ] **Advanced Analytics**: Charts and reports
- [ ] **Export Functionality**: CSV/PDF exports
- [ ] **Real-time Updates**: WebSocket integration
- [ ] **Mobile App**: React Native version
- [ ] **Offline Support**: PWA capabilities
- [ ] **Multi-language**: Internationalization (i18n)

### Performance Improvements

- [ ] **Caching Strategy**: React Query integration
- [ ] **Virtual Scrolling**: For large product lists
- [ ] **Lazy Loading**: Component and route-based
- [ ] **CDN Integration**: Asset optimization

## Getting Started

### Development Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start
```

### Project Structure Guidelines

- Keep components small and focused
- Use TypeScript interfaces for all data
- Follow naming conventions consistently
- Maintain separation of concerns
- Write self-documenting code

## Conclusion

The Croper web application represents a modern, scalable approach to agricultural product management. With its clean architecture, robust state management, and comprehensive feature set, it provides a solid foundation for agricultural businesses to manage their product catalogs efficiently.

The combination of Next.js, Zustand, shadcn/ui, and Tailwind CSS creates a powerful, maintainable, and user-friendly application that can scale with business needs.
