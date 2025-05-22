import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Definir las páginas iniciales
    const pages = [
        {
            name: 'Dashboard',
            path: '/admin/dashboard',
            description: 'Panel principal del sistema',
        },
        {
            name: 'Usuarios',
            path: '/admin/settings/users',
            description: 'Gestión de usuarios del sistema',
        },
        {
            name: 'Auditoria',
            path: '/admin/settings/audit',
            description: 'Gestión de auditoria del sistema',
        },
        {
            name: 'Permisos de Páginas',
            path: '/admin/settings/permissions',
            description: 'Configuración de acceso a páginas por rol',
        },
        {
            name: 'Tickets',
            path: '/admin/settings/tickets',
            description: 'Gestión de tickets del sistema',
        },
        // Agrega aquí más páginas según necesites
    ];

    // Buscar el rol SuperAdministrador
    const superAdminRole = await prisma.role.findFirst({
        where: {
            name: 'SuperAdministrador',
        },
    });

    if (!superAdminRole) {
        throw new Error('El rol SuperAdministrador no existe');
    }

    // Crear las páginas y asignar permisos al SuperAdministrador
    for (const pageData of pages) {
        const page = await prisma.page.upsert({
            where: { path: pageData.path },
            update: pageData,
            create: {
                ...pageData,
                state: 1,
            },
        });

        // Asignar permiso al SuperAdministrador
        await prisma.pageRole.upsert({
            where: {
                pageId_roleId: {
                    pageId: page.id,
                    roleId: superAdminRole.id,
                },
            },
            update: {},
            create: {
                pageId: page.id,
                roleId: superAdminRole.id,
            },
        });

        console.log(`✅ Página ${page.name} creada y asignada a SuperAdministrador`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 