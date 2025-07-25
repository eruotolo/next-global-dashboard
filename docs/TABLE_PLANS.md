# 📊 Plan de Refactorización: Sistema DataTable Genérico y Reutilizable

## 🎯 **Objetivo Principal**

Crear un sistema de tablas genérico que elimine la duplicación de código y proporcione una API consistente para todas las tablas del dashboard, respetando los diferentes patrones de gestión de estado existentes.

## 📋 **Análisis de Situación Actual**

### **Componentes Analizados:**

- **RoleTable** (`/Tables/Setting/Roles/`) + **RolesColumns**
- **UserTable** (`/Tables/Setting/User/`) + **UserColumns**
- **TicketTable** (`/Tables/Setting/Ticket/`) + **TicketColumns**

### **Problemas Identificados:**

1. **Duplicación de código JSX**: ~85% de código repetido en headers, loading, error handling
2. **Gestión de estado inconsistente**:
    - `RoleTable/UserTable`: `useUserRoleStore` (Zustand)
    - `TicketTable`: `useState` + Server Actions directas
3. **ActionCell lógica repetida**: Modales, permisos, eliminación en cada columna
4. **Patrones de loading/error diferentes**: Sin consistencia UX
5. **Configuración hardcodeada**: Títulos, descripciones, placeholders repetidos

### **Tecnologías Utilizadas Actualmente:**

- **@tanstack/react-table** v8.21.2 - Tabla base actual
- **Zustand** v5.0.5 - State management
- **Radix UI** - Componentes primitivos
- **Tailwind CSS** - Estilos
- **TypeScript 5** - Type safety
- **Lucide React** - Iconografía
- **Sonner** - Toast notifications

## 🏗️ **Arquitectura del Nuevo Sistema**

### **Componentes Principales:**

#### **1. DataTableManager** - Componente Universal

```typescript
interface DataTableManagerProps<T> {
    entityConfig: EntityTableConfig<T>;
    title: string;
    description: string;
    createModal: React.ComponentType<{ refreshAction: () => void }>;
    className?: string;
}
```

**Responsabilidades:**

- Gestión unificada de estado (loading, error, data)
- Integración con diferentes fuentes de datos
- Rendering consistente de header y acciones
- Delegación a `DataTable` existente

#### **2. Adaptadores de Datos**

##### **BaseAdapter** - Interfaz Común

```typescript
interface DataAdapter<T> {
    data: T[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    initialize: () => Promise<void>;
}
```

##### **ZustandAdapter** - Para Stores Existentes

```typescript
class ZustandAdapter<T> implements DataAdapter<T> {
    constructor(
        private store: () => StoreApi<any>,
        private config: ZustandConfig,
    ) {}
}
```

##### **ServerActionAdapter** - Para Server Actions

```typescript
class ServerActionAdapter<T> implements DataAdapter<T> {
    constructor(
        private serverAction: () => Promise<T[]>,
        private transform?: (data: any[]) => T[],
    ) {}
}
```

#### **3. Factories de Componentes**

##### **ColumnFactory** - Generador de Columnas

```typescript
class ColumnFactory {
    static sortableText<T>(key: keyof T, label: string, options?: TextColumnOptions): ColumnDef<T>;

    static statusBadge<T>(key: keyof T, label: string, statusConfig: StatusConfig): ColumnDef<T>;

    static actions<T>(actionConfig: ActionConfig<T>): ColumnDef<T>;

    static custom<T>(
        key: keyof T,
        label: string,
        renderer: (value: any, row: T) => React.ReactNode,
    ): ColumnDef<T>;
}
```

##### **ActionCellFactory** - Sistema de Acciones

```typescript
interface ActionConfig<T> {
    edit?: {
        modal: React.ComponentType<EditModalProps>;
        permission: string[];
        label: string;
    };
    delete?: {
        serverAction: (id: string) => Promise<boolean>;
        permission: string[];
        label: string;
    };
    view?: {
        modal: React.ComponentType<ViewModalProps>;
        permission: string[];
        label: string;
    };
    custom?: CustomAction<T>[];
}
```

##### **StatusBadgeFactory** - Para Estados

```typescript
interface StatusConfig {
    [key: string]: {
        className: string;
        label?: string;
    };
}

const ticketStatusConfig: StatusConfig = {
    OPEN: { className: 'text-green-500 bg-green-100 border-green-400' },
    IN_PROGRESS: { className: 'text-yellow-500 bg-yellow-100 border-yellow-400' },
    // ...
};
```

### **Configuraciones por Entidad:**

#### **roles.config.ts**

```typescript
export const rolesTableConfig: EntityTableConfig<RolePermissionInterface> = {
    entity: 'roles',
    columns: [
        ColumnFactory.sortableText('name', 'Nombres'),
        ColumnFactory.custom('permissions', 'Permisos', renderPermissions),
        ColumnFactory.actions(rolesActionConfig),
    ],
    dataSource: {
        type: 'zustand',
        store: () => useUserRoleStore,
        selectors: {
            data: 'rolesData',
            loading: 'isLoadingRoles',
            fetch: 'fetchRoles',
        },
    },
    filterPlaceholder: 'Buscar...',
};
```

#### **tickets.config.ts**

```typescript
export const ticketsTableConfig: EntityTableConfig<SimpleTicketQuery> = {
    entity: 'tickets',
    columns: [
        ColumnFactory.sortableText('code', 'Código'),
        ColumnFactory.sortableText('title', 'Título'),
        ColumnFactory.fullName(['userName', 'userLastName'], 'Usuario'),
        ColumnFactory.statusBadge('status', 'Estado', ticketStatusConfig),
        ColumnFactory.statusBadge('priority', 'Prioridad', ticketPriorityConfig),
        ColumnFactory.actions(ticketsActionConfig),
    ],
    dataSource: {
        type: 'serverAction',
        serverAction: getAllTickets,
        transform: (data) => data.map(transformTicketData),
    },
    filterPlaceholder: 'Buscar en todos los campos...',
};
```

## 📁 **Estructura de Archivos**

```
/src/components/Table/
├── DataTableManager.tsx                 # Componente principal universal
├── adapters/
│   ├── BaseAdapter.ts                  # Interfaz común para adaptadores
│   ├── ZustandAdapter.ts               # Adaptador para stores Zustand
│   ├── ServerActionAdapter.ts          # Adaptador para Server Actions
│   └── index.ts                        # Exportaciones de adaptadores
├── factories/
│   ├── ColumnFactory.ts                # Generador de definiciones de columnas
│   ├── ActionCellFactory.ts            # Generador de celdas de acciones
│   ├── StatusBadgeFactory.ts           # Generador de badges de estado
│   └── index.ts                        # Exportaciones de factories
├── configs/
│   ├── roles.config.ts                 # Configuración específica para roles
│   ├── users.config.ts                 # Configuración específica para usuarios
│   ├── tickets.config.ts               # Configuración específica para tickets
│   └── index.ts                        # Exportaciones centralizadas
├── types/
│   ├── TableTypes.ts                   # Tipos TypeScript genéricos
│   ├── AdapterTypes.ts                 # Tipos específicos de adaptadores
│   ├── FactoryTypes.ts                 # Tipos para factories
│   └── index.ts                        # Exportaciones de tipos
├── utils/
│   ├── tableHelpers.ts                 # Utilidades helper para tablas
│   └── transformers.ts                 # Transformadores de datos
└── index.ts                            # Punto de entrada principal
```

## 🔄 **Plan de Migración Gradual**

### **Fase 1: Infraestructura Base (Días 1-2)**

1. ✅ Crear estructura de carpetas en `/components/Table/`
2. ✅ Implementar tipos TypeScript genéricos
3. ✅ Desarrollar BaseAdapter y interfaces comunes
4. ✅ Crear DataTableManager componente principal

### **Fase 2: Adaptadores y Factories (Días 3-4)**

1. ✅ Implementar ZustandAdapter
2. ✅ Implementar ServerActionAdapter
3. ✅ Crear ColumnFactory con generadores básicos
4. ✅ Desarrollar ActionCellFactory
5. ✅ Implementar StatusBadgeFactory

### **Fase 3: Configuraciones (Día 5)**

1. ✅ Crear configuración para TicketTable (Server Actions)
2. ✅ Crear configuración para RoleTable (Zustand)
3. ✅ Crear configuración para UserTable (Zustand)

### **Fase 4: Migración Incremental (Días 6-8)**

1. 🔄 Migrar TicketTable como prueba de concepto
2. 🔄 Validar funcionalidad completa (CRUD, permisos, modales)
3. 🔄 Migrar RoleTable manteniendo Zustand
4. 🔄 Migrar UserTable
5. 🔄 Testing exhaustivo de todas las funcionalidades

### **Fase 5: Limpieza y Optimización (Día 9)**

1. 🔄 Deprecar componentes antiguos
2. 🔄 Optimizaciones de performance
3. 🔄 Documentación de API
4. 🔄 Ejemplos de uso para futuras tablas

## 💡 **Beneficios Esperados**

### **Para Desarrolladores:**

- **90% menos código** para crear nuevas tablas
- **API declarativa** simple y consistente
- **Type safety** completo con TypeScript
- **Reutilización** de toda la lógica común
- **Mantenimiento centralizado** de funcionalidades

### **Para Usuarios:**

- **Experiencia consistente** en todas las tablas
- **Performance mejorada** con optimizaciones automáticas
- **Menos bugs** por código probado y reutilizado
- **Funcionalidades uniformes** (filtros, paginación, sorting)

### **Para el Proyecto:**

- **Mantenimiento simplificado** - un solo lugar para cambios
- **Escalabilidad** - fácil agregar nuevas entidades
- **Estándares** - patrones consistentes automáticamente
- **Testing** - casos de prueba centralizados

## 🧪 **Ejemplos de Uso Post-Migración**

### **Crear Nueva Tabla (Ejemplo: Products)**

```typescript
// 1. Definir configuración
export const productsConfig: EntityTableConfig<Product> = {
  entity: 'products',
  columns: [
    ColumnFactory.sortableText('name', 'Producto'),
    ColumnFactory.currency('price', 'Precio'),
    ColumnFactory.statusBadge('status', 'Estado', productStatusConfig),
    ColumnFactory.actions(productActionConfig)
  ],
  dataSource: {
    type: 'serverAction',
    serverAction: getAllProducts
  }
}

// 2. Usar en componente
export function ProductTable() {
  return (
    <DataTableManager
      entityConfig={productsConfig}
      title="Productos"
      description="Gestionar catálogo de productos"
      createModal={NewProductModal}
    />
  )
}
```

### **Configuración de Actions**

```typescript
const productActionConfig: ActionConfig<Product> = {
    view: {
        modal: ViewProductModal,
        permission: ['Ver'],
        label: 'Ver producto',
    },
    edit: {
        modal: EditProductModal,
        permission: ['Editar'],
        label: 'Editar producto',
    },
    delete: {
        serverAction: deleteProduct,
        permission: ['Eliminar'],
        label: 'Eliminar producto',
    },
    custom: [
        {
            icon: ShoppingCart,
            label: 'Agregar al carrito',
            action: (product) => addToCart(product.id),
            permission: ['Comprar'],
        },
    ],
};
```

## 🎯 **Métricas de Éxito**

### **Reducción de Código:**

- **Antes**: ~300 líneas por tabla (RoleTable + RolesColumns)
- **Después**: ~30 líneas de configuración
- **Reducción**: 90% menos código

### **Tiempo de Desarrollo:**

- **Antes**: 2-3 días para tabla completa con CRUD
- **Después**: 2-3 horas de configuración
- **Mejora**: 80% menos tiempo

### **Mantenimiento:**

- **Antes**: Cambios en 6+ archivos para nueva funcionalidad
- **Después**: Cambios centralizados en factories/adapters
- **Mejora**: Mantenimiento unificado

## 🚀 **Consideraciones de Performance**

### **Optimizaciones Implementadas:**

- **React.memo()** en componentes que lo requieren
- **useMemo()** para cálculos costosos de columnas
- **useCallback()** para funciones de callback
- **Dynamic imports** para modales (ya implementado)
- **Lazy loading** de datos cuando sea apropiado

### **Bundle Size:**

- **Tree shaking** automático de factories no utilizados
- **Code splitting** por configuraciones de entidad
- **Shared chunks** para lógica común

## 📚 **Próximos Pasos Técnicos**

### **Extensiones Futuras:**

1. **SWR/React Query Adapter** para caching avanzado
2. **Infinite Scroll** para tablas grandes
3. **Virtual Scrolling** para performance
4. **Export/Import** funcionalidades
5. **Bulk Operations** avanzadas
6. **Real-time Updates** con WebSockets

### **Integraciones:**

1. **Storybook** para documentar componentes
2. **Testing Library** para pruebas automatizadas
3. **Performance monitoring** con métricas
4. **Accessibility** (ARIA) completo

---

## 📖 **Conclusión**

Este plan de refactorización transformará el sistema actual de tablas duplicadas en una arquitectura escalable, mantenible y eficiente que respeta los patrones existentes mientras proporciona una base sólida para el crecimiento futuro del dashboard.

La implementación será **incremental y sin riesgo**, asegurando que las funcionalidades actuales se mantengan intactas durante todo el proceso de migración.

**Fecha de inicio**: Inmediata  
**Duración estimada**: 9 días de desarrollo  
**Riesgo**: Bajo (migración gradual)  
**Impacto**: Alto (90% reducción de código duplicado)
