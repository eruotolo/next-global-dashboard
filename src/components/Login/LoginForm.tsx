'use client';

import type React from 'react';

import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { LoginFormInputs } from '@/tipos/Login/LoginFormInputs';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const [isPasswordHidden, setPasswordHidden] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                toast.success('Inicio de sesión exitoso', {
                    description: 'Has iniciado sesión correctamente.',
                });
                router.push('/admin/dashboard');
            }
        } catch (error) {
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
                    <CardTitle className="font-normal font-inter text-[25px] leading-[25px]">
                        Bienvenido de nuevo
                    </CardTitle>
                    <CardDescription className="font-normal font-inter text-[14px] leading-[14px]">
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
                                    <p className="text-sm text-destructive">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/recovery"
                                        className="ml-auto text-sm hover:underline underline-offset-4"
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
                                        className="flex absolute inset-y-0 right-3 items-center"
                                        onClick={() => setPasswordHidden(!isPasswordHidden)}
                                    >
                                        {isPasswordHidden ? (
                                            <Eye className="w-4 h-4 text-gray-400 cursor-pointer" />
                                        ) : (
                                            <EyeOff className="w-4 h-4 text-gray-400 cursor-pointer" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive">
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
