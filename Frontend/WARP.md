# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the frontend of an Activity Tracker application built with SvelteKit 2, TypeScript, and TailwindCSS. The application allows users to create, manage, and track time spent on various activities.

## Development Commands

### Setup and Development
```bash
# Install dependencies
npm install

# Start development server (runs on Vite dev server)
npm run dev

# Start with browser auto-open
npm run dev -- --open

# Sync SvelteKit types and check TypeScript
npm run check

# Check TypeScript in watch mode
npm run check:watch
```

### Build and Deploy
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview

# Prepare/sync SvelteKit files
npm run prepare
```

## Architecture Overview

### Tech Stack
- **Framework**: SvelteKit 2 with TypeScript
- **Styling**: TailwindCSS with dark mode support
- **HTTP Client**: Axios with interceptors for authentication
- **Animations**: Svelte transitions and CSS animations
- **Build Tool**: Vite
- **Date Handling**: date-fns library

### Directory Structure
```
src/
├── app/                    # Global app styles and configuration
├── lib/
│   ├── api/               # API client and HTTP configuration
│   │   └── client.ts      # Axios instance with auth interceptors
│   ├── components/        # Reusable UI components
│   │   ├── activities/    # Activity-specific components
│   │   └── Navbar.svelte  # Global navigation
│   ├── services/          # Business logic and API calls
│   │   └── activity.service.ts
│   ├── stores/            # Svelte stores for state management
│   │   └── auth.js        # Authentication store
│   └── types/             # TypeScript type definitions
│       └── activity.ts    # Activity and time entry interfaces
└── routes/                # SvelteKit file-based routing
    ├── +layout.svelte     # Root layout component
    ├── +page.server.js    # Root page server logic (redirects)
    ├── dashboard/         # Protected dashboard route
    ├── login/             # Authentication routes
    └── register/
```

### Key Architectural Patterns

#### Authentication System
- **Cookie-based auth**: Uses HTTP-only cookies for security with client-side user data
- **Token refresh**: Automatic token refresh via Axios interceptors
- **Route protection**: Server-side route guards in `hooks.server.js`
- **Store pattern**: Centralized auth state in `src/lib/stores/auth.js`

#### API Integration
- **Centralized client**: Single Axios instance with base URL configuration
- **Environment config**: API base URL via `VITE_API_BASE_URL` (defaults to `http://localhost:8000/api/v1`)
- **Service layer**: Business logic abstracted into service classes
- **Type safety**: Full TypeScript coverage for API responses

#### Component Architecture
- **Feature-based organization**: Components grouped by feature (activities/)
- **Prop drilling avoidance**: Callback functions for parent-child communication
- **State management**: Local component state + global stores where needed

## Backend Integration

### API Endpoints Expected
The frontend expects a REST API at `http://localhost:8000/api/v1` with these endpoints:
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /auth/refresh-token` - Token refresh
- `GET /activities` - List activities
- `POST /activities` - Create activity
- `PATCH /activities/:id` - Update activity
- `DELETE /activities/:id` - Delete activity
- `POST /activities/:id/start` - Start time tracking
- `POST /activities/:id/stop` - Stop time tracking
- `GET /activities/:id/time-entries` - Get time entries

### Environment Variables
Set `VITE_API_BASE_URL` to override the default backend URL:
```bash
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
```

## Key Components

### ActivityList.svelte
Central component managing activity display, CRUD operations, and timer integration. Handles the grid layout and activity card rendering.

### ActivityTimer.svelte
Manages individual activity time tracking with start/stop functionality. Updates activity state in real-time.

### ActivityForm.svelte
Handles both create and edit operations for activities. Includes form validation and color selection.

### Authentication Store (`auth.js`)
Custom Svelte store with methods for login, register, logout, and authentication state checking. Manages cookies and localStorage cleanup.

## Development Guidelines

### Adding New Routes
- Create route directories under `src/routes/`
- Add `+page.svelte` for the UI component
- Add `+page.server.js/ts` for server-side logic if needed
- Protected routes should check authentication in server load functions

### Adding New API Services
- Create service classes in `src/lib/services/`
- Use the centralized `apiClient` from `src/lib/api/client.ts`
- Define TypeScript interfaces in `src/lib/types/`
- Follow the existing pattern of returning `response.data.data`

### State Management
- Use local component state for UI-specific data
- Use Svelte stores for global application state
- Authentication state is managed in `src/lib/stores/auth.js`
- Activity data is fetched fresh on each page load

### Styling Approach
- Primary framework: TailwindCSS
- Dark mode: Configured with `class` strategy in `tailwind.config.js`
- Component styling: Utility-first approach with Tailwind classes
- Custom colors: Indigo theme with activity-specific color coding

## Testing Notes

This project currently doesn't have a test suite configured. When adding tests, consider:
- **Unit tests**: Test individual components and services
- **Integration tests**: Test API service integration
- **E2E tests**: Test complete user workflows
- Recommend Vitest for unit testing (already compatible with Vite setup)