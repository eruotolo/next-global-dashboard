import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

export default function BtnSubmit(){
    const { pending } = useFormStatus();
    return(
        <Button type="submit" className="custom-button" disabled={pending}>
            {pending ? 'Creando...' : 'Crear'}
        </Button>
    );

}