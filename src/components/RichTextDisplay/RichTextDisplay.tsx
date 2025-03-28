'use client';

import parse from 'html-react-parser';

interface RichTextDisplayProps {
    content: string | null | undefined; // Permitimos null/undefined
}

export default function RichTextDisplay({ content }: RichTextDisplayProps) {
    // Si content no es un string, usamos una cadena vacía
    const safeContent = typeof content === 'string' ? content : '';

    return (
        <div className="rich-text-content prose prose-slate max-w-none h-auto border rounded-md p-2 overflow-auto">
            {parse(safeContent)}
        </div>
    );
}
