# PerfectTable Component

Componente de tabla inteligente y altamente configurable para React/Next.js con auto-generación desde Prisma schema.

## 🚀 Características

- **Zero Config**: Genera tablas completas automáticamente
- **Prisma Integration**: Auto-configuración desde schema de Prisma
- **Smart Conventions**: Detección inteligente de tipos de columnas
- **Flexible Actions**: Sistema de acciones configurable
- **TypeScript**: Completamente tipado
- **Responsive**: Diseño adaptable
- **Extensible**: Fácil personalización

## 📦 Instalación

\`\`\`bash

# Copia los archivos del componente a tu proyecto

# Asegúrate de tener las dependencias necesarias:

npm install @tanstack/react-table lucide-react sonner
\`\`\`

## 🎯 Uso Básico

### Zero Config

\`\`\`tsx
import { PerfectTable } from './components/PerfectTable';

// Genera tabla completa automáticamente
<PerfectTable entity="User" />
\`\`\`

### Configuración Mínima

\`\`\`tsx
<PerfectTable
entity="User"
actions={['view', 'edit', 'delete']}
enableSelection={true}
/>
\`\`\`

### Configuración Avanzada

\`\`\`tsx
<PerfectTable
entity="User"
enablePrismaAutoConfig={true}
config={{
    columnOverrides: {
      email: { linkable: true },
      name: { width: 200 }
    },
    hiddenColumns: ['birthdate'],
    customColumns: [
      { id: 'status', header: 'Estado', type: 'badge' }
    ]
  }}
actions={['view', 'edit', 'change-password', 'assign-roles', 'delete']}
enableSelection={true}
enableBulkActions={true}
/>
\`\`\`

## 🔧 Configuración

### Props Principales

| Prop                | Tipo           | Descripción                                     |
| ------------------- | -------------- | ----------------------------------------------- |
| `entity`            | `string`       | Nombre de la entidad (User, Role, Ticket, etc.) |
| `config`            | `TableConfig`  | Configuración avanzada de la tabla              |
| `actions`           | `ActionType[]` | Acciones disponibles                            |
| `enableSelection`   | `boolean`      | Habilitar selección de filas                    |
| `enableBulkActions` | `boolean`      | Habilitar acciones en lote                      |
| `data`              | `T[]`          | Datos personalizados (opcional)                 |
| `loading`           | `boolean`      | Estado de carga                                 |

### Tipos de Columnas Soportados

- `text` - Texto simple
- `email` - Email con enlace
- `phone` - Teléfono con enlace
- `date` - Fecha formateada
- `badge` - Estado/etiqueta
- `image` - Avatar/imagen
- `number` - Números formateados
- `boolean` - Sí/No

### Acciones Predefinidas

- `view` - Ver detalles
- `edit` - Editar
- `delete` - Eliminar
- `change-password` - Cambiar contraseña
- `assign-roles` - Asignar roles
- `assign-permissions` - Asignar permisos

## 🎨 Personalización

### Overrides de Columnas

\`\`\`tsx
config={{
  columnOverrides: {
    email: {
      linkable: true,
      width: 250
    },
    status: {
      colorMap: {
        'ACTIVE': 'green',
        'INACTIVE': 'gray'
      }
    }
  }
}}
\`\`\`

### Columnas Personalizadas

\`\`\`tsx
config={{
  customColumns: [
    {
      id: 'custom',
      header: 'Custom',
      render: ({ row, value }) => (
        <div>Custom content for {row.name}</div>
      )
    }
  ]
}}
\`\`\`

## 🔌 Integración con Prisma

El componente puede auto-configurarse desde tu schema de Prisma:

\`\`\`prisma
model User {
id String @id @default(cuid())
name String
lastName String
email String @unique
phone String?
birthdate DateTime?
image String?
state Int?
roles UserRole[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}
\`\`\`

\`\`\`tsx
// Auto-genera columnas basadas en el schema
<PerfectTable 
  entity="User" 
  enablePrismaAutoConfig={true}
/>
\`\`\`

## 📚 Ejemplos

### Tabla de Usuarios

\`\`\`tsx
export function UserManagement() {
return (
<PerfectTable
entity="User"
title="Gestión de Usuarios"
description="Administrar usuarios del sistema"
enableSelection={true}
actions={['view', 'edit', 'change-password', 'assign-roles', 'delete']}
createButton={({ refreshAction }) => (
<NewUserModal refreshAction={refreshAction} />
)}
/>
);
}
\`\`\`

### Tabla de Tickets

\`\`\`tsx
export function TicketManagement() {
return (
<PerfectTable
entity="Ticket"
config={{
        columnOverrides: {
          status: {
            colorMap: {
              'OPEN': 'green',
              'IN_PROGRESS': 'yellow',
              'RESOLVED': 'blue',
              'CLOSED': 'gray'
            }
          },
          priority: {
            colorMap: {
              'LOW': 'green',
              'MEDIUM': 'yellow',
              'HIGH': 'orange',
              'URGENT': 'red'
            }
          }
        }
      }}
/>
);
}
\`\`\`

## 🛠️ Extensión

### Registrar Nuevas Fuentes de Datos

\`\`\`tsx
import { registerDataSource } from './datasource/DataSourceAdapter';

// Registrar nuevo store
registerDataSource('store', 'useCustomStore', useCustomStore);

// Registrar nueva server action
registerDataSource('action', 'getCustomData', getCustomData);
\`\`\`

### Crear Acciones Personalizadas

\`\`\`tsx
const customAction: ActionConfig = {
id: 'custom-action',
label: 'Acción Custom',
permission: ['CustomPermission'],
onClick: (row) => {
console.log('Custom action for:', row);
}
};
\`\`\`

## 📋 Dependencias

- `@tanstack/react-table` - Tabla base
- `lucide-react` - Iconos
- `sonner` - Notificaciones
- `@/components/ui/*` - Componentes UI (shadcn/ui)

## 🤝 Contribución

1. Adapta el componente a tu proyecto
2. Modifica las convenciones en `core/Conventions.ts`
3. Actualiza el mapeo de entidades en `core/PerfectTableGenerator.tsx`
4. Conecta tus stores y server actions en `datasource/DataSourceAdapter.ts`

## 📄 Licencia

Libre para usar en tu proyecto.
