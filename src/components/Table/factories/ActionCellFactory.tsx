'use client';

import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ActionConfig } from '../types/TableTypes';

/**
 * Factory simplificado para ActionCells
 */
export class ActionCellFactory {
    /**
     * Crea un componente ActionCell básico
     */
    static createActionCell<T>(config: ActionConfig<T>) {
        return function ActionCell({ row, refreshAction }: any) {
            return (
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
                        <div className="px-2 py-1 text-sm">Editar • Eliminar</div>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        };
    }

    /**
     * Configuración básica para tickets
     */
    static createTicketsActionConfig(): ActionConfig<any> {
        return {
            edit: {
                modal: () => null as any,
                permission: ['Editar'],
                label: 'Editar ticket',
            },
            delete: {
                serverAction: async () => true,
                permission: ['Eliminar'],
                label: 'Eliminar ticket',
            },
        };
    }

    /**
     * Configuración básica para roles
     */
    static createRolesActionConfig(): ActionConfig<any> {
        return {
            edit: {
                modal: () => null as any,
                permission: ['Editar'],
                label: 'Editar rol',
            },
            delete: {
                serverAction: async () => true,
                permission: ['Eliminar'],
                label: 'Eliminar rol',
            },
        };
    }

    /**
     * Configuración básica para usuarios
     */
    static createUsersActionConfig(): ActionConfig<any> {
        return {
            edit: {
                modal: () => null as any,
                permission: ['Editar'],
                label: 'Editar usuario',
            },
            delete: {
                serverAction: async () => true,
                permission: ['Eliminar'],
                label: 'Eliminar usuario',
            },
        };
    }
}
