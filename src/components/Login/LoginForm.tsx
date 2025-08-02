'use client';

import type React from 'react';
import { useState } from 'react';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { zodResolver } from '@hookform/resolvers/zod';

import { TextField } from '@/components/Form';
import { FormStateProvider } from '@/components/Form/FormProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { type LoginFormData, LoginSchema } from './loginSchema';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [formState, setFormState] = useState({
        isSubmitting: false,
        errors: {},
        success: false,
    });

    const form = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            const res = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
                callbackUrl: '/admin/dashboard',
            });

            if (res?.error) {
                let errorMessage = 'Ha ocurrido un error durante el inicio de sesión';

                if (res.error === 'No users found') {
                    errorMessage = 'Usuario no encontrado';
                } else if (res.error === 'Wrong Password') {
                    errorMessage = 'Contraseña incorrecta';
                } else if (res.error === 'El usuario no tiene roles asignados') {
                    errorMessage = 'El usuario no tiene roles asignados';
                }

                toast.error('Error al iniciar sesión', {
                    description: errorMessage,
                });
                return;
            }

            if (res?.ok) {
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
                    <FormProvider {...form}>
                        <FormStateProvider state={formState}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <TextField
                                    name="email"
                                    label="Email"
                                    placeholder="m@example.com"
                                    type="email"
                                    required
                                />

                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <label
                                            htmlFor="password"
                                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 after:ml-0.5 after:text-red-500 after:content-['*']"
                                        >
                                            Password
                                        </label>
                                        <Link
                                            href="/recovery"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    </div>
                                    <TextField
                                        name="password"
                                        label=""
                                        type="password"
                                        required
                                        showPasswordToggle
                                        className="[&>label]:sr-only"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full cursor-pointer"
                                >
                                    {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                                </Button>
                            </form>
                        </FormStateProvider>
                    </FormProvider>
                </CardContent>
            </Card>
            <div className="text-muted-foreground [&_a]:hover:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
                By clicking continue, you agree to our <a href="/oyto">Terms of Service</a> and{' '}
                <Link href="#">Privacy Policy</Link>.
            </div>
        </div>
    );
}
