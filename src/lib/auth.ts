import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function verifyAuth(req: NextRequest) {
    return getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        //secureCookie: process.env.NODE_ENV === 'production',
        secureCookie: false,
    });
}
