'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useController } from 'react-hook-form';
import { Upload, X, File, ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import type { FileDropzoneFieldProps, UploadedFile } from '../types/fields';
import { useFormField } from '../hooks/useFormField';
import { cn } from '@/lib/utils';

export function FileDropzoneField({
    name,
    label,
    folder,
    multiple = false,
    maxFiles = 5,
    maxSize = 10, // MB
    acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
    preview = true,
    required,
    disabled,
    className,
    description,
}: FileDropzoneFieldProps) {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const { error, hasError, isDisabled, fieldId, errorId, descriptionId } = useFormField(name);

    const { field } = useController({
        name,
        rules: { required: required ? 'Este campo es requerido' : false },
        defaultValue: [],
    });

    const uploadToBlob = useCallback(
        async (file: File): Promise<UploadedFile> => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);

            // Simular progreso de upload
            const fileId = `${file.name}-${Date.now()}`;
            setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

            try {
                // Simular progreso
                const progressInterval = setInterval(() => {
                    setUploadProgress((prev) => {
                        const current = prev[fileId] || 0;
                        if (current >= 90) {
                            clearInterval(progressInterval);
                            return prev;
                        }
                        return { ...prev, [fileId]: current + 10 };
                    });
                }, 200);

                // Llamada real a tu API de Vercel Blob
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    clearInterval(progressInterval);
                    setUploadProgress((prev) => {
                        const newProgress = { ...prev };
                        delete newProgress[fileId];
                        return newProgress;
                    });
                    const error = new Error(`HTTP error! status: ${response.status}`);
                    console.error('Upload failed:', error);
                    throw error;
                }

                const result = await response.json();

                clearInterval(progressInterval);
                setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));

                return {
                    id: fileId,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: result.url,
                    uploadedAt: new Date(),
                };
            } catch (error) {
                setUploadProgress((prev) => {
                    const newProgress = { ...prev };
                    delete newProgress[fileId];
                    return newProgress;
                });
                throw error;
            }
        },
        [folder],
    );

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (disabled || isDisabled) return;

            const filesToUpload = multiple ? acceptedFiles : [acceptedFiles[0]];

            try {
                const uploadPromises = filesToUpload.map(uploadToBlob);
                const newUploadedFiles = await Promise.all(uploadPromises);

                const updatedFiles = multiple
                    ? [...uploadedFiles, ...newUploadedFiles]
                    : newUploadedFiles;

                setUploadedFiles(updatedFiles);
                field.onChange(updatedFiles);

                // Limpiar progreso después de un tiempo
                setTimeout(() => {
                    setUploadProgress({});
                }, 2000);
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        },
        [uploadedFiles, multiple, disabled, isDisabled, field, uploadToBlob],
    );

    const acceptObject = acceptedTypes.reduce(
        (acc, type) => {
            acc[type] = [];
            return acc;
        },
        {} as Record<string, string[]>,
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept: acceptObject,
        maxSize: maxSize * 1024 * 1024,
        maxFiles: multiple ? maxFiles : 1,
        multiple,
        disabled: disabled || isDisabled,
    });

    const removeFile = (fileId: string) => {
        const updatedFiles = uploadedFiles.filter((file) => file.id !== fileId);
        setUploadedFiles(updatedFiles);
        field.onChange(updatedFiles);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
        return <File className="h-4 w-4" />;
    };

    return (
        <div className={cn('space-y-4', className)}>
            <Label
                htmlFor={fieldId}
                className={cn(required && "after:ml-0.5 after:text-red-500 after:content-['*']")}
            >
                {label}
            </Label>

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={cn(
                    'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                    isDragActive && 'border-blue-500 bg-blue-50',
                    hasError && 'border-red-500',
                    (disabled || isDisabled) && 'cursor-not-allowed opacity-50',
                    'hover:border-gray-400',
                )}
            >
                <input
                    {...getInputProps()}
                    id={fieldId}
                    aria-describedby={cn(description && descriptionId, hasError && errorId)}
                />

                <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div>
                        <p className="text-sm font-medium">
                            {isDragActive
                                ? 'Suelta los archivos aquí'
                                : 'Arrastra archivos aquí o haz clic para seleccionar'}
                        </p>
                        <p className="text-muted-foreground text-xs">
                            {multiple ? `Máximo ${maxFiles} archivos` : 'Un archivo'} • Máximo{' '}
                            {maxSize}MB cada uno
                        </p>
                        <p className="text-muted-foreground text-xs">
                            Formatos: {acceptedTypes.join(', ')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Errores de archivos rechazados */}
            {fileRejections.length > 0 && (
                <div className="space-y-1">
                    {fileRejections.map(({ file, errors }) => (
                        <div
                            key={file.name}
                            className="flex items-center gap-2 text-sm text-red-600"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <span>
                                {file.name}: {errors.map((e) => e.message).join(', ')}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Lista de archivos subidos */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Archivos subidos:</Label>
                    <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center gap-3 rounded-lg border p-3"
                            >
                                {preview && file.type.startsWith('image/') ? (
                                    <img
                                        src={file.url || '/placeholder.svg'}
                                        alt={file.name}
                                        className="h-10 w-10 rounded object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                        {getFileIcon(file.type)}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">{file.name}</p>
                                    <p className="text-muted-foreground text-xs">
                                        {formatFileSize(file.size)}
                                    </p>

                                    {/* Barra de progreso */}
                                    {uploadProgress[file.id] !== undefined &&
                                        uploadProgress[file.id] < 100 && (
                                            <Progress
                                                value={uploadProgress[file.id]}
                                                className="mt-1 h-1"
                                            />
                                        )}
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(file.id)}
                                    disabled={disabled || isDisabled}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
