import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    try {
        // 1. Crear el rol SuperAdministrador
        const SUPER_ADMIN = '1';
        const superRole = await prisma.role.upsert({
            where: { id: SUPER_ADMIN },
            update: {},
            create: {
                id: SUPER_ADMIN,
                name: 'SuperAdministrador',
            },
        });
        console.log('✅ Rol SuperAdministrador creado');

        // 2. Crear el usuario SuperAdmin si no existe
        const superAdminEmail = process.env.SUPER_EMAIL ?? 'edgardoruotolo@gmail.com';
        const existingUser = await prisma.user.findUnique({
            where: { email: superAdminEmail },
        });

        if (!existingUser) {
            const userPass = process.env.SUPER_PASSWORD ?? 'Guns026772';
            const userPassHash = await hash(userPass, 10);

            const superAdmin = await prisma.user.create({
                data: {
                    email: superAdminEmail,
                    name: 'Edgardo',
                    lastName: 'Ruotolo Cardozo',
                    phone: '+56967553841',
                    address: 'Antonio Guarategua Lebe S/N',
                    city: 'Castro',
                    password: userPassHash,
                    image: '/shadcn.jpg',
                    state: 1,
                },
            });

            // Crear relación usuario-rol
            await prisma.userRole.create({
                data: {
                    userId: superAdmin.id,
                    roleId: SUPER_ADMIN,
                },
            });
            console.log('✅ Usuario SuperAdministrador creado');
        } else {
            console.log('ℹ️ Usuario SuperAdministrador ya existe');
        }

        // 3. Definir y crear las páginas iniciales
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