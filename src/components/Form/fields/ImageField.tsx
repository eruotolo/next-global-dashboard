'use client';

import type React from 'react';
import { useRef, useState } from 'react';

import { ImageIcon, Upload, X } from 'lucide-react';
import { useController } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { useFormField } from '../hooks/useFormField';
import type { ImageFieldProps } from '../types/fields';

export function ImageField({
    name,
    label,
    folder,
    preview = true,
    maxSize = 3, // MB
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    required,
    disabled,
    className,
    description,
}: ImageFieldProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { error, hasError, isDisabled, fieldId, errorId, descriptionId } = useFormField(name);

    const { field } = useController({
        name,
        defaultValue: null,
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tamaño
        if (file.size > maxSize * 1024 * 1024) {
            alert(`El archivo debe ser menor a ${maxSize}MB`);
            return;
        }

        // Validar tipo
        if (!acceptedTypes.includes(file.type)) {
            alert(`Tipo de archivo no válido. Acepta: ${acceptedTypes.join(', ')}`);
            return;
        }

        setSelectedFile(file);
        field.onChange(file);

        if (preview) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        field.onChange(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={cn('space-y-2', className)}>
            <Label
                htmlFor={fieldId}
                className={cn(required && "after:ml-0.5 after:text-red-500 after:content-['*']")}
            >
                {label}
            </Label>

            <div className="space-y-3">
                {preview && previewUrl && (
                    <div className="relative inline-block">
                        <img
                            src={previewUrl || '/placeholder.svg'}
                            alt="Preview"
                            className="h-[234px] w-[234px] rounded-lg border object-cover"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={handleRemove}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                )}

                <div
                    className={cn(
                        'rounded-lg border-2 border-dashed p-6 text-center',
                        hasError && 'border-red-500',
                        'transition-colors hover:border-gray-400',
                    )}
                >
                    <input
                        ref={fileInputRef}
                        id={fieldId}
                        name={name}
                        type="file"
                        accept={acceptedTypes.join(',')}
                        onChange={handleFileSelect}
                        disabled={disabled || isDisabled}
                        className="hidden"
                        aria-describedby={cn(description && descriptionId, hasError && errorId)}
                    />

                    <div className="space-y-1">
                        <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                        <div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={disabled || isDisabled}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {selectedFile ? 'Cambiar imagen' : 'Subir imagen'}
                            </Button>
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Máximo {maxSize}MB •{' '}
                            {acceptedTypes.map((type) => type.split('/')[1]).join(', ')}
                            {folder && ` • Carpeta: ${folder}`}
                        </p>
                        {selectedFile && <p className="text-sm font-medium">{selectedFile.name}</p>}
                    </div>
                </div>
            </div>

            {description && (
                <p id={descriptionId} className="text-muted-foreground text-sm">
                    {description}
                </p>
            )}

            {hasError && (
                <p id={errorId} className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
