import type { LucideIcon } from 'lucide-react';

export interface ItemsNavSetting {
    title: string;
    url: string;
    icon: LucideIcon;
    items?: {
        title: string;
        url: string;
    }[];
}
