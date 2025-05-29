import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/db';

export async function POST(req: NextRequest) {
    try {
        const { path, roles } = await req.json();

        if (!path || !roles || !Array.isArray(roles)) {
            return NextResponse.json({ hasAccess: false }, { status: 400 });
        }

        const page = await prisma.page.findFirst({
            where: {
                path,
                state: 1,
            },
            include: {
                pageRoles: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        if (!page) {
            return NextResponse.json({ hasAccess: true });
        }

        const allowedRoles = page.pageRoles.map(pr => pr.role?.name).filter(Boolean) as string[];
        const hasAccess = roles.some(role => allowedRoles.includes(role));

        return NextResponse.json({ hasAccess });
    } catch (error) {
        console.error('Error checking page access:', error);
        return NextResponse.json({ hasAccess: false }, { status: 500 });
    }
} 