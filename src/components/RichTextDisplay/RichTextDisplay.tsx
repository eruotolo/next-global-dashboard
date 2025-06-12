'use client';

import parse from 'html-react-parser';

interface RichTextDisplayProps {
    content: string | null | undefined; // Permitimos null/undefined
}

export default function RichTextDisplay({ content }: RichTextDisplayProps) {
    // Si content no es un string, usamos una cadena vacía
    const safeContent = typeof content === 'string' ? content : '';

    return (
        <div className="rich-text-content prose prose-slate h-auto max-w-none overflow-auto rounded-md border p-2">
            {parse(safeContent)}
        </div>
    );
}
