'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import prisma from '@/lib/db/db';

interface CreatePageData {
    name: string;
    path: string;
    description?: string;
}

export async function createPage(data: CreatePageData) {
    try {
        const session = await getServerSession(authOptions);

        const page = await prisma.page.create({
            data,
        });

        await logAuditEvent({
            action: AUDIT_ACTIONS.PAGE.CREATE,
            entity: AUDIT_ENTITIES.PAGE,
            entityId: page.id,
            description: `Página "${page.name}" creada`,
            metadata: { ...data },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/permissions');
        return { success: true, page };
    } catch (error) {
        console.error('Error creating page:', error);
        throw error;
    }
}

export async function updatePage(id: string, data: Partial<CreatePageData>) {
    try {
        const session = await getServerSession(authOptions);

        const page = await prisma.page.update({
            where: { id },
            data,
        });

        await logAuditEvent({
            action: AUDIT_ACTIONS.PAGE.UPDATE,
            entity: AUDIT_ENTITIES.PAGE,
            entityId: page.id,
            description: `Página "${page.name}" actualizada`,
            metadata: { ...data },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/permissions');
        return { success: true, page };
    } catch (error) {
        console.error('Error updating page:', error);
        throw error;
    }
}

export async function deletePage(id: string) {
    try {
        const session = await getServerSession(authOptions);

        const page = await prisma.page.delete({
            where: { id },
        });

        await logAuditEvent({
            action: AUDIT_ACTIONS.PAGE.DELETE,
            entity: AUDIT_ENTITIES.PAGE,
            entityId: id,
            description: `Página "${page.name}" eliminada`,
            metadata: { pageId: id, pageName: page.name },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/settings/permissions');
        return { success: true };
    } catch (error) {
        console.error('Error deleting page:', error);
        throw error;
    }
}

export async function updatePageRole(pageId: string, roleId: string, action: 'add' | 'remove') {
    try {
        if (!pageId || !roleId || !['add', 'remove'].includes(action)) {
            throw new Error('Invalid parameters');
        }

        const session = await getServerSession(authOptions);

        if (action === 'add') {
            const existingPermission = await prisma.pageRole.findFirst({
                where: {
                    pageId,
                    roleId,
                },
            });

            if (!existingPermission) {
                await prisma.pageRole.create({
                    data: {
                        pageId,
                        roleId,
                    },
                });

                // Obtener información de la página y el rol para el log
                const [page, role] = await Promise.all([
                    prisma.page.findUnique({ where: { id: pageId } }),
                    prisma.role.findUnique({ where: { id: roleId } }),
                ]);

                await logAuditEvent({
                    action: AUDIT_ACTIONS.PAGE.UPDATE_PERMISSIONS,
                    entity: AUDIT_ENTITIES.PAGE,
                    entityId: pageId,
                    description: `Rol "${role?.name}" asignado a la página "${page?.name}"`,
                    metadata: {
                        pageId,
                        pageName: page?.name,
                        roleId,
                        roleName: role?.name,
                        action: 'add',
                    },
                    userId: session?.user?.id,
                    userName: session?.user?.name
                        ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                        : undefined,
                });
            }
        } else {
            await prisma.pageRole.deleteMany({
                where: {
                    pageId,
                    roleId,
                },
            });

            // Obtener información de la página y el rol para el log
            const [page, role] = await Promise.all([
                prisma.page.findUnique({ where: { id: pageId } }),
                prisma.role.findUnique({ where: { id: roleId } }),
            ]);

            await logAuditEvent({
                action: AUDIT_ACTIONS.PAGE.UPDATE_PERMISSIONS,
                entity: AUDIT_ENTITIES.PAGE,
                entityId: pageId,
                description: `Rol "${role?.name}" removido de la página "${page?.name}"`,
                metadata: {
                    pageId,
                    pageName: page?.name,
                    roleId,
                    roleName: role?.name,
                    action: 'remove',
                },
                userId: session?.user?.id,
                userName: session?.user?.name
                    ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                    : undefined,
            });
        }

        revalidatePath('/admin/settings/pages');
        return { success: true };
    } catch (error) {
        console.error('Error updating page role:', error);
        throw error;
    }
}
