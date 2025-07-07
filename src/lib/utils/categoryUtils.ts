// Función para generar slug desde el nombre de categoría
export function generateCategorySlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
        .replace(/\s+/g, '') // Remover espacios
        .trim();
}
