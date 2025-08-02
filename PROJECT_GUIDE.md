# PROJECT_GUIDE.md

Guía de proyecto con comandos, arquitectura y entorno de desarrollo.

---

## 🔧 Comandos de Desarrollo

**Con Bun (recomendado)**

```
bun run bun:dev        # Dev server con Turbopack
bun run bun:build      # Build de producción
bun run bun:lint       # Linter Biome
bun run bun:format     # Formateo Biome
bun run bun:format-prettier # Formateo Prettier
```

**Base de Datos (Prisma)**

```
npx prisma migrate dev --name migration_name
npx prisma migrate deploy
npx prisma studio
```

**Con NPM (alternativa)**

```
npm run dev
npm run build
npm run start
npm run lint
```

---

## 📂 Arquitectura del Proyecto

- **Framework**: Next.js 15 + App Router + Turbopack
- **DB**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (JWT, roles y permisos)
- **State**: Zustand
- **UI**: Tailwind + Radix UI
- **Linting**: Biome

**Estructura**

```
(app)
 ├─ (public)  # Páginas públicas
 ├─ (auth)    # Login y recuperación
 └─ (admin)   # Dashboard protegido
```

**Roles y Permisos**

- Sistema jerárquico: Usuarios → Roles → Permisos
- Control de acceso por página
- AuditLog registra todos los eventos

---

## 🌱 Variables de Entorno

Archivo `.env.example` recomendado:

```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_ANALYTICS_PROPERTY_ID="..."
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```
