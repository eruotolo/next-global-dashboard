'use client';

import { useState } from 'react';

import { AlertTriangle, Mail, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { resetUserPassword } from '@/lib/auth/password/passwordService';

interface ResetPasswordProps {
    userId: string;
    userName: string;
    userEmail: string;
    open: boolean;
    onSuccess?: () => void;
    onCloseAction: (isOpen: boolean) => void;
}

export default function ResetPassword({
    userId,
    userName,
    userEmail,
    open,
    onSuccess,
    onCloseAction,
}: ResetPasswordProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [copiedPassword, setCopiedPassword] = useState(false);
    const [sendEmail, setSendEmail] = useState(true);

    const handleReset = async () => {
        if (!userId) {
            toast.error('Error', {
                description: 'ID de usuario requerido',
            });
            return;
        }

        setIsLoading(true);

        try {
            const result = await resetUserPassword(userId, { sendEmail });

            if (result?.error) {
                toast.error('Error al resetear contraseña', {
                    description: result.error,
                });
                return;
            }

            if (result?.success && result?.temporaryPassword) {
                const description = result.emailSent
                    ? `Se ha enviado la nueva contraseña temporal por email a ${userEmail}`
                    : 'Se ha generado una contraseña temporal.';

                toast.success('Contraseña reseteada exitosamente', {
                    description,
                    action:
                        !result.emailSent && result.temporaryPassword
                            ? {
                                  label: copiedPassword ? 'Copiado!' : 'Copiar contraseña',
                                  onClick: () => {
                                      if (result.temporaryPassword) {
                                          copyToClipboard(result.temporaryPassword);
                                      }
                                  },
                              }
                            : undefined,
                    duration: result.emailSent ? 5000 : 10000,
                });

                onSuccess?.();
                onCloseAction(false);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('Error al resetear contraseña', {
                description: 'Ha ocurrido un error inesperado. Inténtelo de nuevo.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (password: string) => {
        try {
            await navigator.clipboard.writeText(password);
            setCopiedPassword(true);
            toast.success('Contraseña copiada', {
                description: 'La contraseña temporal ha sido copiada al portapapeles.',
            });

            setTimeout(() => {
                setCopiedPassword(false);
            }, 3000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            toast.error('Error al copiar', {
                description: 'No se pudo copiar la contraseña al portapapeles.',
            });
        }
    };

    const handleCancel = () => {
        if (!isLoading) {
            onCloseAction(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <RotateCcw className="h-5 w-5" />
                        Resetear Contraseña
                    </DialogTitle>
                    <DialogDescription>
                        Esta acción generará una nueva contraseña temporal para el usuario. La
                        contraseña actual será invalidada inmediatamente.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <div className="space-y-2">
                                <p className="font-medium">
                                    ¿Está seguro de que desea resetear la contraseña para:
                                </p>
                                <div className="ml-4 space-y-1 text-sm">
                                    <p>
                                        <span className="font-medium">Usuario:</span> {userName}
                                    </p>
                                    <p>
                                        <span className="font-medium">Email:</span> {userEmail}
                                    </p>
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    {sendEmail
                                        ? 'Se enviará la nueva contraseña temporal por email al usuario.'
                                        : 'Se generará una contraseña temporal que deberá proporcionar al usuario para que pueda acceder y cambiar su contraseña.'}
                                </p>
                            </div>
                        </AlertDescription>
                    </Alert>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="sendEmail"
                            checked={sendEmail}
                            onCheckedChange={(checked) => setSendEmail(checked as boolean)}
                        />
                        <label
                            htmlFor="sendEmail"
                            className="flex items-center gap-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            <Mail className="h-4 w-4" />
                            Enviar contraseña por email
                        </label>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="min-w-[100px]"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReset}
                            disabled={isLoading}
                            className="min-w-[140px]"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="border-background h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                                    Procesando...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <RotateCcw className="h-4 w-4" />
                                    Resetear Contraseña
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
