'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { recoverPassword } from '@/actions/Settings/Recovery/Recovery';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        startTransition(async () => {
            const result = await recoverPassword(email);
            setMessage(result.message);
            setEmail('');
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
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="m@example.com"
                                    disabled={isPending}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full cursor-pointer"
                            >
                                {isPending ? 'Procesando...' : 'Recuperar Contraseña'}
                            </Button>

                            {message && (
                                <p
                                    className={`text-center text-[14px] ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}
                                >
                                    {message}
                                </p>
                            )}

                            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                <span className="bg-background text-muted-foreground relative z-10 px-2">
                                    ¿Ya sos cliente?{' '}
                                    <Link
                                        href="/login"
                                        className="ml-[5px] underline underline-offset-4"
                                    >
                                        Ingresar
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground hover:[&_a]:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
                By clicking continue, you agree to our <a href="/terms">Terms of Service</a> and{' '}
                <a href="/politics">Privacy Policy</a>.
            </div>
        </div>
    );
}
