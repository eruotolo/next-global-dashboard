'use server';

import prisma from '@/dbprisma/db';
import { revalidatePath } from 'next/cache';

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
        const pages = await prisma.page.findMany({
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

        return pages;
    } catch (error) {
        console.error('Error fetching pages:', error);
        throw new Error('Failed to fetch pages');
    }
}

export async function checkPageAccess(path: string, roles: string[]) {
    try {
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

        if (!page) {
            return { hasAccess: true };
        }

        const allowedRoles = page.pageRoles.map(pr => pr.role?.name).filter(Boolean) as string[];
        const hasAccess = roles.some(role => allowedRoles.includes(role));

        return { hasAccess };
    } catch (error) {
        console.error('Error checking page access:', error);
        throw new Error('Failed to check page access');
    }
} 