import { NextResponse, type NextRequest } from 'next/server';
import { isPublicPath, isStaticPath } from '@/lib/auth/publicPaths';
import { verifyAuth } from '@/lib/auth';
import { checkPageAccess } from '@/actions/Settings/Pages/queries';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Permitir rutas públicas y estáticas
    if (isPublicPath(pathname) || isStaticPath(pathname)) {
        return NextResponse.next();
    }

    // Verificar el token de autenticación
    const token = await verifyAuth(req);
    if (!token || !token.roles) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Permitir acceso al dashboard después del login
    if (pathname === '/admin/dashboard') {
        return NextResponse.next();
    }

    try {
        // Verificar permisos de página solo para rutas que no sean el dashboard
        const result = await checkPageAccess(pathname, token.roles as string[]);
        if (!result.hasAccess) {
            return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
        }
        return NextResponse.next();
    } catch (error) {
        console.error('Error checking page access:', error);
        return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
    }
}

// Configurar las rutas que deben pasar por el middleware
export const config = {
    matcher: ['/((?!api/uploadthing|_next/static|_next/image|favicon.ico).*)'],
};
