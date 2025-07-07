'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="bg-background flex min-h-[85vh] flex-col items-center justify-center">
            <div className="space-y-6 text-center">
                <h1 className="text-primary text-4xl font-bold">Acceso No Autorizado</h1>
                <p className="text-muted-foreground text-lg">
                    No tienes los permisos necesarios para acceder a esta página.
                </p>
                <div className="space-x-4">
                    <Button onClick={() => router.back()} variant="outline">
                        Volver
                    </Button>
                    <Button onClick={() => router.push('/admin/dashboard')}>Ir al Dashboard</Button>
                </div>
            </div>
        </div>
    );
}
