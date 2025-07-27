# Migración de Permisos de Páginas al Sistema de Tablas Moderno

## 📋 Resumen

Este directorio contiene la migración completa del componente `PagePermissionsManager` desde `components/Settings/PagePermissions/` al nuevo sistema de tablas moderno usando `DataTableManager`.

## 🔄 Cambios Principales

### **Antes:**
```
src/components/Settings/PagePermissions/
└── PagePermissionsManager.tsx (700+ líneas)
```

### **Después:**
```
src/components/Tables/Setting/Permissions/
├── index.ts                      # Exportaciones centralizadas
├── PermissionsTableNew.tsx       # Componente principal (150 líneas)
├── permissionsConfig.ts          # Configuración de tabla
├── permissionsTransformers.ts    # Transformadores de datos
└── README.md                     # Esta documentación
```

## 🎯 Características Implementadas

### **Columnas Dinámicas de Roles** ✅
- Genera automáticamente columnas checkbox para cada rol disponible
- Usa `ColumnFactory.roleCheckboxColumns()` nueva función
- Actualización optimista del estado local con `handlePermissionChange`
- Integración completa con `updatePageRole` server action

### **Server Action Unificada**
- `getPagesWithRoles()` obtiene páginas y roles en paralelo
- Transformer incluye roles disponibles en cada fila
- Optimizado para el sistema DataTableManager

### **Gestión de Permisos**
- Callbacks para manejar cambios de checkboxes
- Actualización optimista con fallback a toast de error
- Integración con `updatePageRole` server action

### **Sistema de Modales**
- Modal para crear nueva página (dynamic import)
- Modal para editar página (dynamic import)
- Configuración de acciones estándar (edit, delete)

## 🔧 Funcionalidades

### **Columnas de la Tabla:**
1. **Página** - Nombre con ordenamiento y búsqueda ✅
2. **Ruta** - Path con ordenamiento y búsqueda ✅
3. **Descripción** - Texto con búsqueda ✅
4. **[Roles Dinámicos]** - Checkboxes interactivos para cada rol disponible ✅
5. **Acciones** - Editar y eliminar con modales integrados ✅

### **Acciones Disponibles:**
- ✏️ **Editar página** - Modal con form de edición
- 🗑️ **Eliminar página** - Confirmación y eliminación con audit log
- ✅ **Toggle permisos** - Checkboxes para asignar/remover roles

## 📊 Mejoras Técnicas

### **Rendimiento:**
- Carga paralela de páginas y roles
- Actualización optimista de checkboxes
- Dynamic imports para modales

### **Mantenibilidad:**
- Configuración centralizada en archivos separados
- Reutilización de ColumnFactory y DataTableManager
- Separación clara de responsabilidades

### **Escalabilidad:**
- Fácil agregar nuevas columnas o acciones
- Sistema de columnas dinámicas extensible
- Transformadores de datos modulares

## 🚀 Uso

```typescript
import { PermissionsTableNew } from '@/components/Tables/Setting/Permissions';

export default function PermissionsPage() {
    return (
        <ProtectedRoute>
            <div className="bg-muted/50 rounded-xl p-6">
                <PermissionsTableNew />
            </div>
        </ProtectedRoute>
    );
}
```

## 🔍 Detalles de Implementación

### **Generación de Columnas Dinámicas:**
```typescript
const roleColumns = ColumnFactory.roleCheckboxColumns<PageWithRoles>(
    roles,
    handlePermissionChange
);
```

### **Configuración de DataSource:**
```typescript
dataSource: {
    type: 'serverAction',
    serverAction: getPagesWithRoles,
    transform: transformPermissionsData,
}
```

### **Manejo de Estado:**
```typescript
// Actualización optimista con integración completa
const handlePermissionChange = async (pageId: string, roleId: string, isChecked: boolean) => {
    await updatePageRole(pageId, roleId, isChecked ? 'add' : 'remove');
    
    // Actualización optimista del estado local
    setPages(prevPages => 
        prevPages.map(page => {
            if (page.id === pageId) {
                const updatedPageRoles = isChecked
                    ? [...page.pageRoles, { roleId, role: { name: role.name } }]
                    : page.pageRoles.filter(pr => pr.roleId !== roleId);
                return { ...page, pageRoles: updatedPageRoles };
            }
            return page;
        })
    );
    toast.success('Permisos actualizados correctamente');
};
```

## ✅ Beneficios Logrados

- 🏗️ **Arquitectura Consistente**: Sigue el patrón establecido por Roles/Users/Tickets
- 📁 **Organización Mejorada**: Ubicación lógica en Tables/Setting/
- 🔄 **Reutilización**: Aprovecha DataTableManager y ColumnFactory
- 🧹 **Código Limpio**: Reducción de ~700 líneas a ~150 líneas
- 📈 **Escalabilidad**: Fácil extensión con nuevas funcionalidades
- 🐛 **Debugging**: Estado más predecible y centralizado

---

**Migrado el:** $(date)  
**Estado:** ✅ Completado y Funcional  
**Compatibilidad:** 100% con funcionalidades originales