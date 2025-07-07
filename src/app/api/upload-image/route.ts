import { put } from '@vercel/blob';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get('image') as File | null;
        if (!imageFile || imageFile.size === 0) {
            return NextResponse.json(
                { error: 'No se proporcionó ninguna imagen.' },
                { status: 400 },
            );
        }

        // Validar tamaño de archivo (4MB máximo)
        const maxSizeInBytes = 4194304; // 4MB
        if (imageFile.size > maxSizeInBytes) {
            return NextResponse.json({ error: 'La imagen no puede superar 4MB.' }, { status: 400 });
        }
        // Permitir solo ciertos tipos de imágenes
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'image/bmp',
            'image/tiff',
            'image/x-icon',
        ];
        if (!allowedTypes.includes(imageFile.type)) {
            return NextResponse.json({ error: 'Tipo de imagen no permitido.' }, { status: 400 });
        }
        // Permitir carpeta personalizada para la organización
        const folder = formData.get('folder') as string | null;
        const safeFolder =
            folder && /^[a-zA-Z0-9-_/]+$/.test(folder) ? folder.replace(/\/+$/, '') : 'uploads';
        const fileExtension = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `${safeFolder}/${Date.now()}.${fileExtension}`;
        const blob = await put(fileName, imageFile, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        return NextResponse.json({ url: blob.url });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        return NextResponse.json({ error: 'Error al subir la imagen.' }, { status: 500 });
    }
}
