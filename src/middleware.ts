import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import routeRoles from '@/lib/navigation/routeRoles';

interface UserToken {
    roles?: string[];
}

const publicPaths = ['/', '/login', '/api/auth', '/recovery'];

const checkAccess = (userRoles: string[], allowedRoles: string[]): boolean =>
    userRoles.some((role) => allowedRoles.includes(role));

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(pathname) ||
        pathname.startsWith('/_next/') ||
        pathname.includes('favicon.ico')
    ) {
        return NextResponse.next();
    }

    if (publicPaths.includes(pathname) || pathname.startsWith('/api/auth/')) {
        return NextResponse.next();
    }

    const token = (await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        //secureCookie: process.env.NODE_ENV === 'production',
        secureCookie: false,
    })) as UserToken | null;
    //console.log('Token en middleware:', token);

    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (token && pathname === '/login') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    let matchedRoute = null;
    let matchedRoles: string[] | null = null;
    for (const [route, roles] of Object.entries(routeRoles)) {
        if (pathname.startsWith(route)) {
            if (!matchedRoute || route.length > matchedRoute.length) {
                matchedRoute = route;
                matchedRoles = roles;
            }
        }
    }

    if (matchedRoute && matchedRoles) {
        const userRoles = token.roles ?? [];
        if (!checkAccess(userRoles, matchedRoles)) {
            return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
        }
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
