'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    BtnViewCell,
    BtnEditCell,
    BtnDeleteCell,
    BtnChangePasswordCell,
    BtnConfigCell,
} from '@/components/BtnActionCell/BtnActionCell';
import type { ActionConfig } from '../types/TableConfig';

interface ActionCellProps {
    row: {
        original: any;
    };
    actions: ActionConfig[];
    refreshAction?: () => Promise<void>;
}

function ActionCell({ row, actions, refreshAction }: ActionCellProps) {
    const [modalsState, setModalsState] = useState<Record<string, boolean>>({});

    const openModal = (actionId: string) => {
        setModalsState((prev) => ({ ...prev, [actionId]: true }));
    };

    const closeModal = (actionId: string) => {
        setModalsState((prev) => ({ ...prev, [actionId]: false }));
    };

    const handleDelete = async (id: string, deleteAction: (id: string) => Promise<any>) => {
        try {
            const success = await deleteAction(id);
            if (success) {
                if (refreshAction) await refreshAction();
                toast.success('Eliminación exitosa', {
                    description: 'El elemento se ha eliminado correctamente.',
                });
            } else {
                toast.error('Error al eliminar', {
                    description: 'No se pudo eliminar el elemento.',
                });
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            toast.error('Error al eliminar', {
                description: 'Error al intentar eliminar el elemento',
            });
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {actions.map((action) => {
                        switch (action.id) {
                            case 'view':
                                return (
                                    <BtnViewCell
                                        key={action.id}
                                        onAction={() => {
                                            if (action.onClick) {
                                                action.onClick(row.original);
                                            } else {
                                                openModal(action.id);
                                            }
                                        }}
                                        label={action.label}
                                        permission={action.permission}
                                    />
                                );

                            case 'edit':
                                return (
                                    <BtnEditCell
                                        key={action.id}
                                        onAction={() => {
                                            if (action.onClick) {
                                                action.onClick(row.original);
                                            } else {
                                                openModal(action.id);
                                            }
                                        }}
                                        label={action.label}
                                        permission={action.permission}
                                    />
                                );

                            case 'change-password':
                                return (
                                    <BtnChangePasswordCell
                                        key={action.id}
                                        onAction={() => {
                                            if (action.onClick) {
                                                action.onClick(row.original);
                                            } else {
                                                openModal(action.id);
                                            }
                                        }}
                                        label={action.label}
                                        permission={action.permission}
                                    />
                                );

                            case 'assign-roles':
                            case 'assign-permissions':
                            case 'config':
                                return (
                                    <BtnConfigCell
                                        key={action.id}
                                        onAction={() => {
                                            if (action.onClick) {
                                                action.onClick(row.original);
                                            } else {
                                                openModal(action.id);
                                            }
                                        }}
                                        label={action.label}
                                        permission={action.permission}
                                    />
                                );

                            case 'delete':
                                return (
                                    <BtnDeleteCell
                                        key={action.id}
                                        itemId={row.original.id}
                                        onDelete={async (id) => {
                                            if (action.onClick) {
                                                action.onClick(row.original);
                                            } else if (action.serverAction) {
                                                await handleDelete(id, action.serverAction as any);
                                            }
                                        }}
                                        label={action.label}
                                        permission={action.permission}
                                        className={action.className}
                                    />
                                );

                            default:
                                // Para acciones custom
                                return (
                                    <BtnEditCell
                                        key={action.id}
                                        onAction={() => {
                                            if (action.onClick) {
                                                action.onClick(row.original);
                                            } else {
                                                openModal(action.id);
                                            }
                                        }}
                                        label={action.label}
                                        permission={action.permission}
                                    />
                                );
                        }
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Renderizar modales dinámicamente */}
            {actions.map((action) => {
                if (!action.modal || !modalsState[action.id]) return null;

                const ModalComponent = action.modal;
                return (
                    <ModalComponent
                        key={action.id}
                        id={row.original.id}
                        refreshAction={refreshAction}
                        open={modalsState[action.id]}
                        onCloseAction={() => closeModal(action.id)}
                    />
                );
            })}
        </>
    );
}

export const createActionColumn = (
    actions: ActionConfig[],
    refreshAction?: () => Promise<void>,
): ColumnDef<any> => ({
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => <ActionCell row={row} actions={actions} refreshAction={refreshAction} />,
    enableSorting: false,
    enableHiding: false,
});

export const createViewAction = (overrides: Partial<ActionConfig> = {}): ActionConfig => ({
    id: 'view',
    label: 'Ver perfil',
    permission: ['Ver'],
    ...overrides,
});

export const createEditAction = (overrides: Partial<ActionConfig> = {}): ActionConfig => ({
    id: 'edit',
    label: 'Editar',
    permission: ['Editar'],
    ...overrides,
});

export const createDeleteAction = (overrides: Partial<ActionConfig> = {}): ActionConfig => ({
    id: 'delete',
    label: 'Eliminar',
    permission: ['Eliminar'],
    className: 'text-red-600',
    ...overrides,
});

export const createChangePasswordAction = (
    overrides: Partial<ActionConfig> = {},
): ActionConfig => ({
    id: 'change-password',
    label: 'Cambiar contraseña',
    permission: ['Editar'],
    ...overrides,
});

export const createAssignRolesAction = (overrides: Partial<ActionConfig> = {}): ActionConfig => ({
    id: 'assign-roles',
    label: 'Asignar roles',
    permission: ['Editar'],
    ...overrides,
});

export const createAssignPermissionsAction = (
    overrides: Partial<ActionConfig> = {},
): ActionConfig => ({
    id: 'assign-permissions',
    label: 'Asignar permisos',
    permission: ['Editar'],
    ...overrides,
});

export const getDefaultActionsForEntity = (entity: string): ActionConfig[] => {
    switch (entity.toLowerCase()) {
        case 'user':
            return [
                createViewAction(),
                createEditAction(),
                createChangePasswordAction(),
                createAssignRolesAction(),
                createDeleteAction(),
            ];

        case 'role':
            return [
                createEditAction({ label: 'Editar rol' }),
                createAssignPermissionsAction(),
                createDeleteAction({ label: 'Eliminar rol' }),
            ];

        case 'ticket':
            return [
                createEditAction({ label: 'Editar ticket' }),
                createDeleteAction({ label: 'Eliminar ticket' }),
            ];

        default:
            return [createViewAction(), createEditAction(), createDeleteAction()];
    }
};
