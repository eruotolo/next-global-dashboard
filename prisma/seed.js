const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function seed() {
    console.log('Creando roles, usuarios y relaciones...');

    const SUPER_ADMIN = '1';

    // Crear roles si no existen
    const superRole = await prisma.role.upsert({
        where: { id: SUPER_ADMIN },
        update: {},
        create: {
            id: SUPER_ADMIN,
            name: 'SuperAdministrador',
        },
    });

    // Verificar si el usuario super admin ya existe
    const superAdminEmail = process.env.SUPER_EMAIL ?? 'edgardoruotolo@gmail.com';
    const existingUser = await prisma.user.findUnique({
        where: { email: superAdminEmail },
    });

    if (!existingUser) {
        const userPass = process.env.SUPER_PASSWORD ?? 'Guns026772';
        const userPassHash = await hash(userPass, 10);

        // Crear usuario super admin
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
    } else {
        console.log(`El usuario con email ${superAdminEmail} ya existe. No se creó un duplicado.`);
    }

    // Desconectar Prisma
    await prisma.$disconnect();
}

seed()
    .catch((error) => {
        console.error('Error al ejecutar la semilla:', error);
        process.exit(1);
    })
    .finally(() => {
        console.log('Semilla completada.');
    });
