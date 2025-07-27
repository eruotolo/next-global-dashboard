'use client';

import { DataTableManager } from '@/components/Table/DataTableManager';
import { 
    usersTableConfig, 
    usersActionConfig, 
    NewUserModalComponent 
} from '@/components/Table/configs/UsersTableConfig';

/**
 * Tabla de Usuarios migrada al nuevo sistema de tablas
 * Mantiene toda la funcionalidad de la versión anterior pero usando
 * el sistema moderno y reutilizable
 */
export default function UserTableNew() {
    return (
        <DataTableManager
            entityConfig={usersTableConfig}
            actionConfig={usersActionConfig}
            title="Usuarios"
            description="Crear, Editar y Eliminar"
            createModal={({ refreshAction }) => (
                <NewUserModalComponent refreshAction={refreshAction} />
            )}
        />
    );
}