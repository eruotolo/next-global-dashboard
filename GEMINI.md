# Análisis del Proyecto: nextjs-dashboard-global

## Descripción General

Este es un proyecto full-stack construido con **Next.js** y **TypeScript**. Utiliza **Prisma** como ORM para interactuar con una base de datos **PostgreSQL**. La aplicación incluye un sistema de autenticación, gestión de usuarios, roles y permisos, un panel de administración y un sistema de tickets de soporte. El frontend está construido con **React** y utiliza componentes de **shadcn/ui**, **Tailwind CSS** para el estilizado y **Recharts** para las visualizaciones de datos.

## Características Principales

- **Framework**: Next.js 15 con App Router.
- **Lenguaje**: TypeScript.
- **Base de Datos**: PostgreSQL con Prisma.
- **Autenticación**: NextAuth.js.
- **UI**: shadcn/ui, Tailwind CSS, Radix UI.
- **Formularios**: React Hook Form con Zod para validación.
- **Gestión de Estado**: Zustand.
- **Visualización de Datos**: Recharts.
- **Linting y Formateo**: Biome y Prettier.

## Estructura del Proyecto

- `src/app`: Contiene las rutas de la aplicación, incluyendo layouts y páginas para las secciones de administración (`admin`), autenticación (`auth`) y pública (`public`).
- `src/components`: Componentes de React reutilizables, organizados por funcionalidad (Analytics, Auth, Dashboard, etc.).
- `src/actions`: Server Actions de Next.js, utilizadas para la lógica de negocio del lado del servidor.
- `src/lib`: Lógica de soporte, incluyendo configuración de autenticación, utilidades y acceso a la base de datos.
- `prisma`: Esquema de la base de datos, migraciones y script de seeding.
- `public`: Archivos estáticos como imágenes y favicons.

## Dependencias Clave

- `next`: Framework de React para producción.
- `react`, `react-dom`: Librerías para construir interfaces de usuario.
- `prisma`, `@prisma/client`: ORM para la base de datos.
- `next-auth`: Autenticación para Next.js.
- `shadcn/ui`, `tailwindcss`: Componentes de UI y framework de CSS.
- `recharts`: Librería de gráficos.
- `zod`, `react-hook-form`: Validación de esquemas y gestión de formularios.
- `zustand`: Gestión de estado.

## Scripts

- `dev`: Inicia el servidor de desarrollo con Turbopack.
- `build`: Compila la aplicación para producción.
- `start`: Inicia el servidor de producción.
- `lint`: Ejecuta el linter de Biome.
- `format`: Formatea el código con Prettier.

## Prisma

El esquema de Prisma define los siguientes modelos:

- **User**: Usuarios de la aplicación.
- **Role**: Roles que pueden ser asignados a los usuarios.
- **UserRole**: Tabla de unión entre usuarios y roles.
- **Permission**: Permisos granulares.
- **PermissionRole**: Tabla de unión entre roles y permisos.
- **Page**: Páginas de la aplicación.
- **PageRole**: Tabla de unión entre páginas y roles para control de acceso.
- **AuditLog**: Registro de auditoría para acciones importantes.
- **Ticket, TicketComment**: Sistema de tickets de soporte.

## Configuración

### Next.js (`next.config.ts`)

- Redirecciones configuradas para `/admin` y `/admin/settings`.
- Server Actions habilitadas con un límite de tamaño de cuerpo de 10MB.
- Imágenes remotas permitidas desde `vercel-storage.com`.

### TypeScript (`tsconfig.json`)

- Rutas de importación (`paths`) configuradas para un acceso más limpio a los módulos.
- Configuración estricta (`strict: true`) para mayor seguridad de tipos.

## Conclusión

El proyecto está bien estructurado y utiliza un stack de tecnologías moderno y popular para el desarrollo de aplicaciones web con Next.js. La separación de responsabilidades es clara, con una distinción entre componentes de UI, lógica de servidor y configuración de la base de datos. El uso de TypeScript y la validación de esquemas con Zod contribuyen a la robustez y mantenibilidad del código. El sistema de roles y permisos, junto con el registro de auditoría, indica un enfoque en la seguridad y el control de acceso.

---

## Development Rules

Estas son las 9 reglas fundamentales que TODOS los sistemas deben seguir:

### **Regla 1: Análisis y Planificación**

Primero, analicen el problema, revisen el código base para encontrar los archivos relevantes y escriban un plan en `docs/TODO.md`.

### **Regla 2: Lista de Tareas**

El plan debe incluir una lista de tareas pendientes que puedan ir completando de forma incremental.

### ✅ **Regla 3: Verificación del Plan**

Antes de empezar a trabajar, contáctenme y verificaré el plan. **NO proceder sin aprobación**.

### **Regla 4: Ejecución Incremental**

Comiencen a trabajar en las tareas pendientes, marcándolas como completadas a medida que avanzan.

### **Regla 5: Explicaciones Detalladas**

En cada paso, denme una explicación detallada de los cambios realizados.

### ⚡ **Regla 6: Simplicidad Máxima**

Simplifiquen al máximo cada tarea y cambio de código. Evitar cambios masivos o complejos. Cada cambio debe afectar al código en la menor cantidad posible. **La clave está en la simplicidad**.

### **Regla 7: Documentación de Revisión**

Agreguen una sección de revisión al archivo `docs/TODO.md` con un resumen de los cambios realizados y cualquier otra información relevante.

### **Regla 8: ANTI-PEREZA**

**NO SEAS PEREZOSO. NUNCA SEAS PEREZOSO.** Si hay un error, encuentra la causa raíz y arréglalo. **NO HAY SOLUCIONES TEMPORALES.** Eres un desarrollador senior. **NUNCA SEAS PEREZOSO.**

### **Regla 9: CÓDIGO MÍNIMO**

**HAZ QUE TODAS LAS CORRECCIONES Y CAMBIOS DE CÓDIGO SEAN LO MÁS SIMPLES POSIBLES.** Solo deben afectar al código necesario y relevante para la tarea y nada más. Deben afectar al **MENOS CÓDIGO POSIBLE**. Tu objetivo es **NO INTRODUCIR NINGÚN ERROR**. Se trata de **SIMPLICIDAD**.
