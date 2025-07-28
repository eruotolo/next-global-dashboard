interface PrismaField {
    name: string;
    type: string;
    isOptional: boolean;
    isUnique: boolean;
    isId: boolean;
    relation?: string;
    attributes?: string[];
}

interface PrismaModel {
    name: string;
    fields: PrismaField[];
    relations: Array<{
        name: string;
        type: string;
        relationName?: string;
    }>;
}

// Simulación del schema de Prisma basado en convenciones comunes
const PRISMA_SCHEMA_SIMULATION: Record<string, PrismaModel> = {
    User: {
        name: 'User',
        fields: [
            { name: 'id', type: 'String', isOptional: false, isUnique: true, isId: true },
            { name: 'name', type: 'String', isOptional: false, isUnique: false, isId: false },
            { name: 'lastName', type: 'String', isOptional: false, isUnique: false, isId: false },
            { name: 'email', type: 'String', isOptional: false, isUnique: true, isId: false },
            { name: 'phone', type: 'String', isOptional: true, isUnique: false, isId: false },
            { name: 'birthdate', type: 'DateTime', isOptional: true, isUnique: false, isId: false },
            { name: 'address', type: 'String', isOptional: true, isUnique: false, isId: false },
            { name: 'city', type: 'String', isOptional: true, isUnique: false, isId: false },
            { name: 'image', type: 'String', isOptional: true, isUnique: false, isId: false },
            { name: 'state', type: 'Int', isOptional: true, isUnique: false, isId: false },
            {
                name: 'createdAt',
                type: 'DateTime',
                isOptional: false,
                isUnique: false,
                isId: false,
            },
            {
                name: 'updatedAt',
                type: 'DateTime',
                isOptional: false,
                isUnique: false,
                isId: false,
            },
        ],
        relations: [
            { name: 'roles', type: 'UserRole[]' },
            { name: 'tickets', type: 'Ticket[]' },
        ],
    },
    Role: {
        name: 'Role',
        fields: [
            { name: 'id', type: 'String', isOptional: false, isUnique: true, isId: true },
            { name: 'name', type: 'String', isOptional: false, isUnique: true, isId: false },
            { name: 'description', type: 'String', isOptional: true, isUnique: false, isId: false },
            { name: 'state', type: 'Int', isOptional: true, isUnique: false, isId: false },
            {
                name: 'createdAt',
                type: 'DateTime',
                isOptional: false,
                isUnique: false,
                isId: false,
            },
            {
                name: 'updatedAt',
                type: 'DateTime',
                isOptional: false,
                isUnique: false,
                isId: false,
            },
        ],
        relations: [
            { name: 'users', type: 'UserRole[]' },
            { name: 'permissions', type: 'PermissionRole[]' },
        ],
    },
    Ticket: {
        name: 'Ticket',
        fields: [
            { name: 'id', type: 'String', isOptional: false, isUnique: true, isId: true },
            { name: 'code', type: 'String', isOptional: false, isUnique: true, isId: false },
            { name: 'title', type: 'String', isOptional: false, isUnique: false, isId: false },
            { name: 'description', type: 'String', isOptional: true, isUnique: false, isId: false },
            {
                name: 'status',
                type: 'TicketStatus',
                isOptional: false,
                isUnique: false,
                isId: false,
            },
            {
                name: 'priority',
                type: 'TicketPriority',
                isOptional: false,
                isUnique: false,
                isId: false,
            },
            { name: 'userId', type: 'String', isOptional: true, isUnique: false, isId: false },
            {
                name: 'assignedToId',
                type: 'String',
                isOptional: true,
                isUnique: false,
                isId: false,
            },
            {
                name: 'createdAt',
                type: 'DateTime',
                isOptional: false,
                isUnique: false,
                isId: false,
            },
            {
                name: 'updatedAt',
                type: 'DateTime',
                isOptional: false,
                isUnique: false,
                isId: false,
            },
        ],
        relations: [
            { name: 'user', type: 'User' },
            { name: 'assignedTo', type: 'User' },
        ],
    },
};

export class PrismaSchemaParser {
    static getModel(entityName: string): PrismaModel | null {
        return PRISMA_SCHEMA_SIMULATION[entityName] || null;
    }

    static generateTableConfig(entityName: string) {
        const model = this.getModel(entityName);

        if (!model) {
            console.warn(`Modelo ${entityName} no encontrado en el schema de Prisma`);
            return {
                fields: [],
                relations: [],
                specialColumns: [],
            };
        }

        const visibleFields = model.fields.filter(
            (field) =>
                !['id', 'createdAt', 'updatedAt'].includes(field.name) &&
                !field.name.endsWith('Id'),
        );

        const specialColumns: string[] = [];

        if (
            model.fields.some((f) => f.name === 'name') &&
            model.fields.some((f) => f.name === 'lastName')
        ) {
            specialColumns.push('fullName');
        }

        model.relations.forEach((relation) => {
            if (['roles', 'permissions'].includes(relation.name)) {
                specialColumns.push(relation.name);
            }
        });

        return {
            entity: entityName,
            fields: visibleFields.map((field) => ({
                name: field.name,
                type: this.mapPrismaTypeToColumnType(field.type),
                required: !field.isOptional,
                unique: field.isUnique,
                isPrimaryKey: field.isId,
            })),
            relations: model.relations,
            specialColumns,
            metadata: {
                hasTimestamps: model.fields.some((f) => f.name === 'createdAt'),
                hasSoftDelete: model.fields.some((f) => f.name === 'deletedAt'),
                hasState: model.fields.some((f) => f.name === 'state'),
            },
        };
    }

    private static mapPrismaTypeToColumnType(prismaType: string): string {
        const typeMap: Record<string, string> = {
            String: 'text',
            Int: 'number',
            Float: 'number',
            Boolean: 'boolean',
            DateTime: 'date',
            Json: 'text',
            TicketStatus: 'badge',
            TicketPriority: 'badge',
            UserRole: 'badge',
        };

        return typeMap[prismaType] || 'text';
    }

    static getAutoIncludes(entityName: string): Record<string, any> {
        const model = this.getModel(entityName);
        if (!model) return {};

        const includes: Record<string, any> = {};

        model.relations.forEach((relation) => {
            if (['roles', 'permissions', 'user', 'assignedTo'].includes(relation.name)) {
                if (relation.type.includes('[]')) {
                    includes[relation.name] = {
                        include: this.getNestedIncludes(relation.name),
                    };
                } else {
                    includes[relation.name] = true;
                }
            }
        });

        return Object.keys(includes).length > 0 ? { include: includes } : {};
    }

    private static getNestedIncludes(relationName: string): any {
        const nestedIncludes: Record<string, any> = {
            roles: {
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            permissions: {
                permission: {
                    select: {
                        id: true,
                        name: true,
                        module: true,
                    },
                },
            },
        };

        return nestedIncludes[relationName] || true;
    }
}
