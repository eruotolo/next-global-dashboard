'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-md text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-destructive mb-6" />
        <h1 className="text-3xl font-bold tracking-tight mb-2">Acceso Denegado</h1>
        <p className="text-muted-foreground mb-6">
          No tienes los permisos necesarios para acceder a esta página.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/admin/dashboard')}>
            Ir al Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}