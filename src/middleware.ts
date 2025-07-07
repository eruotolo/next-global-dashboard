import { type NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { isPublicPath, isStaticPath } from '@/lib/auth/publicPaths';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // console.log('Middleware - Checking path:', pathname);
    // console.log('Middleware - Is public path:', isPublicPath(pathname));
    // console.log('Middleware - Is static path:', isStaticPath(pathname));

    // Permitir rutas públicas y estáticas
    if (isPublicPath(pathname) || isStaticPath(pathname)) {
        return NextResponse.next();
    }

    // Verificar el token de autenticación
    const token = await verifyAuth(req);
    if (!token || !token.roles) {
        // console.log('Middleware - No token or roles found');
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // console.log('Middleware - User roles:', token.roles);

    // Permitir acceso al dashboard después del login
    if (pathname === '/admin/dashboard') {
        return NextResponse.next();
    }

    // Permitir el acceso y dejar que el ProtectedRoute maneje la verificación de permisos
    return NextResponse.next();
}

// Configurar las rutas que deben pasar por el middleware
export const config = {
    matcher: ['/((?!api/uploadthing|_next/static|_next/image|favicon.ico).*)'],
};
