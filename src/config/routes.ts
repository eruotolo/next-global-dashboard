export interface RouteConfig {
    roles?: string[];
    permissions?: string[];
}

export const routeConfigs: Record<string, RouteConfig> = {
    // Rutas del Dashboard
    '/admin/dashboard': {
        roles: ['Usuario', 'Administrador', 'SuperAdministrador', 'Colaborador', 'Editor'],
    },

    // Rutas de Configuración
    '/admin/settings/users': {
        roles: ['Administrador', 'SuperAdministrador'],
        permissions: ['manage_users'],
    },
    '/admin/settings/roles': {
        roles: ['SuperAdministrador'],
        permissions: ['manage_roles'],
    },

    // Rutas de Perfil
    '/admin/profile': {
        roles: ['Usuario', 'Administrador', 'SuperAdministrador', 'Colaborador', 'Editor'],
    },

    // Agrega aquí más configuraciones de rutas según necesites
};

// Rutas públicas que no requieren autenticación
export const publicPaths = ['/', '/login', '/api/auth', '/recovery'];

// Rutas estáticas (assets, imágenes, etc.)
export const staticPaths = [
    /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/,
    /\.(?:css|js)$/,
    /\/api\/uploadthing/,
    /\/_next\//,
];

// Función helper para verificar si una ruta es estática
export const isStaticPath = (pathname: string): boolean => {
    return staticPaths.some(path => 
        path instanceof RegExp 
            ? path.test(pathname)
            : pathname.startsWith(path)
    );
};

// Función helper para verificar si una ruta es pública
export const isPublicPath = (pathname: string): boolean => {
    return publicPaths.some(path => pathname === path || pathname.startsWith(path));
};

// Función helper para obtener la configuración de una ruta
export const getRouteConfig = (pathname: string): RouteConfig | undefined => {
    return routeConfigs[pathname];
}; 