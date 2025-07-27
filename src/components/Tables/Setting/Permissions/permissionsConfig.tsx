import type React from 'react';
import { toast } from 'sonner';
import { deletePage, updatePage } from '@/actions/Settings/Pages/mutations';
import { getPagesForTable, type PageWithRoles } from '@/actions/Settings/Pages/unifiedQueries';
import { ColumnFactory } from '@/components/Table/factories/ColumnFactory';
import type { EntityTableConfig, ActionConfig, ModalProps } from '@/components/Table/types/TableTypes';
import PageModal from './PageModal';

// Modal funcional para crear páginas
const NewPageModal: React.ComponentType<ModalProps> = ({ open, onCloseAction, refreshAction }) => {
    return (
        <PageModal
            open={open}
            onCloseAction={onCloseAction}
            refreshAction={refreshAction}
            id="" // Sin ID = modo creación
        />
    );
};

// Modal para editar páginas (recibe el ID via props)
const EditPageModal: React.ComponentType<ModalProps> = ({ 
    id,
    open, 
    onCloseAction, 
    refreshAction
}) => {
    return (
        <PageModal
            open={open}
            onCloseAction={onCloseAction}
            refreshAction={refreshAction}
            id={id} // Con ID = modo edición
        />
    );
};

// Adapter para deletePage que retorna boolean como espera el sistema
const deletePageAdapter = async (id: string): Promise<boolean> => {
    try {
        const result = await deletePage(id);
        if (result.success) {
            toast.success('Página eliminada correctamente');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting page:', error);
        toast.error('Error al eliminar la página');
        return false;
    }
};

// Configuración de columnas básicas para la tabla de permisos
export const permissionsColumns = [
    // Columna de nombre de página con ordenamiento
    ColumnFactory.sortableText<PageWithRoles>('name', 'Página', {
        searchable: true,
        minWidth: 150,
    }),

    // Columna de ruta con ordenamiento
    ColumnFactory.sortableText<PageWithRoles>('path', 'Ruta', {
        searchable: true,
        minWidth: 200,
    }),

    // Columna de descripción
    ColumnFactory.text<PageWithRoles>('description', 'Descripción', {
        searchable: true,
        maxWidth: 300,
    }),

    // Columna de acciones
    ColumnFactory.actions<PageWithRoles>(),
];

// Configuración de acciones para permisos de páginas
export const permissionsActionConfig: ActionConfig<PageWithRoles> = {
    edit: {
        permission: ['Editar'],
        label: 'Editar página',
        modal: EditPageModal,
    },
    delete: {
        permission: ['Eliminar'],
        label: 'Eliminar página',
        className: 'text-red-600',
        serverAction: deletePageAdapter,
    },
};

// Configuración completa de la tabla de permisos
export const permissionsTableConfig: EntityTableConfig<PageWithRoles> = {
    entity: 'permissions',
    columns: permissionsColumns,
    dataSource: {
        type: 'serverAction',
        serverAction: getPagesForTable,
    },
    filterPlaceholder: 'Buscar páginas y rutas...',
    options: {
        enableRowSelection: false,
        defaultPageSize: 10,
        enableExport: false,
    },
};

// Componente modal para crear nueva página
export const NewPageModalComponent = NewPageModal;