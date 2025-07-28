// Factory automático de Server Actions para operaciones CRUD

import { revalidatePath } from 'next/cache';
import { PrismaSchemaParser } from '../core/PrismaSchemaParser';

// Simulación de Prisma Client (en proyecto real sería import { prisma } from '@/lib/prisma')
const prisma = {
    user: {
        findMany: async (options?: any) => [],
        findUnique: async (options: any) => null,
        create: async (options: any) => null,
        update: async (options: any) => null,
        delete: async (options: any) => null,
        count: async (options?: any) => 0,
    },
    role: {
        findMany: async (options?: any) => [],
        findUnique: async (options: any) => null,
        create: async (options: any) => null,
        update: async (options: any) => null,
        delete: async (options: any) => null,
        count: async (options?: any) => 0,
    },
    ticket: {
        findMany: async (options?: any) => [],
        findUnique: async (options: any) => null,
        create: async (options: any) => null,
        update: async (options: any) => null,
        delete: async (options: any) => null,
        count: async (options?: any) => 0,
    },
    permission: {
        findMany: async (options?: any) => [],
        findUnique: async (options: any) => null,
        create: async (options: any) => null,
        update: async (options: any) => null,
        delete: async (options: any) => null,
        count: async (options?: any) => 0,
    },
} as any;

interface ServerActionOptions {
    revalidatePaths?: string[];
    include?: Record<string, any>;
    select?: Record<string, any>;
}

export class TableServerActionsFactory {
    /**
     * Crea todas las server actions para una entidad
     */
    static createServerActions<T>(entityName: string, options: ServerActionOptions = {}) {
        const entityLower = entityName.toLowerCase();
        const prismaModel = (prisma as any)[entityLower];

        if (!prismaModel) {
            throw new Error(`Modelo ${entityName} no encontrado en Prisma`);
        }

        const autoIncludes = PrismaSchemaParser.getAutoIncludes(entityName);
        const defaultOptions = {
            ...autoIncludes,
            ...(options.include && { include: { ...autoIncludes.include, ...options.include } }),
        };

        return {
            // READ Operations
            getAll: async (filters?: any): Promise<T[]> => {
                'use server';
                try {
                    const where = filters ? this.buildWhereClause(filters) : undefined;
                    return await prismaModel.findMany({
                        where,
                        ...defaultOptions,
                        orderBy: { createdAt: 'desc' },
                    });
                } catch (error) {
                    console.error(`Error fetching ${entityName}:`, error);
                    throw new Error(`Error al obtener ${entityName.toLowerCase()}s`);
                }
            },

            getById: async (id: string): Promise<T | null> => {
                'use server';
                try {
                    return await prismaModel.findUnique({
                        where: { id },
                        ...defaultOptions,
                    });
                } catch (error) {
                    console.error(`Error fetching ${entityName} by ID:`, error);
                    throw new Error(`Error al obtener ${entityName.toLowerCase()}`);
                }
            },

            getPaginated: async (page = 1, limit = 10, filters?: any) => {
                'use server';
                try {
                    const where = filters ? this.buildWhereClause(filters) : undefined;
                    const skip = (page - 1) * limit;

                    const [data, total] = await Promise.all([
                        prismaModel.findMany({
                            where,
                            skip,
                            take: limit,
                            ...defaultOptions,
                            orderBy: { createdAt: 'desc' },
                        }),
                        prismaModel.count({ where }),
                    ]);

                    return {
                        data,
                        pagination: {
                            page,
                            limit,
                            total,
                            pages: Math.ceil(total / limit),
                        },
                    };
                } catch (error) {
                    console.error(`Error fetching paginated ${entityName}:`, error);
                    throw new Error(`Error al obtener ${entityName.toLowerCase()}s paginados`);
                }
            },

            // CREATE Operation
            create: async (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> => {
                'use server';
                try {
                    const result = await prismaModel.create({
                        data: {
                            ...data,
                            // Auto-agregar timestamps si no están presentes
                            ...(PrismaSchemaParser.getModel(entityName)?.metadata
                                ?.hasTimestamps && {
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            }),
                        },
                        ...defaultOptions,
                    });

                    // Revalidar paths
                    this.revalidatePaths(options.revalidatePaths, entityLower);

                    return result;
                } catch (error) {
                    console.error(`Error creating ${entityName}:`, error);
                    throw new Error(`Error al crear ${entityName.toLowerCase()}`);
                }
            },

            // UPDATE Operation
            update: async (id: string, data: Partial<T>): Promise<T> => {
                'use server';
                try {
                    const result = await prismaModel.update({
                        where: { id },
                        data: {
                            ...data,
                            // Auto-actualizar timestamp
                            ...(PrismaSchemaParser.getModel(entityName)?.metadata
                                ?.hasTimestamps && {
                                updatedAt: new Date(),
                            }),
                        },
                        ...defaultOptions,
                    });

                    // Revalidar paths
                    this.revalidatePaths(options.revalidatePaths, entityLower);

                    return result;
                } catch (error) {
                    console.error(`Error updating ${entityName}:`, error);
                    throw new Error(`Error al actualizar ${entityName.toLowerCase()}`);
                }
            },

            // DELETE Operation
            delete: async (id: string): Promise<boolean> => {
                'use server';
                try {
                    const model = PrismaSchemaParser.getModel(entityName);

                    if (model?.metadata?.hasSoftDelete) {
                        // Soft delete
                        await prismaModel.update({
                            where: { id },
                            data: {
                                deletedAt: new Date(),
                                updatedAt: new Date(),
                            },
                        });
                    } else {
                        // Hard delete
                        await prismaModel.delete({
                            where: { id },
                        });
                    }

                    // Revalidar paths
                    this.revalidatePaths(options.revalidatePaths, entityLower);

                    return true;
                } catch (error) {
                    console.error(`Error deleting ${entityName}:`, error);
                    throw new Error(`Error al eliminar ${entityName.toLowerCase()}`);
                }
            },

            // BULK Operations
            bulkDelete: async (ids: string[]): Promise<number> => {
                'use server';
                try {
                    const result = await prismaModel.deleteMany({
                        where: {
                            id: {
                                in: ids,
                            },
                        },
                    });

                    // Revalidar paths
                    this.revalidatePaths(options.revalidatePaths, entityLower);

                    return result.count;
                } catch (error) {
                    console.error(`Error bulk deleting ${entityName}:`, error);
                    throw new Error(`Error al eliminar ${entityName.toLowerCase()}s`);
                }
            },

            bulkUpdate: async (ids: string[], data: Partial<T>): Promise<number> => {
                'use server';
                try {
                    const result = await prismaModel.updateMany({
                        where: {
                            id: {
                                in: ids,
                            },
                        },
                        data: {
                            ...data,
                            updatedAt: new Date(),
                        },
                    });

                    // Revalidar paths
                    this.revalidatePaths(options.revalidatePaths, entityLower);

                    return result.count;
                } catch (error) {
                    console.error(`Error bulk updating ${entityName}:`, error);
                    throw new Error(`Error al actualizar ${entityName.toLowerCase()}s`);
                }
            },
        };
    }

    /**
     * Construye cláusula WHERE para filtros
     */
    private static buildWhereClause(filters: Record<string, any>) {
        const where: any = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') return;

            if (typeof value === 'string') {
                // Búsqueda de texto
                where[key] = {
                    contains: value,
                    mode: 'insensitive',
                };
            } else if (typeof value === 'object' && value.from && value.to) {
                // Rango de fechas
                where[key] = {
                    gte: new Date(value.from),
                    lte: new Date(value.to),
                };
            } else {
                // Coincidencia exacta
                where[key] = value;
            }
        });

        return where;
    }

    /**
     * Revalida paths automáticamente
     */
    private static revalidatePaths(customPaths: string[] = [], entityLower: string) {
        const defaultPaths = ['/', `/${entityLower}`, `/dashboard`, `/dashboard/${entityLower}`];

        const allPaths = [...defaultPaths, ...customPaths];

        allPaths.forEach((path) => {
            try {
                revalidatePath(path);
            } catch (error) {
                console.warn(`Could not revalidate path: ${path}`);
            }
        });
    }
}

// Funciones de conveniencia para entidades específicas
export const createUserServerActions = () =>
    TableServerActionsFactory.createServerActions('User', {
        revalidatePaths: ['/users', '/dashboard/users'],
        include: {
            roles: {
                include: {
                    role: true,
                },
            },
        },
    });

export const createRoleServerActions = () =>
    TableServerActionsFactory.createServerActions('Role', {
        revalidatePaths: ['/roles', '/dashboard/roles'],
        include: {
            permissions: {
                include: {
                    permission: true,
                },
            },
        },
    });

export const createTicketServerActions = () =>
    TableServerActionsFactory.createServerActions('Ticket', {
        revalidatePaths: ['/tickets', '/dashboard/tickets'],
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                },
            },
            assignedTo: {
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                },
            },
        },
    });
