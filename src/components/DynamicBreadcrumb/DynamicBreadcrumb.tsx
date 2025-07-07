'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Mapeo personalizado para nombres específicos de rutas
import { customRouteNames } from '@/lib/navigation/customRouteNames';

// Función para formatear nombres automáticamente
const formatSegmentName = (segment: string, _index: number, _segments: string[]) => {
    // Usamos el nombre personalizado si existe
    if (customRouteNames[segment]) {
        return customRouteNames[segment];
    }

    // Ignorar segmentos que no deben mostrarse en los breadcrumbs (opcional)
    if (['api', 'auth'].includes(segment)) {
        return null;
    }

    // Manejar segmentos dinámicos (por ejemplo, IDs numéricos o UUIDs)
    if (/^\d+$/.test(segment) || /[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/.test(segment)) {
        return 'Detalle';
    }

    // Reemplazar guiones y guiones bajos por espacios
    const cleanedSegment = segment.replace(/[-_]/g, ' ');

    // Capitalizar cada palabra
    const capitalized = cleanedSegment
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    // Manejar casos comunes (por ejemplo, "id" → "ID", "api" → "API")
    const specialCases: Record<string, string> = {
        id: 'ID',
        api: 'API',
        faq: 'FAQ',
    };

    return specialCases[capitalized.toLowerCase()] || capitalized;
};

export function DynamicBreadcrumb() {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter((segment) => segment);

    // Filtramos segmentos que no deben mostrarse (que devuelvan null)
    const filteredSegments = pathSegments
        .map((segment, index) => ({
            segment,
            name: formatSegmentName(segment, index, pathSegments),
        }))
        .filter((item) => item.name !== null);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {filteredSegments.length === 0 ? (
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbPage>Inicio</BreadcrumbPage>
                    </BreadcrumbItem>
                ) : (
                    filteredSegments.flatMap(({ name }, index) => {
                        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                        const isLast = index === filteredSegments.length - 1;

                        const breadcrumbItem = (
                            <BreadcrumbItem key={href} className="hidden md:block">
                                {isLast ? (
                                    <BreadcrumbPage>{name}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>{name}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        );

                        const separator = !isLast ? (
                            <BreadcrumbSeparator
                                key={`${href}-separator`}
                                className="hidden md:block"
                            />
                        ) : null;

                        return separator ? [breadcrumbItem, separator] : [breadcrumbItem];
                    })
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
