# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANTE: Idioma
**SIEMPRE responder en español al usuario. Toda comunicación debe ser en español.**

## MIGRATION PLAN - App Modelo Base
**ESTADO:** Fase 1 Completada ✅ - Sistema de formularios estandarizado implementado
**PRÓXIMO:** Fase 2 - Migración gradual de formularios existentes

### Documentos del Plan de Migración
- `MIGRATION_ROADMAP.md` - Plan completo con 3 fases y cronograma
- `PROGRESS_TRACKER.md` - Estado detallado del progreso actual 
- `IMPLEMENTATION_GUIDE.md` - Guías paso a paso para continuar
- `src/components/forms/` - Sistema de formularios completo implementado

### Sistema de Formularios Completado
- ✅ FormWrapper, FormField, FormActions - Componentes base
- ✅ RichTextField, SearchableSelectField, CheckboxField - Especializados
- ✅ useServerAction, useAsyncOptions - Hooks personalizados
- ✅ 8 tipos de campo soportados - text, email, select, richtext, etc.
- ✅ Validación en tiempo real - React Hook Form integrado
- ✅ Migraciones piloto exitosas - LoginForm, NewRoleModal

### Para Continuar el Plan
1. Seguir IMPLEMENTATION_GUIDE.md para migrar UserNewModal
2. Usar patrones establecidos en LoginFormNew.tsx
3. Probar cada migración individualmente
4. Documentar mejoras y diferencias encontradas

## Development Commands

### Primary Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Lint code with Biome
- `npm run sort-tw` - Sort Tailwind classes with Rustywind
- `npm run clean` - Clean .next directory and rebuild
- `npm run preview` - Build and start production server

### Bun Commands (Alternative runtime)
- `bun run bun:dev` - Start development server with Bun
- `bun run bun:build` - Build with Bun
- `bun run bun:lint` - Lint with Bun
- `bun run bun:format` - Format code with Biome

### Database Commands
- `npx prisma migrate dev --name migration_name` - Create new migration
- `npx prisma migrate deploy` - Deploy migrations
- `npx prisma studio` - Open Prisma Studio
- `npx prisma db seed` - Run database seed
- `npx prisma generate` - Generate Prisma client

### Testing & Quality
- Run `npm run lint` after making changes - uses Biome for linting
- No specific test command found - check if tests exist before implementing features
- Code formatting disabled in Biome config - uses external formatters

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **UI**: Radix UI components with Tailwind CSS
- **State Management**: Zustand
- **Rich Text**: Tiptap editor
- **File Upload**: Vercel Blob storage
- **Email**: Nodemailer + Brevo
- **Data Tables**: TanStack Table
- **Maps**: Leaflet + React Leaflet

### Project Structure
```
src/
├── app/                    # App Router pages
│   ├── (admin)/           # Admin dashboard routes
│   ├── (auth)/            # Authentication pages
│   ├── (home)/            # Public pages
│   └── api/               # API routes
├── components/            # Reusable UI components
├── actions/               # Server actions organized by feature
├── lib/                   # Utilities and configurations
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

### Key Features

#### Authentication & Authorization
- Role-based access control with permissions
- Page-level route protection
- Audit logging for security events
- Session management with JWT
- Password encryption with bcrypt

#### Admin Dashboard
- User management with roles and permissions
- Ticket system with comments
- Audit trail for all actions
- Dynamic breadcrumbs and navigation
- Responsive sidebar layout

#### Database Schema
- User management with roles
- Permission-based access control
- Ticket system with status tracking
- Audit logging
- Page-level access control

### Development Patterns

#### Path Aliases
- `@/*` - src directory
- `@/components/*` - components directory
- `@/actions/*` - server actions
- `@/lib/*` - utilities and configs
- `@/store/*` - state management
- `@/types/*` - TypeScript types

#### State Management
- Zustand for client-side state
- Separate stores for auth, permissions, and user roles
- Session monitoring and automatic refresh

#### Security
- All sensitive operations are audited
- Role-based page access control
- Password hashing and validation
- Session timeout management
- Input validation and sanitization

### Configuration Files
- `biome.json` - Linting configuration (formatter disabled)
- `next.config.ts` - Next.js configuration with redirects
- `tsconfig.json` - TypeScript configuration with path aliases
- `prisma/schema.prisma` - Database schema
- `components.json` - Shadcn/UI configuration

### Important Notes
- Uses ES modules (`"type": "module"` in package.json)
- Prisma seed configured to run with Node.js
- Image uploads handled via Vercel Blob storage
- Server actions have 10MB body size limit
- Admin routes automatically redirect to dashboard
- Clean project structure with no malicious code detected