import { NextResponse } from 'next/server';

export function handlePrismaError(error: any, operation: string) {
    // Log the error with details for server-side debugging
    console.error(`Error during ${operation}:`, {
        message: error.message,
        stack: error.stack,
        name: error.name,
    });

    // Check if it's a Prisma error
    if (error.name === 'PrismaClientKnownRequestError') {
        // Handle Prisma specific errors
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Database constraint violation', details: error.meta },
                { status: 409 },
            );
        }
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Record not found', details: error.meta },
                { status: 404 },
            );
        }
        if (error.code.startsWith('P1')) {
            // P1xxx errors are query engine errors
            return NextResponse.json(
                { error: 'Database query error', code: error.code },
                { status: 500 },
            );
        }
    } else if (error.name === 'PrismaClientValidationError') {
        // Handle validation errors
        return NextResponse.json(
            { error: 'Invalid query parameters', message: error.message },
            { status: 400 },
        );
    } else if (error.name === 'PrismaClientInitializationError') {
        // Handle database connection errors
        console.error('Critical database connection error:', error);
        return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
    } else if (error.name === 'PrismaClientRustPanicError') {
        // Handle critical Prisma errors
        console.error('Critical Prisma error:', error);
        return NextResponse.json({ error: 'A critical database error occurred' }, { status: 500 });
    }

    // Default error response for unhandled error types
    return NextResponse.json(
        {
            error: `An unexpected error occurred during ${operation}`,
            requestId: crypto.randomUUID(), // Add a unique ID to track this error in logs
        },
        { status: 500 },
    );
}
