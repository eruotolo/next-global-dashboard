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