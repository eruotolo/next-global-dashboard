import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { handlePrismaError } from '@/lib/errorHandler';

export async function GET() {
    try {
        const getUsers = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                lastName: true,
                birthdate: true,
                phone: true,
                address: true,
                city: true,
                image: true,
                state: true,
                roles: {
                    select: {
                        id: true,
                        userId: true,
                        roleId: true,
                        role: {
                            select: {
                                id: true,
                                name: true,
                                state: true,
                            },
                        },
                    },
                },
            },
        });
        return NextResponse.json({ getUsers }, { status: 200 });
    } catch (error) {
        return handlePrismaError(error, 'fetching users');
    }
}
