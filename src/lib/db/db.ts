import { PrismaClient } from '@prisma/client';

// Tipamos globalThis para mayor claridad
const globalForPrisma = globalThis as { prisma?: PrismaClient };

// Función para crear una instancia singleton con posibles opciones
const prismaClientSingleton = () => {
    /*return new PrismaClient({
        log:
            process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });*/
    return new PrismaClient();
};

// Obtenemos o creamos la instancia
const prisma: PrismaClient = globalForPrisma.prisma ?? prismaClientSingleton();

// Guardamos en global solo en desarrollo y si no existe aún
if (process.env.NODE_ENV !== 'production' && !globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
}

export default prisma;
