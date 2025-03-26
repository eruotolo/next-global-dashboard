'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { recoveryAccount } from '@/actions/recovery/recovery';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils/utils';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Procesando...' : 'Restaurar'}
        </Button>
    );
}

export function RecoveryForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const [state, formAction] = useFormState(recoveryAccount, {
        success: false,
        message: null,
    });

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-normal font-inter text-[25px] leading-[25px]">
                        Restaurar su cuenta.
                    </CardTitle>
                    <CardDescription className="font-normal font-inter text-[14px] leading-[14px]">
                        Ingresa su correo electrónico para restaurar su cuenta.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <SubmitButton />

                            {state?.message && (
                                <div
                                    className={cn(
                                        'text-sm text-center',
                                        state.success ? 'text-green-600' : 'text-red-600',
                                    )}
                                >
                                    {state.message}
                                </div>
                            )}

                            <div className="relative text-sm text-center after:border-border after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                <span className="relative z-10 px-2 bg-background text-muted-foreground">
                                    ¿Ya sos cliente?{' '}
                                    <Link
                                        href="/login"
                                        className="underline ml-[5px] underline-offset-4"
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
