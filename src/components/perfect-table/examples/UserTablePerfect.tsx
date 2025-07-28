'use client';

import { PerfectTable } from '../PerfectTable';
import NewUserModal from '@/components/Modal/Setting/Users/UserNewModal';

/**
 * Ejemplo de migración: UserTable usando PerfectTable
 *
 * ANTES: 40+ líneas de código con toda la configuración manual
 * DESPUÉS: 1 línea de código con funcionalidad idéntica
 */

// Versión ULTRA SIMPLE - Zero Config
export function UserTableZeroConfig() {
    return <PerfectTable entity="User" />;
}

// Versión SIMPLE - Configuración mínima
export function UserTableSimple() {
    return (
        <PerfectTable
            entity="User"
            enableSelection={true}
            createButton={({ refreshAction }) => <NewUserModal refreshAction={refreshAction} />}
        />
    );
}

// Versión AVANZADA - Configuración custom
export function UserTableAdvanced() {
    return (
        <PerfectTable
            entity="User"
            title="Gestión de Usuarios"
            description="Administrar usuarios del sistema"
            enableSelection={true}
            enableBulkActions={true}
            config={{
                // Override columnas específicas
                columnOverrides: {
                    email: {
                        linkable: true,
                        width: 250,
                    },
                    phone: {
                        linkable: true,
                    },
                },

                // Ocultar columnas sensibles
                hiddenColumns: ['birthdate', 'address'],

                // Agregar columna custom
                customColumns: [
                    {
                        id: 'status',
                        header: 'Estado',
                        type: 'badge',
                        accessorFn: (row) => (row.state === 1 ? 'Activo' : 'Inactivo'),
                        colorMap: {
                            Activo: 'green',
                            Inactivo: 'gray',
                        },
                    },
                ],

                // Personalizar acciones (usando el prop directo, no en config)
            }}
            actions={['view', 'edit', 'change-password', 'assign-roles', 'delete']}
            createButton={({ refreshAction }) => <NewUserModal refreshAction={refreshAction} />}
            onSelectionChange={(selectedUsers) => {
                console.log('Usuarios seleccionados:', selectedUsers);
            }}
        />
    );
}

// Export por defecto - Reemplaza UserTable.tsx original
export default UserTableZeroConfig;
