/**
 * Componentes de acciones para formularios
 * Botones de submit, cancel, etc. con estado integrado
 */

import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useFormContext } from './FormWrapper';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
    children: ReactNode;
    className?: string;
    justify?: 'start' | 'center' | 'end' | 'between';
}

/**
 * Contenedor para acciones del formulario
 */
export function FormActions({ children, className = '', justify = 'end' }: FormActionsProps) {
    const justifyClasses = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
    };

    return <div className={`flex gap-2 ${justifyClasses[justify]} ${className}`}>{children}</div>;
}

interface SubmitButtonProps {
    children?: ReactNode;
    loadingText?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    disabled?: boolean;
}

/**
 * Botón de submit con estado de loading integrado
 */
export function SubmitButton({
    children = 'Guardar',
    loadingText = 'Procesando...',
    variant = 'default',
    size = 'default',
    className = '',
    disabled = false,
}: SubmitButtonProps) {
    const { isPending, form } = useFormContext();
    const {
        formState: { isValid },
    } = form;

    const isDisabled = disabled || isPending || !isValid;

    return (
        <Button
            type="submit"
            variant={variant}
            size={size}
            disabled={isDisabled}
            className={className}
        >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? loadingText : children}
        </Button>
    );
}

interface CancelButtonProps {
    onClick?: () => void;
    children?: ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
}

/**
 * Botón de cancelar
 */

export function CancelButton({
    onClick,
    children = 'Cancelar',
    variant = 'outline',
    size = 'default',
    className = '',
}: CancelButtonProps) {
    const { isPending } = useFormContext();

    return (
        <Button
            type="button"
            variant={variant}
            size={size}
            onClick={onClick}
            disabled={isPending}
            className={className}
        >
            {children}
        </Button>
    );
}

interface ResetButtonProps {
    children?: ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    confirmMessage?: string;
}

/**
 * Botón de resetear formulario
 */
export function ResetButton({
    children = 'Limpiar',
    variant = 'ghost',
    size = 'default',
    className = '',
    confirmMessage = '¿Estás seguro de limpiar el formulario?',
}: ResetButtonProps) {
    const { isPending, form } = useFormContext();

    const handleReset = () => {
        if (window.confirm(confirmMessage)) {
            form.reset();
        }
    };

    return (
        <Button
            type="button"
            variant={variant}
            size={size}
            onClick={handleReset}
            disabled={isPending}
            className={className}
        >
            {children}
        </Button>
    );
}

/**
 * Botón de acción personalizada
 */
interface ActionButtonProps {
    onClick: () => void;
    children: ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    confirmMessage?: string;
}

export function ActionButton({
    onClick,
    children,
    variant = 'default',
    size = 'default',
    className = '',
    disabled = false,
    loading = false,
    loadingText = 'Procesando...',
    confirmMessage,
}: ActionButtonProps) {
    const { isPending } = useFormContext();

    const handleClick = () => {
        if (confirmMessage) {
            if (window.confirm(confirmMessage)) {
                onClick();
            }
        } else {
            onClick();
        }
    };

    const isDisabled = disabled || isPending || loading;

    return (
        <Button
            type="button"
            variant={variant}
            size={size}
            onClick={handleClick}
            disabled={isDisabled}
            className={className}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? loadingText : children}
        </Button>
    );
}

/**
 * Grupo de botones común para formularios
 */
interface StandardFormActionsProps {
    onCancel?: () => void;
    submitText?: string;
    cancelText?: string;
    showReset?: boolean;
    resetText?: string;
    justify?: 'start' | 'center' | 'end' | 'between';
}

export function StandardFormActions({
    onCancel,
    submitText = 'Guardar',
    cancelText = 'Cancelar',
    showReset = false,
    resetText = 'Limpiar',
    justify = 'end',
}: StandardFormActionsProps) {
    return (
        <FormActions justify={justify}>
            {showReset && <ResetButton>{resetText}</ResetButton>}
            {onCancel && <CancelButton onClick={onCancel}>{cancelText}</CancelButton>}
            <SubmitButton>{submitText}</SubmitButton>
        </FormActions>
    );
}
