import type { LucideIcon } from 'lucide-react';

export interface ItemsNavSetting {
    title: string;
    url: string;
    icon: LucideIcon;
    roles: string[];
    items?: {
        title: string;
        url: string;
        roles: string[];
    }[];
}
