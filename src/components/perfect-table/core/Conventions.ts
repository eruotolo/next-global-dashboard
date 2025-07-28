import type { ColumnType } from '../types/TableConfig';

export const INTELLIGENT_CONVENTIONS = {
    hiddenFields: ['id', 'password', 'createdAt', 'updatedAt', 'state'],

    fieldTypeMapping: {
        email: 'email' as ColumnType,
        correo: 'email' as ColumnType,
        mail: 'email' as ColumnType,
        phone: 'phone' as ColumnType,
        telefono: 'phone' as ColumnType,
        tel: 'phone' as ColumnType,
        image: 'image' as ColumnType,
        imagen: 'image' as ColumnType,
        avatar: 'image' as ColumnType,
        photo: 'image' as ColumnType,
        date: 'date' as ColumnType,
        fecha: 'date' as ColumnType,
        birthdate: 'date' as ColumnType,
        birthday: 'date' as ColumnType,
        createdAt: 'date' as ColumnType,
        updatedAt: 'date' as ColumnType,
        active: 'boolean' as ColumnType,
        enabled: 'boolean' as ColumnType,
        verified: 'boolean' as ColumnType,
        status: 'badge' as ColumnType,
        estado: 'badge' as ColumnType,
        priority: 'badge' as ColumnType,
        prioridad: 'badge' as ColumnType,
        state: 'badge' as ColumnType,
        name: 'text' as ColumnType,
        nombre: 'text' as ColumnType,
        title: 'text' as ColumnType,
        titulo: 'text' as ColumnType,
        roles: 'badge' as ColumnType,
        permissions: 'badge' as ColumnType,
        permisos: 'badge' as ColumnType,
    },

    badgeColorMaps: {
        status: {
            OPEN: 'green',
            IN_PROGRESS: 'yellow',
            RESOLVED: 'blue',
            CLOSED: 'gray',
            ACTIVE: 'green',
            INACTIVE: 'gray',
        },
        priority: {
            LOW: 'green',
            MEDIUM: 'yellow',
            HIGH: 'orange',
            URGENT: 'red',
        },
        state: {
            '1': 'green',
            '0': 'gray',
        },
    },

    headerTranslations: {
        id: 'ID',
        name: 'Nombre',
        lastName: 'Apellido',
        fullName: 'Nombre Completo',
        email: 'Email',
        phone: 'Teléfono',
        birthdate: 'Fecha de Nacimiento',
        address: 'Dirección',
        city: 'Ciudad',
        image: 'Imagen',
        status: 'Estado',
        priority: 'Prioridad',
        state: 'Estado',
        createdAt: 'Fecha de Creación',
        updatedAt: 'Última Actualización',
        roles: 'Roles',
        permissions: 'Permisos',
        title: 'Título',
        code: 'Código',
        userName: 'Usuario',
        userLastName: 'Apellido Usuario',
    },

    dataSourceDetection: {
        zustandStores: {
            User: 'useUserRoleStore',
            Role: 'useUserRoleStore',
            Analytics: 'useAnalyticsStore',
        },

        serverActions: {
            User: 'getAllUsers',
            Role: 'getAllRoles',
            Ticket: 'getAllTickets',
            Permission: 'getAllPermissions',
        },
    },

    defaultActions: {
        all: ['view', 'edit', 'delete'],
        readonly: ['view'],
        minimal: ['edit', 'delete'],
    },

    permissionMapping: {
        view: ['Ver'],
        edit: ['Editar'],
        delete: ['Eliminar'],
        create: ['Crear'],
    },
};

export class ConventionApplier {
    static inferColumnType(fieldName: string, fieldType?: string): ColumnType {
        const nameMapping =
            INTELLIGENT_CONVENTIONS.fieldTypeMapping[
                fieldName.toLowerCase() as keyof typeof INTELLIGENT_CONVENTIONS.fieldTypeMapping
            ];
        if (nameMapping) return nameMapping;

        if (fieldName.toLowerCase().includes('email')) return 'email';
        if (fieldName.toLowerCase().includes('phone') || fieldName.toLowerCase().includes('tel'))
            return 'phone';
        if (fieldName.toLowerCase().includes('image') || fieldName.toLowerCase().includes('photo'))
            return 'image';
        if (fieldName.toLowerCase().includes('date')) return 'date';
        if (
            fieldName.toLowerCase().includes('status') ||
            fieldName.toLowerCase().includes('estado')
        )
            return 'badge';
        if (
            fieldName.toLowerCase().includes('priority') ||
            fieldName.toLowerCase().includes('prioridad')
        )
            return 'badge';

        if (fieldType) {
            switch (fieldType.toLowerCase()) {
                case 'string':
                    return 'text';
                case 'number':
                case 'int':
                case 'integer':
                    return 'number';
                case 'boolean':
                    return 'boolean';
                case 'date':
                case 'datetime':
                    return 'date';
                default:
                    return 'text';
            }
        }

        return 'text';
    }

    static generateHeader(fieldName: string): string {
        const translation =
            INTELLIGENT_CONVENTIONS.headerTranslations[
                fieldName as keyof typeof INTELLIGENT_CONVENTIONS.headerTranslations
            ];
        if (translation) return translation;

        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    }

    static shouldHideField(fieldName: string): boolean {
        return INTELLIGENT_CONVENTIONS.hiddenFields.includes(fieldName);
    }

    static getBadgeColorMap(fieldName: string): Record<string, string> | undefined {
        const lowerFieldName = fieldName.toLowerCase();

        if (lowerFieldName.includes('status') || lowerFieldName.includes('estado')) {
            return INTELLIGENT_CONVENTIONS.badgeColorMaps.status;
        }

        if (lowerFieldName.includes('priority') || lowerFieldName.includes('prioridad')) {
            return INTELLIGENT_CONVENTIONS.badgeColorMaps.priority;
        }

        if (lowerFieldName === 'state') {
            return INTELLIGENT_CONVENTIONS.badgeColorMaps.state;
        }

        return undefined;
    }

    static detectDataSource(entity: string): { type: string; config: any } {
        const zustandStore =
            INTELLIGENT_CONVENTIONS.dataSourceDetection.zustandStores[
                entity as keyof typeof INTELLIGENT_CONVENTIONS.dataSourceDetection.zustandStores
            ];
        if (zustandStore) {
            return {
                type: 'zustand',
                config: { store: zustandStore },
            };
        }

        const serverAction =
            INTELLIGENT_CONVENTIONS.dataSourceDetection.serverActions[
                entity as keyof typeof INTELLIGENT_CONVENTIONS.dataSourceDetection.serverActions
            ];
        if (serverAction) {
            return {
                type: 'server-action',
                config: { action: serverAction },
            };
        }

        return {
            type: 'local',
            config: {},
        };
    }

    static getDefaultActions(userPermissions: string[] = []): string[] {
        return INTELLIGENT_CONVENTIONS.defaultActions.all;
    }
}
