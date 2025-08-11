---
applyTo: "**
---
# Internal dashboard - Copilot Instructions

This document provides comprehensive instructions for GitHub Copilot to effectively work with the Internal dashboard monorepo.

## Project Overview

The Internal dashboard is a React-based application built with a modern monorepo architecture using Bun as the package manager and runtime. The project uses React Router v7, and follows a domain-driven design pattern.

## Monorepo Structure

This is a **Bun workspace** monorepo with the following structure:

```
workspace/
├── apps/
│   └── app/                     # Main React Router v7 application
├── packages/
│   ├── domains/                 # Domain logic & database (tRPC, Drizzle)
│   └── ds/                      # Design system (UI components, hooks, icons)
├── public/                      # Static assets (models, textures, locales)
└── scripts/                     # Build and utility scripts
```

## Key Technologies

- **Runtime**: Bun (not Node.js)
- **Frontend**: React 19, React Router v7, Vite
- **State Management**: Legend State
- **Data Fetching**: TanStack Query + tRPC
- **Database**: Drizzle ORM with PostgreSQL
- **Styling**: Tailwind CSS v4
- **I18n**: i18next (en-us, pt-br)
- **Linting**: Biome
- **Build Tool**: Vite

## Package Architecture

### 1. `apps/dashboard` - Main Application
- **Purpose**: React Router v7 SSR application
- **Key Files**:
  - `src/entry.client.tsx` - Client entry point
  - `src/entry.server.tsx` - Server entry point
  - `src/routes.ts` - Route definitions
  - `src/server.ts` - Server configuration
- **Routes Structure**:
  - `(auth)/` - Authentication routes (login, register)
  - `(game)/` - Game routes with layout
- **Commands**:
  - `bun dev` - Development server
  - `bun build` - Production build
  - `bun start` - Start production server

### 2. `packages/domains` - Domain Logic
- **Purpose**: Backend domains, database schema, tRPC routers
- **Export Pattern**: `@repo/domains`
- **Key Exports**:
  - `"."` - Main domain exports
  - `"./*"` - Individual domain exports
  - `"./server"` - Server setup
  - `"./utils/*"` - Utility functions
- **Domains**:
  - `app/` - Application configuration
  - `auth/` - Authentication logic
  - `feedbacks/` - User feedback system
  - `highscore/` - Game scoring
  - `resources/` - Game resources
  - `runs/` - Game runs/sessions
  - `tutorial/` - Tutorial system
  - `users/` - User management
- **Database**: Uses Drizzle ORM with PostgreSQL
- **Commands**:
  - `bun db` - Database operations (from root)

### 3. `packages/ds` - Design System
- **Purpose**: Shared UI components, hooks, icons, and 3D components
- **Export Pattern**: `@repo/ds`
- **Key Exports**:
  - `"./ui/*"` - UI components (buttons, dialogs, etc.)
  - `"./lib/*"` - Utility libraries
  - `"./hooks/*"` - React hooks
  - `"./icons/*"` - Custom icons
  - `"./types/*"` - TypeScript types
  - `"./v"` - Validation library
  - `"./style"` - Global styles
- **Components**: Based on shadcn/ui patterns
- **Commands**:
  - `bun component` - Add new shadcn components

## Development Guidelines

### 1. Package Management
- **Always use Bun**: This project uses Bun as the package manager and runtime
- **Workspace Dependencies**: Use `"workspace:*"` for internal packages
- **Catalog Dependencies**: Use `"catalog:"` for shared external dependencies defined in root `package.json`

### 2. Import Patterns
```typescript
// Internal packages
import { Button } from '@repo/ds/ui/button'
import { useAuth } from '@repo/domains/auth'
import { trpc } from '@repo/domains/utils/trpc'

// 3D Components
import { Train } from '@repo/ds/3d/train'
import { Camera } from '@repo/ds/3d/camera'
```

### 3. File Organization
- **Components**: Place in appropriate package (`ds` for UI, `domains` for logic)
- **Types**: Use `packages/ds/src/types/` for shared types
- **Utilities**: Use `packages/domains/src/utils/` for server utils, `packages/ds/src/lib/` for client utils
- **3D Assets**: Store in `public/models/` and `public/textures/`

### 4. Environment & Configuration
- **Environment Files**: `.env` and `.env.local` in project root
- **Configuration**: Each package has its own `tsconfig.json`
- **Biome Config**: Shared `biome.jsonc` in root for linting

### 5. Internationalization
- **Locales**: Stored in `public/locales/en-us/` and `public/locales/pt-br/`
- **Files**: `auth.json`, `form.json`, `general.json`, `metadata.json`
- **Usage**: Use i18next hooks in components

### 6. 3D Development
- **Models**: Store `.glb` files in `public/models/`
- **Textures**: Store images in `public/textures/`
- **Components**: Create reusable 3D components in `packages/ds/src/3d/`
- **Physics**: Consider performance implications of 3D rendering

## Common Commands

### Root Level
```bash
# Development
bun dev              # Start app in development mode
bun build            # Build app for production
bun start            # Start production server

# Quality Assurance
bun verify           # Run linting across all packages
bun lint             # Run linting across all packages
bun test             # Run tests (currently placeholder)

# Package-specific
bun ds               # Access ds package commands
bun db               # Access database commands
```

### Package Level
```bash
# In apps/dashboard/
bun dev              # Development server
bun build            # Build application
bun verify           # Lint this package

# In packages/domains/
bun db               # Database operations
bun verify           # Lint this package

# In packages/ds/
bun component        # Add shadcn components
bun verify           # Lint this package
```

## Best Practices

### 1. Code Style
- **Linting**: Use Biome configuration (already set up)
- **Formatting**: Follow Biome's automatic formatting
- **TypeScript**: Use strict mode, leverage catalog types

### 2. Component Development
- **UI Components**: Create in `packages/ds/src/components/`
- **3D Components**: Create in `packages/ds/src/3d/`
- **Hooks**: Create in `packages/ds/src/hooks/`
- **Icons**: Create in `packages/ds/src/icons/`

### 3. Domain Logic
- **Separation**: Keep business logic in `packages/domains/`
- **tRPC**: Use for type-safe API calls
- **Database**: Use Drizzle ORM for database operations
- **Validation**: Use the `@repo/ds/v` validation library

### 4. Asset Management
- **Public Assets**: Store in `public/` directory
- **Symlink**: Assets are symlinked to `apps/dashboard/public/`
- **Models**: Prefer `.glb` format for 3D models
- **Textures**: Optimize images for web use

### 5. Performance Considerations
- **3D Rendering**: Be mindful of polygon counts and texture sizes
- **State Management**: Use Legend State for reactive state
- **Data Fetching**: Use TanStack Query with tRPC for caching
- **Code Splitting**: Leverage React Router's built-in code splitting

## Troubleshooting

### Common Issues
1. **Symlink Issues**: Run `bun run symlink` if public assets aren't accessible
2. **Build Issues**: Ensure all packages are built before the main app
3. **Database Issues**: Check environment variables and run migrations
4. **Type Errors**: Verify workspace dependencies are properly linked

### Debug Commands
```bash
# Check workspace structure
bun workspaces list

# Rebuild node_modules
rm -rf node_modules
bun install

# Reset symlinks
bun run symlink
```

## File Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `GameCanvas.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.tsx`, `useGame.tsx`)
- **Utilities**: camelCase (`math.ts`, `timeout.ts`)
- **Types**: PascalCase (`DeepPartial.ts`)
- **Routes**: kebab-case directories, camelCase files

## Testing Strategy

- **Unit Tests**: Test individual components and utilities
- **Integration Tests**: Test domain logic and API endpoints
- **E2E Tests**: Test critical user flows
- **Performance Tests**: Monitor 3D rendering performance

---

When working with this codebase, always consider the monorepo structure, use appropriate import paths, and maintain consistency with the established patterns. The project emphasizes type safety, performance, and maintainability through its architecture choices.
