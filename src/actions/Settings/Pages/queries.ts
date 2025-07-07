'use server';

import prisma from '@/lib/db/db';

export interface Page {
    id: string;
    name: string;
    path: string;
    description: string | null;
    pageRoles: Array<{
        roleId: string;
        role: {
            name: string;
        };
    }>;
}

export async function getPages() {
    try {
        return await prisma.page.findMany({
            where: {
                state: 1,
            },
            include: {
                pageRoles: {
                    include: {
                        role: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        console.error('Error fetching pages:', error);
        throw error;
    }
}

export async function checkPageAccess(path: string, roles: string[]) {
    try {
        // Si es la ruta del dashboard, permitir acceso
        if (path === '/admin/dashboard') {
            return { hasAccess: true };
        }

        const page = await prisma.page.findFirst({
            where: {
                path,
                state: 1,
            },
            include: {
                pageRoles: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        // Si la página no está registrada, denegar acceso por defecto
        if (!page) {
            return { hasAccess: false };
        }

        const allowedRoles = page.pageRoles.map((pr) => pr.role?.name).filter(Boolean) as string[];

        // Si no hay roles asignados a la página, denegar acceso
        if (allowedRoles.length === 0) {
            return { hasAccess: false };
        }

        // Verificar si alguno de los roles del usuario tiene acceso
        const hasAccess = roles.some((role) => allowedRoles.includes(role));

        return { hasAccess };
    } catch (error) {
        console.error('Error checking page access:', error);
        throw error;
    }
}
