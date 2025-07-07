import type { Editor } from '@tiptap/react';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Strikethrough,
} from 'lucide-react';
import { toast } from 'sonner';
import { Toggle } from '../toggle';

export default function MenuBar({
    editor,
    imageFolder = 'editor-images',
}: {
    editor: Editor | null;
    imageFolder?: string;
}) {
    if (!editor) {
        return null;
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];

        // Validación del lado del cliente (4MB máximo)
        const maxSizeInBytes = 4194304; // 4MB
        if (file.size > maxSizeInBytes) {
            toast.error('Error de validación', {
                description: 'La imagen no puede superar 4MB.',
            });
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', imageFolder);

        try {
            const res = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (res.ok && data?.url) {
                editor.chain().focus().setImage({ src: data.url }).run();
                toast.success('Imagen subida', {
                    description: 'La imagen se ha subido correctamente.',
                });
            } else {
                const errorMessage = data?.error || 'Error desconocido al subir la imagen';
                toast.error('Error al subir imagen', {
                    description: errorMessage,
                });
                console.error('Error al subir la imagen:', errorMessage);
            }
        } catch (error) {
            toast.error('Error de conexión', {
                description: 'No se pudo conectar con el servidor.',
            });
            console.error('Error uploading image:', error);
        }
    };

    const handleSetLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Ingrese la URL del enlace:', previousUrl || 'https://');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const Options = [
        {
            id: 'heading-1',
            icon: <Heading1 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            preesed: editor.isActive('heading', { level: 1 }),
        },
        {
            id: 'heading-2',
            icon: <Heading2 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            preesed: editor.isActive('heading', { level: 2 }),
        },
        {
            id: 'heading-3',
            icon: <Heading3 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            preesed: editor.isActive('heading', { level: 3 }),
        },
        {
            id: 'bold',
            icon: <Bold className="size-4" />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            preesed: editor.isActive('bold'),
        },
        {
            id: 'italic',
            icon: <Italic className="size-4" />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            preesed: editor.isActive('italic'),
        },
        {
            id: 'strike-through',
            icon: <Strikethrough className="size-4" />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            preesed: editor.isActive('strike'),
        },
        {
            id: 'align-left',
            icon: <AlignLeft className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('left').run(),
            preesed: editor.isActive({ textAlign: 'left' }),
        },
        {
            id: 'align-center',
            icon: <AlignCenter className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('center').run(),
            preesed: editor.isActive({ textAlign: 'center' }),
        },
        {
            id: 'align-right',
            icon: <AlignRight className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('right').run(),
            preesed: editor.isActive({ textAlign: 'right' }),
        },
        {
            id: 'bullet-list',
            icon: <List className="size-4" />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            preesed: editor.isActive('bulletList'),
        },
        {
            id: 'ordered-list',
            icon: <ListOrdered className="size-4" />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            preesed: editor.isActive('orderedList'),
        },
        {
            id: 'highlight',
            icon: <Highlighter className="size-4" />,
            onClick: () => editor.chain().focus().toggleHighlight().run(),
            preesed: editor.isActive('highlight'),
        },
        {
            id: 'image',
            icon: <ImageIcon className="size-4" />,
            onClick: () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (event) => {
                    const e = event as unknown as React.ChangeEvent<HTMLInputElement>;
                    handleImageUpload(e);
                };
                input.click();
            },
            preesed: false,
        },
        {
            id: 'link',
            icon: <LinkIcon className="size-4" />,
            onClick: handleSetLink,
            preesed: editor.isActive('link'),
        },
    ];

    return (
        <div className="z-50 mb-1 space-x-2 rounded-md border bg-slate-50 p-1">
            {Options.map((option) => (
                <Toggle key={option.id} pressed={option.preesed} onPressedChange={option.onClick}>
                    {option.icon}
                </Toggle>
            ))}
        </div>
    );
}
