# Frontend Structure

## Folder Organization

```
src/
├── api/                 # API client and endpoints
│   ├── client.ts        # Axios instance with interceptors
│   └── auth.ts          # Authentication API calls
├── components/          # Reusable React components
│   ├── Layout/          # Layout components
│   │   ├── MainLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── ProtectedRoute.tsx
├── context/             # React Context providers
│   └── AuthContext.tsx  # Authentication context
├── hooks/               # Custom React hooks
│   ├── useQuery.ts      # Custom query hook wrapper
│   └── index.ts
├── pages/               # Page components
│   ├── Dashboard.tsx
│   ├── Members.tsx
│   ├── Settings.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Unauthorized.tsx
├── routes/              # Route configuration
│   └── index.tsx
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
├── App.tsx              # Main App component
├── main.tsx             # React DOM entry point
└── index.css            # Global styles
```

## Architecture Overview

### API Layer (`api/`)
- **client.ts**: Configured Axios instance with:
  - Base URL from environment variables
  - Request interceptor for auth token injection
  - Response interceptor for 401 handling
- **auth.ts**: Authentication API endpoints

### State Management
- **AuthContext**: Provides authentication state and methods
  - User data, token, loading states
  - login, logout, register functions
  - Local storage persistence

### Components
- **MainLayout**: Main app layout with header and sidebar
- **Header**: Top navigation with user menu
- **Sidebar**: Navigation drawer with menu items
- **ProtectedRoute**: Route protection with role-based access

### Pages
- **Dashboard**: Main dashboard (protected)
- **Members**: Members management (protected)
- **Settings**: User settings (protected)
- **Login**: Public login page
- **Register**: Public registration page
- **Unauthorized**: 403 error page

### Routing
- Public routes: /login, /register
- Protected routes: /, /members, /settings
- Role-based protection available
- Automatic redirect for unauthenticated users

## Key Features

1. **Authentication Flow**
   - JWT token-based authentication
   - Auto-refresh on 401 responses
   - Local storage persistence
   - Logout on invalid token

2. **Protected Routes**
   - Guards against unauthorized access
   - Redirects to login if not authenticated
   - Optional role-based access control

3. **API Integration**
   - Centralized Axios configuration
   - Automatic token injection
   - Error handling with interceptors
   - React Query integration for data fetching

4. **Layout System**
   - Responsive sidebar (collapsible on mobile)
   - Persistent header with user menu
   - Mobile-friendly design

## Environment Variables

Create `.env` file in frontend root:

```
VITE_API_URL=http://localhost:5000/api
```

## Usage Examples

### Using Auth Context
```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // ...
}
```

### Using Query Hook
```typescript
import { useQuery } from '@/hooks';

function MyComponent() {
  const { data, isLoading, error } = useQuery(['users'], '/users');
  // ...
}
```

### Creating Protected Pages
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';
import MyPage from '@/pages/MyPage';

<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <MyPage />
    </ProtectedRoute>
  }
/>
```
