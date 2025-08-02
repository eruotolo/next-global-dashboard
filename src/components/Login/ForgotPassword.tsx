'use client';

import Link from 'next/link';
import { toast } from 'sonner';

import { Form, TextField } from '@/components/Form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { recoverPasswordAction } from '@/lib/auth/password/recoveryAdapter';

import { ForgotPasswordSchema } from './loginSchema';

export function ForgotPassword() {
    const handleSuccess = () => {
        toast.success('Contraseña enviada exitosamente', {
            description: 'Revisa tu email para obtener la nueva contraseña temporal.',
            duration: 5000,
        });
    };

    const handleError = (error: string) => {
        toast.error('Error al recuperar contraseña', {
            description: error,
            duration: 5000,
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-inter text-[25px] leading-[25px] font-normal">
                        Restaurar su cuenta.
                    </CardTitle>
                    <CardDescription className="font-inter text-[14px] leading-[14px] font-normal">
                        Ingresa su correo electrónico para restaurar su cuenta.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form
                        schema={ForgotPasswordSchema}
                        action={recoverPasswordAction}
                        onSuccess={handleSuccess}
                        onError={handleError}
                        submitText="Recuperar Contraseña"
                        className="space-y-6"
                    >
                        <TextField
                            name="email"
                            label="Email"
                            placeholder="m@example.com"
                            type="email"
                            required
                        />
                    </Form>

                    <div className="after:border-border relative mt-6 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-background text-muted-foreground relative z-10 px-2">
                            ¿Ya sos cliente?{' '}
                            <Link href="/login" className="ml-[5px] underline underline-offset-4">
                                Ingresar
                            </Link>
                        </span>
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground hover:[&_a]:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
                By clicking continue, you agree to our <a href="/terms">Terms of Service</a> and{' '}
                <a href="/politics">Privacy Policy</a>.
            </div>
        </div>
    );
}
