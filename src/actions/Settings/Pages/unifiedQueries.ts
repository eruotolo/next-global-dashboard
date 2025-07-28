'use server';

import { getRoles } from '../Roles/queries';
import { type Page, getPages } from './queries';

export interface Role {
    id: string;
    name: string;
}

export interface PageWithRoles extends Page {
    availableRoles: Role[];
}

export interface PagesWithRolesResponse {
    pages: Page[];
    roles: Role[];
}

/**
 * Server action unificada que obtiene páginas y roles en paralelo
 * Optimizada para el sistema de tablas moderno
 */
export async function getPagesWithRoles(): Promise<PagesWithRolesResponse> {
    try {
        const [pages, roles] = await Promise.all([getPages(), getRoles()]);

        return {
            pages,
            roles,
        };
    } catch (error) {
        console.error('Error fetching pages with roles:', error);
        throw error;
    }
}

/**
 * Wrapper para compatibilidad con DataTableManager
 * Retorna solo las páginas como array para el sistema de tablas
 */
export async function getPagesForTable(): Promise<PageWithRoles[]> {
    try {
        const { pages, roles } = await getPagesWithRoles();

        return pages.map((page) => ({
            ...page,
            availableRoles: roles,
        }));
    } catch (error) {
        console.error('Error fetching pages for table:', error);
        throw error;
    }
}
