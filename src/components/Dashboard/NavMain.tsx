'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import useAuthStore from '@/store/authStore';
import type { ItemsNavPrincipal } from '@/types/settings/Sidebar/ItemsNavPrincipal';

export default function NavMain({ items }: { items: ItemsNavPrincipal[] }) {
    const session = useAuthStore((state) => state.session);
    const userRoles = session?.user?.roles || [];

    // Filtrar items según roles
    const filteredItems = items.filter((item) => {
        // Si no hay roles definidos, mostrar el item
        if (!item.roles || item.roles.length === 0) return true;
        // Si hay roles, verificar si el usuario tiene al menos uno de ellos
        return item.roles.some((role) => userRoles.includes(role));
    });

    if (filteredItems.length === 0) return null;

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Tablero Principal</SidebarGroupLabel>
            <SidebarMenu>
                {filteredItems.map((item) => {
                    // Filtrar subitems según roles
                    const filteredSubItems = item.items?.filter((subItem) => {
                        if (!subItem.roles || subItem.roles.length === 0) return true;
                        return subItem.roles.some((role) => userRoles.includes(role));
                    });

                    // Si no hay subitems visibles y el item principal no tiene URL, no mostrar
                    if ((!filteredSubItems || filteredSubItems.length === 0) && item.url === '#') {
                        return null;
                    }

                    return (
                        <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                            <SidebarMenuItem>
                                {filteredSubItems?.length ? (
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton asChild tooltip={item.title}>
                                            <div className="cursor-pointer font-medium">
                                                <item.icon />
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                                            </div>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                ) : (
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                )}
                                {filteredSubItems?.length ? (
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {filteredSubItems.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link
                                                            href={subItem.url}
                                                            className="text-[13px]"
                                                        >
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                ) : null}
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
