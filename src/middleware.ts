import { NextResponse, type NextRequest } from 'next/server';
import { isPublicPath, isStaticPath } from '@/config/routes';
import { verifyAuth } from '@/lib/auth';
import { checkPageAccess } from '@/actions/Pages/queries';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Permitir rutas públicas y estáticas
    if (isPublicPath(pathname) || isStaticPath(pathname)) {
        return NextResponse.next();
    }

    // Verificar el token de autenticación
    const token = await verifyAuth(req);
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Si estamos en la ruta del dashboard y acabamos de iniciar sesión, permitir el acceso
    if (pathname === '/admin/dashboard' && req.headers.get('referer')?.includes('/login')) {
        return NextResponse.next();
    }

    try {
        // Verificar permisos de página
        const result = await checkPageAccess(pathname, token.roles as string[]);
        if (!result.hasAccess) {
            return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
        }
    } catch (error) {
        console.error('Error checking page access:', error);
        return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
    }

    return NextResponse.next();
}

// Configurar las rutas que deben pasar por el middleware
export const config = {
    matcher: ['/((?!api/uploadthing|_next/static|_next/image|favicon.ico).*)'],
};
