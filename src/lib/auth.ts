import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function verifyAuth(req: NextRequest) {
    return getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === 'production',
    });
}
