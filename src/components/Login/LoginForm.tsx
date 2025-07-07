'use client';

import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import type React from 'react';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { LoginFormInputs } from '@/types/settings/Login/LoginFormInputs';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const [isPasswordHidden, setPasswordHidden] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    });

    const router = useRouter();

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
                callbackUrl: '/admin/dashboard',
            });

            if (res?.error) {
                toast.error('Error al iniciar sesión', {
                    description:
                        res.error === 'No users found'
                            ? 'Usuario no encontrado'
                            : res.error === 'Wrong Password'
                              ? 'Contraseña incorrecta'
                              : 'Ha ocurrido un error durante el inicio de sesión',
                });
            } else if (res?.ok) {
                toast.success('Inicio de sesión exitoso', {
                    description: 'Has iniciado sesión correctamente.',
                });

                // Forzar recarga de la página para asegurar la actualización de estado de autenticación
                window.location.href = '/admin/dashboard';
            }
        } catch (error) {
            console.error('Error inesperado en LoginForm:', error);
            toast.error('Error inesperado', {
                description: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.',
            });
            setError('Ha ocurrido un error inesperado. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-inter text-[25px] leading-[25px] font-normal">
                        Bienvenido de nuevo
                    </CardTitle>
                    <CardDescription className="font-inter text-[14px] leading-[14px] font-normal">
                        Inicia sesión para continuar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register('email', {
                                        required: 'El correo electrónico es requerido',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Dirección de email inválida',
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-destructive text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/recovery"
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={isPasswordHidden ? 'password' : 'text'}
                                        {...register('password', {
                                            required: 'La contraseña es requerida',
                                        })}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center"
                                        onClick={() => setPasswordHidden(!isPasswordHidden)}
                                    >
                                        {isPasswordHidden ? (
                                            <Eye className="h-4 w-4 cursor-pointer text-gray-400" />
                                        ) : (
                                            <EyeOff className="h-4 w-4 cursor-pointer text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-destructive text-sm">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full cursor-pointer"
                            >
                                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground [&_a]:hover:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
                By clicking continue, you agree to our <a href="/oyto">Terms of Service</a> and{' '}
                <Link href="#">Privacy Policy</Link>.
            </div>
        </div>
    );
}
