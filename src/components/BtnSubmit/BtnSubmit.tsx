import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

interface BtnSubmitProps {
    label?: string;
}

export default function BtnSubmit({ label = 'Crear' }: BtnSubmitProps) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="custom-button" disabled={pending}>
            {pending ? 'Procesando...' : label}
        </Button>
    );
}
