import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicPaths = ['/', '/login', '/api/auth', '/recovery'];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Permitir recursos estáticos
    if (
        /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(pathname) ||
        pathname.startsWith('/_next/') ||
        pathname.includes('favicon.ico')
    ) {
        return NextResponse.next();
    }

    // Permitir rutas públicas
    if (publicPaths.includes(pathname) || pathname.startsWith('/api/auth/')) {
        return NextResponse.next();
    }

    // Verificar autenticación
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: false,
    });

    // Si no hay token, redirigir al inicio
    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Si hay token y se intenta acceder a login, redirigir al dashboard
    if (token && pathname === '/login') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
        '/admin/:path*',
        '/admin/dashboard/:path*',
        '/admin/settings/:path*',
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
};
