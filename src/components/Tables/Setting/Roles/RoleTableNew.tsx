'use client';

import { DataTableManager } from '@/components/Table/DataTableManager';
import {
    rolesTableConfig,
    rolesActionConfig,
    NewRoleModalComponent,
    NewRoleModalFormBuilderComponent,
} from '@/components/Table/configs/RolesTableConfig';
/**
 * Tabla de Roles migrada al nuevo sistema de tablas
 * Mantiene toda la funcionalidad de la versión anterior pero usando
 * el sistema moderno y reutilizable
 */
export default function RoleTableNew() {
    return (
        <DataTableManager
            entityConfig={rolesTableConfig}
            actionConfig={rolesActionConfig}
            title="Roles"
            description="Crear, Editar y Eliminar"
            createModal={({ refreshAction }) => (
                <div className="flex gap-2">
                    <NewRoleModalComponent refreshAction={refreshAction} />
                </div>
            )}
        />
    );
}
