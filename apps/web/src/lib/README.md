# HttpManager - Singleton Axios Helper

A comprehensive singleton class for managing HTTP requests with authentication, error handling, and REST verb methods.

## Features

- ✅ **Singleton Pattern**: Single instance across the application
- ✅ **Authentication Management**: Automatic token handling
- ✅ **Request/Response Interceptors**: Logging and error handling
- ✅ **REST Verb Methods**: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- ✅ **File Upload/Download**: Multipart form data and blob handling
- ✅ **Error Handling**: Consistent error formatting and handling
- ✅ **TypeScript Support**: Full type safety
- ✅ **Environment Configuration**: Configurable base URL and timeout

## Quick Start

### Basic Usage

```typescript
import { httpManager } from "../lib/httpManager";

// GET request
const response = await httpManager.get("/users");

// POST request
const newUser = await httpManager.post("/users", {
  name: "John Doe",
  email: "john@example.com",
});

// PUT request
const updatedUser = await httpManager.put("/users/1", userData);

// DELETE request
await httpManager.delete("/users/1");
```

### Authentication

```typescript
// Set authentication token (automatically adds Bearer prefix)
httpManager.setAuthToken("your-jwt-token");

// Remove authentication token
httpManager.removeAuthToken();

// The token is automatically included in all subsequent requests
```

### With Auth Store Integration

```typescript
import { useAuth } from "../hooks/useAuth";
import { httpManager } from "../lib/httpManager";

function MyComponent() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      httpManager.setAuthToken(user.token);
    } else {
      httpManager.removeAuthToken();
    }
  }, [user?.token]);

  const fetchData = async () => {
    try {
      const response = await httpManager.get("/protected-endpoint");
      console.log(response.data);
    } catch (error) {
      console.error("Request failed:", error);
    }
  };
}
```

## API Reference

### Authentication Methods

```typescript
// Set Bearer token
httpManager.setAuthToken(token: string): void

// Remove Bearer token
httpManager.removeAuthToken(): void

// Set custom header
httpManager.setHeader(key: string, value: string): void

// Remove custom header
httpManager.removeHeader(key: string): void
```

### Configuration Methods

```typescript
// Update base URL
httpManager.setBaseURL(url: string): void

// Update timeout (milliseconds)
httpManager.setTimeout(timeout: number): void
```

### HTTP Verb Methods

All methods return `Promise<ApiResponse<T>>` where:

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
```

#### GET Request

```typescript
httpManager.get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
```

#### POST Request

```typescript
httpManager.post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
```

#### PUT Request

```typescript
httpManager.put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
```

#### PATCH Request

```typescript
httpManager.patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
```

#### DELETE Request

```typescript
httpManager.delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
```

#### HEAD Request

```typescript
httpManager.head(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<any>>
```

#### OPTIONS Request

```typescript
httpManager.options(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<any>>
```

### File Operations

#### Upload File

```typescript
httpManager.uploadFile<T>(
  url: string,
  file: File,
  fieldName?: string,
  additionalData?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>>

// Example
const file = document.querySelector('input[type="file"]').files[0];
await httpManager.uploadFile('/upload', file, 'image', {
  description: 'Profile picture'
});
```

#### Download File

```typescript
httpManager.downloadFile(
  url: string,
  filename?: string,
  config?: AxiosRequestConfig
): Promise<void>

// Example
await httpManager.downloadFile('/files/report.pdf', 'monthly-report.pdf');
```

### Advanced Usage

#### Custom Request

```typescript
httpManager.request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>>

// Example
const response = await httpManager.request({
  method: 'POST',
  url: '/custom-endpoint',
  data: { custom: 'data' },
  headers: { 'X-Custom-Header': 'value' }
});
```

#### Get Raw Axios Instance

```typescript
const axiosInstance = httpManager.getAxiosInstance();
// Use for advanced axios features not exposed by HttpManager
```

## Error Handling

The HttpManager provides consistent error handling:

```typescript
interface ApiError {
  message: string;
  status: number;
  data?: any;
}
```

### Global Error Handling

The HttpManager automatically handles common HTTP status codes:

- **401 Unauthorized**: Removes auth token and can redirect to login
- **403 Forbidden**: Logs insufficient permissions
- **404 Not Found**: Logs resource not found
- **500 Internal Server Error**: Logs server error

### Custom Error Handling

```typescript
try {
  const response = await httpManager.get("/api/data");
  // Handle success
} catch (error: ApiError) {
  switch (error.status) {
    case 404:
      console.log("Data not found");
      break;
    case 500:
      console.log("Server error");
      break;
    default:
      console.log(`Error: ${error.message}`);
  }
}
```

## Environment Configuration

Set your API base URL in your environment variables:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

If not set, defaults to `http://localhost:3001/api`.

## Integration with API Service

For organized API calls, use the companion `ApiService`:

```typescript
import { apiService } from "../services/api.service";

// Auth endpoints
await apiService.auth.login(email, password);
await apiService.auth.logout();

// User endpoints
const users = await apiService.users.getAll();
const user = await apiService.users.getById("123");

// Product endpoints
const products = await apiService.products.getAll({ category: "electronics" });
```

## Request/Response Interceptors

The HttpManager includes built-in interceptors:

### Request Interceptor

- Logs outgoing requests in development mode
- Automatically includes authentication headers

### Response Interceptor

- Logs successful responses in development mode
- Handles common error scenarios
- Formats errors consistently

## Type Safety

Full TypeScript support with generic types:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// Type-safe response
const response = await httpManager.get<User[]>("/users");
const users: User[] = response.data;

// Type-safe request
const newUser = await httpManager.post<User>("/users", {
  name: "John",
  email: "john@example.com",
});
```

## Best Practices

1. **Use the singleton instance**: Always import `httpManager` instead of creating new instances
2. **Handle errors consistently**: Use try-catch blocks for all HTTP requests
3. **Type your responses**: Use TypeScript generics for better type safety
4. **Set tokens properly**: Use the auth integration to automatically manage tokens
5. **Environment variables**: Configure base URL through environment variables
6. **Loading states**: Show loading indicators during requests

## Examples

Check out the demo component at `src/components/features/http/http-manager-demo.tsx` for interactive examples and testing.

## Files Structure

```
src/
├── lib/
│   └── httpManager.ts          # Main HttpManager class
├── services/
│   └── api.service.ts          # API service integration
└── components/
    └── features/
        └── http/
            └── http-manager-demo.tsx  # Demo component
```
