// Definimos un objeto con todas las acciones posibles
export const AUDIT_ACTIONS = {
    LOGIN: {
        SUCCESS: 'loginSuccess',
        FAILED: 'loginFailed',
        LOGOUT: 'logout',
    },
    ROLE: {
        CREATE: 'createRole',
        UPDATE: 'updateRole',
        DELETE: 'deleteRole',
    },
    PERMISSIONS: {
        UPDATE: 'updatePermissions',
    },
    USER: {
        CREATE: 'createUser',
        UPDATE: 'updateUser',
        DELETE: 'deleteUser',
        ASSIGN_ROLE: 'assignRoleUser',
        REMOVE_ROLE: 'removeRoleUser',
    },
    PAGE: {
        CREATE: 'createPage',
        UPDATE: 'updatePage',
        DELETE: 'deletePage',
        UPDATE_PERMISSIONS: 'updatePagePermissions',
    },
    TICKET: {
        CREATE: 'createTicket',
        UPDATE: 'updateTicket',
        DELETE: 'deleteTicket',
    },
    COUNTRY: {
        CREATE: 'createCountry',
        UPDATE: 'updateCountry',
        DELETE: 'deleteCountry',
    },
    CITY: {
        CREATE: 'createCity',
        UPDATE: 'updateCity',
        DELETE: 'deleteCity',
    },
    AIRPORTS: {
        CREATE: 'createAirport',
        UPDATE: 'updateAirport',
        DELETE: 'deleteAirport',
    },
    SHIPPINGPORT: {
        CREATE: 'createShippingPort',
        UPDATE: 'updateShippingPort',
        DELETE: 'deleteShippingPort',
    },
    COMMODITIESSECTIONS: {
        CREATE: 'createCommoditySection',
        UPDATE: 'updateCommoditySection',
        DELETE: 'deleteCommoditySection',
    },
} as const;

// Definimos un objeto con todas las entidades
export const AUDIT_ENTITIES = {
    USER: 'User',
    ROLE: 'Role',
    PERMISSION: 'Permission',
    PAGE: 'Page',
    TICKET: 'Ticket',
    SYSTEM: 'System',
    COUNTRY: 'Country',
    CITY: 'City',
    AIRPORTS: 'Airports',
    SHIPPINGPORT: 'ShippingPort',
    COMMODITIESSECTIONS: 'CommoditySection',
} as const;

// Tipos derivados de los objetos
type ValueOf<T> = T[keyof T];
type Values<T> = T extends { [K in keyof T]: infer U } ? U : never;
export type AuditAction = Values<ValueOf<typeof AUDIT_ACTIONS>>;
export type AuditEntity = ValueOf<typeof AUDIT_ENTITIES>;

// Arrays derivados de los objetos
export const actionTypesForFilter = Object.values(AUDIT_ACTIONS).flatMap((group) =>
    Object.values(group),
) as AuditAction[];

export const entityTypesForFilter = Object.values(AUDIT_ENTITIES) as AuditEntity[];
