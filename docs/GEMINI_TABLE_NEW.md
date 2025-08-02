# Propuesta de Refactorización: Componente `TanTable`

## 1. Objetivo

El objetivo de esta propuesta es refactorizar el sistema de tablas actual para crear un componente `TanTable` más abstracto, reutilizable y fácil de mantener. Se busca reducir drásticamente el código repetitivo necesario para implementar una tabla de datos, centralizando la lógica y la configuración en un único lugar, siguiendo las mejores prácticas de **TanStack Table v8** y **shadcn/ui**.

## 2. Principios de Diseño

- **Máxima Abstracción:** El desarrollador que consuma `TanTable` no debería necesitar interactuar directamente con los hooks de estado de `react-table` (`useState` para `sorting`, `filters`, etc.).
- **Mínima Configuración (Convention over Configuration):** El componente debe ser funcional "out-of-the-box" proveyendo únicamente `data` y `columns`.
- **Alta Personalización:** Aunque la configuración por defecto será mínima, se debe permitir la personalización y extensión a través de props claras y concisas.
- **Composición de Componentes:** Seguir el patrón de composición de React, permitiendo inyectar componentes personalizados (como botones de acción en la barra de herramientas).

## 3. Estructura de Archivos Propuesta

Se propone crear un nuevo directorio `src/components/TanTable` con la siguiente estructura:

```
src/components/
└── TanTable/
    ├── index.ts                # Exportador principal
    ├── TanTable.tsx            # El componente principal y orquestador
    ├── TanTableToolbar.tsx     # Barra de herramientas (reutilizable y mejorada)
    ├── TanTablePagination.tsx  # Paginación (reutilizable)
    ├── TanTableColumns.tsx     # (Opcional) Definiciones de columnas reusables (ej. columna de acciones)
    └── hooks/
        └── useTanTable.ts      # Hook personalizado que encapsula toda la lógica de `useReactTable`
```

## 4. API del Componente `TanTable.tsx`

El componente principal `TanTable` tendrá una API simplificada:

```typescript
import { type ColumnDef } from '@tanstack/react-table';

interface TanTableProps<TData> {
  // --- Props Requeridas ---
  data: TData[];
  columns: ColumnDef<TData>[];

  // --- Props Opcionales para Personalización ---
  loading?: boolean;
  filterPlaceholder?: string;
  enableExport?: boolean;
  toolbarActions?: React.ReactNode; // Para añadir botones como "Crear Usuario"
}

export function TanTable<TData>({ ... }: TanTableProps<TData>) {
  // ... lógica interna
}
```

## 5. Detalles de Implementación

### `hooks/useTanTable.ts`

Este es el núcleo de la abstracción. Este hook personalizado contendrá toda la lógica que actualmente se encuentra en `DataTable.tsx`:

- Todos los `React.useState` para `sorting`, `columnFilters`, `globalFilter`, `columnVisibility`, y `rowSelection`.
- La llamada a `useReactTable` con toda su configuración (funciones de filtrado, modelos, etc.).
- **Retornará únicamente la instancia de `table` ya configurada.**

### `TanTable.tsx`

Este componente se volverá mucho más simple. Será un "componente cliente" (`'use client'`) que:

1.  Llamará al hook `useTanTable({ data, columns })` para obtener la instancia de la tabla.
2.  Renderizará la estructura JSX, pasando la instancia `table` a `TanTableToolbar`, `TanTablePagination` y al cuerpo de la tabla.
3.  Renderizará el `React.ReactNode` de `toolbarActions` dentro de la `TanTableToolbar`.

### `TanTableToolbar.tsx`

Será una versión mejorada del `DataTableToolbar` actual. La principal diferencia es que tendrá un espacio designado para renderizar las `toolbarActions` que se le pasen como prop.

### `TanTableColumns.tsx`

Este archivo no es un componente, sino un lugar para exportar definiciones de columnas (`ColumnDef`) que se repiten en toda la aplicación. Por ejemplo, una columna de "Acciones" con botones de "Editar" y "Eliminar" podría definirse aquí una vez y reutilizarse en múltiples tablas.

## 6. Ejemplo de Uso: Antes y Después

Esto ilustra el beneficio principal de la refactorización.

### **Antes (Implementación Actual)**

Para crear una tabla de usuarios, el código se vería así:

```tsx
// /app/admin/settings/users/page.tsx

'use client';

// Hook hipotético
import * as React from 'react';

import { DataTable } from '@/components/ui/data-table';
import { useUsers } from '@/hooks/useUsers';

import { columns } from './columns';

// /app/admin/settings/users/page.tsx

// /app/admin/settings/users/page.tsx

// /app/admin/settings/users/page.tsx

// /app/admin/settings/users/page.tsx

// SE NECESITA MUCHO CÓDIGO REPETITIVO PARA CONFIGURAR EL ESTADO
export default function UsersPage() {
    const { users, isLoading } = useUsers();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState<string>('');
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // ... toda la lógica de useReactTable está dentro de DataTable, pero el estado está fuera ...

    return (
        <div>
            {/* Se necesita un componente intermedio para manejar el estado */}
            <DataTable
                columns={columns}
                data={users}
                loading={isLoading}
                // ... y pasar todos los estados y setters
            />
        </div>
    );
}
```

### **Después (Con `TanTable`)**

El código para la misma página sería mucho más limpio y declarativo:

```tsx
// /app/admin/settings/users/page.tsx

'use client';

import { PlusCircle } from 'lucide-react';

import { TanTable } from '@/components/TanTable';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/hooks/useUsers';

import { columns } from './columns';

// /app/admin/settings/users/page.tsx

// /app/admin/settings/users/page.tsx

// /app/admin/settings/users/page.tsx

// /app/admin/settings/users/page.tsx

// SIMPLE, DECLARATIVO Y FÁCIL DE LEER
export default function UsersPage() {
    const { users, isLoading } = useUsers();

    return (
        <TanTable
            columns={columns}
            data={users}
            loading={isLoading}
            filterPlaceholder="Filtrar usuarios..."
            toolbarActions={
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nuevo Usuario
                </Button>
            }
        />
    );
}
```

## 7. Beneficios

- **Reducción de Boilerplate:** Elimina la necesidad de declarar múltiples `useState` en cada página que implementa una tabla.
- **Reutilización Real:** La lógica de la tabla se define una sola vez en el hook `useTanTable`.
- **Mantenibilidad:** Cualquier cambio o mejora en la lógica de la tabla (ej. añadir una nueva función de exportación) se realiza en un solo lugar.
- **Developer Experience (DX):** Crear nuevas tablas se vuelve una tarea trivial, rápida y menos propensa a errores.
- **Única Fuente de Verdad:** El hook `useTanTable` se convierte en la única fuente de verdad para la configuración y el estado de las tablas en toda la aplicación.
