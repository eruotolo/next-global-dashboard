import type { LucideIcon } from 'lucide-react';

export interface ItemsNavPrincipal {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    roles: string[];
    items?: {
        title: string;
        url: string;
        roles: string[];
    }[];
}
