'use client';

import Form from 'next/form';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateUser } from '@/actions/Settings/Users';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ChangePassModalProps, UserFormPassData } from '@/types/settings/Users/UsersInterface';

function SubmitButton({
    isValid,
    password,
    confirmPassword,
}: {
    isValid: boolean;
    password: string;
    confirmPassword: string;
}) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending || !isValid || password !== confirmPassword}
            className="custom-button"
        >
            {pending ? 'Actualizando...' : 'Actualizar'}
        </button>
    );
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChangePasswordModal({
    id,
    refresh,
    open,
    onCloseAction,
    signOut,
    successMessage,
    shouldSignOut = false,
    signOutDelay = 5000,
}: ChangePassModalProps) {
    const [error, setError] = useState('');
    const {
        register,
        watch,
        reset,
        formState: { errors, isValid },
    } = useForm<UserFormPassData>({
        mode: 'onChange',
    });

    const password = watch('password');
    const confirmPassword = watch('confirmPassword');

    const onSubmit = async (formData: FormData) => {
        try {
            const result = await updateUser(id.toString(), formData);
            if (result.error) {
                setError(result.error);
                toast.error('Change Password Failed', {
                    description: result.error,
                });
                return;
            }

            refresh?.();
            reset();
            setError('');
            onCloseAction(false);
            toast.success('Change Password Successful', {
                description: successMessage,
            });

            if (shouldSignOut && signOut) {
                await delay(signOutDelay); // espera configurable
                await signOut();
            }
        } catch (err) {
            console.error('Error changing password:', err);
            setError('Error al cambiar la contraseña. Inténtalo de nuevo.');
            toast.error('Change Password Failed', {
                description: 'Error al intentar cambiar el password',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cambiar Contraseña</DialogTitle>
                    <DialogDescription>
                        Introduce una nueva contraseña para el usuario. Asegúrate de que cumpla con
                        los requisitos de seguridad antes de guardar los cambios.
                    </DialogDescription>
                </DialogHeader>
                <Form action={onSubmit}>
                    <div className="mb-[15px] grid">
                        <div className="mb-[15px]">
                            <Label className="custom-label">Ingrese La Nueva Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Contraseña"
                                {...register('password', {
                                    required: 'La contraseña es obligatoria',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                                })}
                            />
                            {errors.password && (
                                <p className="custome-form-error">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="mb-[15px]">
                            <Label className="custom-label">Confirmar La Nueva Contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Ingresar nuevamente la contraseña"
                                {...register('confirmPassword', {
                                    required: 'Contenido Requerido',
                                    validate: (value) =>
                                        value === password || 'Las contraseñas no coinciden',
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="custome-form-error">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {error && <p className="custome-form-error">{error}</p>}
                    </div>
                    <DialogFooter>
                        <SubmitButton
                            isValid={isValid}
                            password={password}
                            confirmPassword={confirmPassword}
                        />
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
