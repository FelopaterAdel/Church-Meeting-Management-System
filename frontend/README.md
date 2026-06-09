# Frontend - React + TypeScript + Vite

A modern, production-ready React frontend for the Church Meeting Management System with Material UI, authentication, and protected routes.

## 📋 Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool & dev server
- **Material-UI (MUI)** - Component library
- **React Router** - Routing and navigation
- **React Query** - Server state management
- **Axios** - HTTP client

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Server runs at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/                 # API integration layer
│   │   ├── client.ts        # Axios instance with interceptors
│   │   └── auth.ts          # Authentication endpoints
│   ├── components/          # Reusable components
│   │   ├── Layout/          # Layout components
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/             # React Context
│   │   └── AuthContext.tsx  # Authentication state
│   ├── hooks/               # Custom hooks
│   │   ├── useQuery.ts      # Data fetching wrapper
│   │   └── index.ts
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Members.tsx
│   │   ├── Settings.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Unauthorized.tsx
│   ├── routes/              # Route configuration
│   │   └── index.tsx
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── .env.example             # Example env file
└── vite.config.ts           # Vite configuration
```

## 🔐 Authentication

### Auth Flow
1. User logs in via `/login` page
2. API returns JWT token and user data
3. Token stored in localStorage
4. Token automatically injected in API requests
5. On 401 response, user redirected to login

### Protected Routes
Routes are protected using `ProtectedRoute` wrapper:

```tsx
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

## 🌐 API Integration

### Environment Setup

Create `.env` file in frontend root:

```
VITE_API_URL=http://localhost:5000/api
```

### Making API Calls

**Using the custom hook:**
```tsx
import { useQuery } from '@/hooks';

function MyComponent() {
  const { data, isLoading, error } = useQuery(
    ['users'],
    '/users'
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{/* render data */}</div>;
}
```

**Using axios directly:**
```tsx
import axiosInstance from '@/api/client';

const response = await axiosInstance.get('/users');
```

### Auth Context

Access user data and auth methods:

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Hello, {user?.name}!</p>}
      <button onClick={() => login('email@example.com', 'password')}>
        Login
      </button>
    </div>
  );
}
```

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript checks |

## 🏗️ Architecture

### API Layer (`api/`)
- Centralized Axios configuration
- Request/response interceptors
- Automatic token injection
- 401 error handling

### State Management
- **AuthContext** - Authentication state
- **React Query** - Server state
- **localStorage** - Persistence

### Components
- **MainLayout** - App wrapper with header & sidebar
- **ProtectedRoute** - Route guards
- **Header** - Top navigation
- **Sidebar** - Side navigation

### Pages
- **Dashboard** - Main page
- **Members** - Member management
- **Settings** - User settings
- **Login/Register** - Auth pages

## 🎨 Theming

Material-UI theme configured in `App.tsx`:

```tsx
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});
```

Customize by modifying the `theme` object.

## 📱 Responsive Design

- Mobile-first approach
- MUI breakpoints: xs, sm, md, lg, xl
- Responsive sidebar (auto-collapses on mobile)

## 🔗 API Endpoints Expected

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| POST | `/auth/logout` | User logout |
| GET | `/auth/me` | Get current user |
| POST | `/auth/refresh` | Refresh token |
| GET | `/users` | Get all users |
| GET | `/meetings` | Get all meetings |

## 🐛 Troubleshooting

### Port already in use
```bash
npm run dev -- --port 5174
```

### Build errors
```bash
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

### CORS issues
Ensure backend is running and `VITE_API_URL` is correct.

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vite.dev/guide/)
- [Material-UI Documentation](https://mui.com)
- [React Router Documentation](https://reactrouter.com)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com)

## 📝 License

This project is part of the Church Meeting Management System.
