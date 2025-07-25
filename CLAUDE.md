# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### With npm

- `npm run dev` - Start development server with Turbo
- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run sort-tw` - Sort Tailwind classes with Rustywind
- `npm run clean` - Remove .next and rebuild
- `npm run preview` - Build and start (production preview)

### With Bun (preferred)

- `bun run bun:dev` - Start development server with Bun + Turbo
- `bun run bun:devop` - Clean and start development
- `bun run bun:build` - Build with Bun
- `bun run bun:lint` - Run linter with Bun
- `bun run bun:format` - Format code with Biome
- `bun run bun:sort-tw` - Sort Tailwind classes

### Database (Prisma)

- `npx prisma migrate dev --name migration_name` - Create and apply migration
- `npx prisma migrate deploy` - Deploy migrations (production)
- `npx prisma studio` - Open Prisma Studio
- `npx prisma db seed` - Run seed file
- `npx prisma generate` - Generate Prisma client

## Architecture Overview

### Core Technologies

- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT sessions
- **State Management**: Zustand for client state
- **Styling**: Tailwind CSS with Radix UI components
- **Linting**: Biome (replacing ESLint/Prettier)
- **Rich Text**: TipTap editor
- **Analytics**: Google Analytics Data API v1

### Project Structure

#### App Router Layout

- `(public)` - Public pages (homepage, landing)
- `(auth)` - Authentication pages (login, recovery)
- `(admin)` - Protected admin dashboard with role-based access

#### Authentication & Authorization

- **Role-based permission system** with granular page access control
- **User-Role-Permission hierarchy**: Users → UserRoles → Roles → PermissionRole → Permissions
- **Page-level access control**: PageRole table maps roles to specific pages
- **Audit logging**: All auth events tracked in AuditLog table
- **Session management**: JWT with 30-day expiry, 24-hour refresh

#### Database Schema (Prisma)

Key entities:

- `User` - User accounts with bcrypt password hashing
- `Role` - User roles (Admin, User, etc.)
- `Permission` - Granular permissions
- `Page` - Registered pages for access control
- `Ticket` - Support ticket system with comments
- `AuditLog` - Complete audit trail for security

#### State Management

- `authStore.ts` - Authentication state and session management
- `permissionsStore.ts` - User permissions and role state
- `sessionStore.ts` - Session monitoring and validation
- `userroleStore.ts` - User role management

#### Component Architecture

- **Modular design** with feature-based organization
- **Reusable UI components** in `/ui` folder using Radix primitives
- **Modal system** for CRUD operations
- **Data tables** with sorting, filtering, and pagination
- **Form handling** with react-hook-form integration

### Key Implementation Details

#### Authentication Flow

1. Credentials validated against database with bcrypt
2. User roles and permissions loaded from relational tables
3. JWT token contains user data, roles, and permissions
4. Middleware protects routes, ProtectedRoute handles page-level permissions
5. All auth events logged to audit table

#### Analytics Integration

- Google Analytics Data API v1 integration
- Real-time metrics with 5-minute refresh intervals
- Comprehensive dashboard with charts (Recharts)
- Service Account authentication
- Configuration via environment variables

#### Development Workflow

- **Biome** for linting and formatting (configured in `biome.json`)
- **Turbopack** for fast development builds
- **Prisma** handles all database operations
- **TypeScript** strict mode enabled
- **Component-first development** with reusable patterns

#### Security Features

- Password hashing with bcrypt
- JWT session management with secure expiry
- Role-based page access control
- Complete audit logging for compliance
- Input validation and sanitization
- Protected API routes with middleware

### Environment Variables Required

```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_ANALYTICS_PROPERTY_ID="..."
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
ANALYTICS_REFRESH_INTERVAL=300000
```

### Common Patterns

- Server Actions in `/actions` for database operations
- Custom hooks in `/hooks` for reusable logic
- Type definitions in `/types` organized by feature
- Utility functions in `/lib` with feature separation
- Modular components with co-located styles and logic

### Development Notes

- Use Bun for faster package management and builds when possible
- Follow role-based access patterns when adding new pages
- All database changes require Prisma migrations
- Audit logging should be implemented for sensitive operations
- Use existing UI components before creating new ones
- Follow the established TypeScript patterns for type safety
