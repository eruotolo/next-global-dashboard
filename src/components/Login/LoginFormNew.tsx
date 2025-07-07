'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { LoginFormInputs } from '@/types/settings/Login/LoginFormInputs';

// Importar nuestros nuevos componentes
import { FormWrapper, useFormContext } from '@/components/forms';

export function LoginFormNew({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  // Función personalizada para manejar login (no es Server Action estándar)
  const handleLogin = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/admin/dashboard',
      });

      if (res?.error) {
        const errorMessage = res.error === 'No users found'
          ? 'Usuario no encontrado'
          : res.error === 'Wrong Password'
            ? 'Contraseña incorrecta'
            : 'Ha ocurrido un error durante el inicio de sesión';
        
        throw new Error(errorMessage);
      }

      if (res?.ok) {
        // Forzar recarga de la página para asegurar la actualización de estado de autenticación
        window.location.href = '/admin/dashboard';
        
        return { message: 'Inicio de sesión exitoso' };
      }

      throw new Error('Error desconocido durante el inicio de sesión');
    } catch (error) {
      console.error('Error inesperado en LoginForm:', error);
      throw error;
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
          <FormWrapper<LoginFormInputs>
            defaultValues={{ email: '', password: '' }}
            onSubmit={handleLogin}
            onSuccess={() => {}} // No mostrar toast aquí, se maneja automáticamente
            onError={() => {}} // No mostrar toast aquí, se maneja automáticamente
            mode="onSubmit"
          >
            <div className="grid gap-6">
              {/* Campo de Email - Diseño idéntico al original */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <EmailInput />
              </div>
              
              {/* Campo de Password - Diseño idéntico al original */}
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
                <PasswordInput />
              </div>

              {/* Botón de Submit - Diseño idéntico al original */}
              <SubmitButtonCustom />
            </div>
          </FormWrapper>
        </CardContent>
      </Card>
      <div className="text-muted-foreground [&_a]:hover:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        By clicking continue, you agree to our <a href="/oyto">Terms of Service</a> and{' '}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}

// Componente personalizado para el input de email con diseño idéntico
function EmailInput() {
  const { form } = useFormContext();
  const { register, formState: { errors } } = form;

  return (
    <>
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
          {errors.email.message as string}
        </p>
      )}
    </>
  );
}

// Componente personalizado para el input de password con diseño idéntico
function PasswordInput() {
  const { form } = useFormContext();
  const { register, formState: { errors } } = form;
  const [isPasswordHidden, setPasswordHidden] = useState(true);

  return (
    <>
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
          {errors.password.message as string}
        </p>
      )}
    </>
  );
}

// Componente personalizado para el botón de submit con diseño idéntico
function SubmitButtonCustom() {
  const { isPending } = useFormContext();

  return (
    <Button
      type="submit"
      disabled={isPending}
      className="w-full cursor-pointer"
    >
      {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
    </Button>
  );
}