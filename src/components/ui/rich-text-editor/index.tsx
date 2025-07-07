'use client';

import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import MenuBar from './menu-bar';

interface RichTextEditorProps {
    content: string;
    onChangeAction: (content: string) => void;
    imageFolder?: string;
}

export default function RichTextEditor({
    content,
    onChangeAction,
    imageFolder = 'editor-images',
}: RichTextEditorProps) {
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-3',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal ml-3',
                    },
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight,
            Image,
            Link.configure({
                openOnClick: true,
                autolink: true,
                linkOnPaste: true,
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'min-h-[156px] border rounded-md bg-slate-50 py-2 px-3',
            },
        },
        onUpdate: ({ editor }) => {
            onChangeAction(editor.getHTML());
            const text = editor.getText();
            setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
            setCharCount(text.length);
        },
    });

    // Actualizar el contenido del editor cuando cambie la prop content
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div>
            <MenuBar editor={editor} imageFolder={imageFolder} />
            <EditorContent editor={editor} />
            <div className="text-muted-foreground mt-1 flex justify-end text-xs">
                <span className="mr-2">Palabras: {wordCount}</span>
                <span>Caracteres: {charCount}</span>
            </div>
        </div>
    );
}
