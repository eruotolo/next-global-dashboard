import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
    try {
        // 1. Crear el rol SuperAdministrador
        const superRole = await prisma.role.upsert({
            where: { name: 'SuperAdministrador' },
            update: {},
            create: {
                name: 'SuperAdministrador',
            },
        });
        console.log('✅ Rol SuperAdministrador creado');

        // 2. Crear permisos básicos
        const basicPermissions = ['Crear', 'Ver', 'Eliminar', 'Editar'];
        await Promise.all(
            basicPermissions.map(async (permissionName) => {
                const permission = await prisma.permission.upsert({
                    where: { name: permissionName },
                    update: {},
                    create: {
                        name: permissionName,
                    },
                });

                await prisma.permissionRole.upsert({
                    where: {
                        roleId_permissionId: {
                            roleId: superRole.id,
                            permissionId: permission.id,
                        },
                    },
                    update: {},
                    create: {
                        roleId: superRole.id,
                        permissionId: permission.id,
                    },
                });

                console.log(`✅ Permiso ${permissionName} creado y asignado a SuperAdministrador`);
            }),
        );

        // 3. Crear el usuario SuperAdmin
        const superAdminEmail = 'edgardoruotolo@gmail.com';
        const hashedPassword = await hash('Guns026772', 10);

        const superAdmin = await prisma.user.upsert({
            where: { email: superAdminEmail },
            update: {},
            create: {
                email: superAdminEmail,
                name: 'Edgardo',
                lastName: 'Ruotolo Cardozo',
                phone: '+56967553841',
                address: 'Antonio Guarategua Lebe S/N',
                city: 'Castro',
                password: hashedPassword,
                image: '/shadcn.jpg',
                state: 1,
            },
        });
        console.log('✅ Usuario SuperAdmin creado');

        // 4. Asignar el rol SuperAdministrador al usuario
        await prisma.userRole.create({
            data: {
                userId: superAdmin.id,
                roleId: superRole.id,
            },
        });
        console.log('✅ Rol SuperAdministrador asignado al usuario');

        // 5. Crear páginas básicas del sistema
        const pages = [
            {
                name: 'Dashboard',
                path: '/admin/dashboard',
                description: 'Panel principal del sistema',
            },
            {
                name: 'Usuarios y Roles',
                path: '/admin/settings/users',
                description: 'Gestión de usuarios del sistema',
            },
            {
                name: 'Admin Auditoria',
                path: '/admin/settings/audit',
                description: 'Gestión de auditoria del sistema',
            },
            {
                name: 'Admin Permisos',
                path: '/admin/settings/permissions',
                description: 'Configuración de acceso a páginas por rol',
            },
            {
                name: 'Tickets',
                path: '/admin/settings/tickets',
                description: 'Gestión de tickets del sistema',
            },
        ];

        for (const pageData of pages) {
            const page = await prisma.page.upsert({
                where: { path: pageData.path },
                update: pageData,
                create: {
                    ...pageData,
                    state: 1,
                },
            });

            await prisma.pageRole.upsert({
                where: {
                    pageId_roleId: {
                        pageId: page.id,
                        roleId: superRole.id,
                    },
                },
                update: {},
                create: {
                    pageId: page.id,
                    roleId: superRole.id,
                },
            });

            console.log(`✅ Página ${page.name} creada y asignada a SuperAdministrador`);
        }

        // 6. Ejecutar archivos SQL
        /*const sqlFiles = ['country.sql', 'city.sql', 'airports.sql', 'shippingport.sql'];
        for (const file of sqlFiles) {
            await executeSqlFile(file);
        }*/

        console.log('🚀 Inicialización del sistema completada con éxito');
    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
        throw error;
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
