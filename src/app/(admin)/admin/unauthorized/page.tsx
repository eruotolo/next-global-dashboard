'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] bg-background">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold text-primary">Acceso No Autorizado</h1>
                <p className="text-lg text-muted-foreground">
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
