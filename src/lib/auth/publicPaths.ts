// Rutas públicas que no requieren autenticación
export const publicPaths = [
    '/',
    '/login',
    '/recovery',
    '/manifiesto',
    '/somos',
    '/impresos',
    '/blogs',
];

// Rutas de API públicas (usar RegExp para patrones)
export const publicApiPaths = [
    /^\/api\/auth\/.*/, // Todas las rutas bajo /api/auth/
];

// Rutas estáticas (assets, imágenes, etc.)
export const staticPaths = [
    /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/,
    /\.(?:css|js)$/,
    /\/api\/uploadthing/,
    /\/_next\//,
];

// Función helper para verificar si una ruta es estática
export const isStaticPath = (pathname: string): boolean => {
    return staticPaths.some((path) =>
        path instanceof RegExp ? path.test(pathname) : pathname.startsWith(path),
    );
};

// Función helper para verificar si una ruta es pública
export const isPublicPath = (pathname: string): boolean => {
    // Verificar rutas públicas exactas
    if (publicPaths.includes(pathname)) {
        return true;
    }

    // Verificar rutas dinámicas de blogs (ej: /blogs/slug-del-blog)
    if (pathname.startsWith('/blogs/')) {
        return true;
    }

    // Verificar patrones de API públicos
    return publicApiPaths.some((pattern) => pattern.test(pathname));
};

/* 
  EJEMPLO: Para habilitar rutas dinámicas públicas en el futuro:

  export const isPublicPath = (pathname: string): boolean => {
      // Lista de prefijos públicos para rutas dinámicas
      const publicPrefixes = ['/blog/', '/news/'];
      
      // Verificar rutas exactas primero
      if (publicPaths.includes(pathname)) {
          return true;
      }

      // Verificar prefijos para rutas dinámicas
      if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) {
          return true;
      }
      
      // Verificar otras rutas públicas que empiezan con paths definidos
      return publicPaths.some(path => pathname.startsWith(path));
  }
*/
