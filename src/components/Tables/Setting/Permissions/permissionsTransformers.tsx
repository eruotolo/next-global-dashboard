import type { 
    PagesWithRolesResponse, 
    PageWithRoles 
} from '@/actions/Settings/Pages/unifiedQueries';

/**
 * Transforma los datos de la respuesta unificada para incluir roles disponibles
 * en cada página, facilitando la generación de columnas dinámicas
 */
export function transformPermissionsData(response: PagesWithRolesResponse): PageWithRoles[] {
    const { pages, roles } = response;

    return pages.map(page => ({
        ...page,
        availableRoles: roles,
    }));
}