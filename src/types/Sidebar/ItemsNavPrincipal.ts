import { LucideIcon } from 'lucide-react';

export interface ItemsNavPrincipal {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
        title: string;
        url: string;
    }[];
}
