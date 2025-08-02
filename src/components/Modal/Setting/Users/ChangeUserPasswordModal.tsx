'use client';

import { toast } from 'sonner';

import { changeUserPassword } from '@/actions/Settings/Users/mutations';
import { Form, TextField } from '@/components/Form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ChangePassModalProps } from '@/types/settings/Users/UsersInterface';

import { ChangePasswordSchema } from './userSchemas';

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
    const handleSuccess = async () => {
        toast.success('Change Password Successful', {
            description: successMessage,
        });
        refresh?.();
        onCloseAction(false);

        if (shouldSignOut && signOut) {
            await delay(signOutDelay);
            await signOut();
        }
    };

    const handleError = (error: string) => {
        toast.error('Change Password Failed', {
            description: error,
        });
    };

    const handleChangePassword = async (formData: FormData) => {
        const result = await changeUserPassword(id.toString(), formData);
        if (result?.error) {
            throw new Error(result.error);
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

                <Form
                    schema={ChangePasswordSchema}
                    action={handleChangePassword}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    submitText="Actualizar"
                    onCancel={() => onCloseAction(false)}
                    className="space-y-4"
                >
                    <TextField
                        name="currentPassword"
                        label="Contraseña Actual"
                        type="password"
                        placeholder="Ingrese su contraseña actual"
                        required
                        showPasswordToggle={true}
                    />
                    <TextField
                        name="password"
                        label="Nueva Contraseña"
                        type="password"
                        placeholder="Ingrese la nueva contraseña"
                        required
                        showPasswordToggle={true}
                    />
                    <TextField
                        name="confirmPassword"
                        label="Confirmar Nueva Contraseña"
                        type="password"
                        placeholder="Confirme la nueva contraseña"
                        required
                        showPasswordToggle={true}
                    />
                </Form>
            </DialogContent>
        </Dialog>
    );
}
