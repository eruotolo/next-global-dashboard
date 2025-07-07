import { del, put } from '@vercel/blob';

// Función para generar una cadena aleatoria de 8 caracteres
function generateRandomString(length = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export interface UploadFileOptions {
    file: File;
    folder?: string;
    prefix?: string;
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB en bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

export async function uploadFile({
    file,
    folder = 'uploads',
    prefix = '',
}: UploadFileOptions): Promise<string | null> {
    // Validar tamaño del archivo
    if (!file || file.size > MAX_FILE_SIZE) {
        throw new Error('El archivo excede el tamaño máximo permitido de 4MB');
    }

    // Validar tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error(
            'Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG, WEBP y GIF',
        );
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        throw new Error('Extensión de archivo no permitida');
    }

    const randomId = generateRandomString();
    const fileName = `${folder}/${prefix}${randomId}-${Date.now()}.${fileExtension}`;

    try {
        const blob = await put(fileName, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return blob.url;
    } catch (error) {
        console.error('Error al subir el archivo:', error);
        throw new Error('Error al subir el archivo. Por favor, inténtelo de nuevo.');
    }
}

export async function deleteFile(url: string): Promise<void> {
    try {
        if (!url) return;

        // Extraer la ruta relativa desde la URL (después del dominio)
        const urlObj = new URL(url);
        // El pathname comienza con '/', así que lo quitamos
        const filePath = urlObj.pathname.startsWith('/')
            ? urlObj.pathname.slice(1)
            : urlObj.pathname;

        await del(filePath, {
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
    } catch (error) {
        console.error('Error al eliminar el archivo:', error);
        throw new Error('Error al eliminar el archivo anterior.');
    }
}
