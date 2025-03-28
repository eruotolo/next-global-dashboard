import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Italic,
    List,
    ListOrdered,
    Strikethrough,
} from 'lucide-react';
import { Toggle } from '../toggle';
import type { Editor } from '@tiptap/react';

export default function MenuBar({ editor }: { editor: Editor | null }) {
    if (!editor) {
        return null;
    }

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
    ];

    return (
        <div className="border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50">
            {Options.map((option) => (
                <Toggle key={option.id} pressed={option.preesed} onPressedChange={option.onClick}>
                    {option.icon}
                </Toggle>
            ))}
        </div>
    );
}
