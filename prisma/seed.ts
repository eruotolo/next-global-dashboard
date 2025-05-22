import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Definir las páginas iniciales con sus roles permitidos
    const pages = [
        {
            name: 'Dashboard',
            path: '/admin/dashboard',
            description: 'Panel principal del sistema',
            allowedRoles: ['Usuario', 'Administrador', 'SuperAdministrador', 'Colaborador', 'Editor']
        },
        {
            name: 'Usuarios',
            path: '/admin/settings/users',
            description: 'Gestión de usuarios del sistema',
            allowedRoles: ['Administrador', 'SuperAdministrador']
        },
        {
            name: 'Roles',
            path: '/admin/settings/roles',
            description: 'Gestión de roles y permisos',
            allowedRoles: ['SuperAdministrador']
        },
        {
            name: 'Permisos de Páginas',
            path: '/admin/settings/permissions',
            description: 'Configuración de acceso a páginas por rol',
            allowedRoles: ['SuperAdministrador']
        },
        {
            name: 'Tickets',
            path: '/admin/settings/tickets',
            description: 'Gestión de tickets del sistema',
            allowedRoles: ['Usuario', 'Administrador', 'SuperAdministrador']
        },
    ];

    // Crear las páginas y asignar permisos a los roles correspondientes
    for (const pageData of pages) {
        const { allowedRoles, ...pageInfo } = pageData;
        
        // Crear o actualizar la página
        const page = await prisma.page.upsert({
            where: { path: pageInfo.path },
            update: pageInfo,
            create: {
                ...pageInfo,
                state: 1,
            },
        });

        // Obtener todos los roles permitidos
        const roles = await prisma.role.findMany({
            where: {
                name: {
                    in: allowedRoles
                }
            }
        });

        // Asignar permisos a cada rol
        for (const role of roles) {
            await prisma.pageRole.upsert({
                where: {
                    pageId_roleId: {
                        pageId: page.id,
                        roleId: role.id,
                    },
                },
                update: {},
                create: {
                    pageId: page.id,
                    roleId: role.id,
                },
            });
            console.log(`✅ Página ${page.name} asignada a rol ${role.name}`);
        }
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