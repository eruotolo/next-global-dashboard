'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import type { ItemsNavPrincipal } from '@/tipos/Sidebar/ItemsNavPrincipal';
import { useUserPermissionStore } from '@/store/useUserPermissionStore';

export default function NavMain({ items }: { items: ItemsNavPrincipal[] }) {
    const hasAnyRole = useUserPermissionStore((state) => state.hasAnyRole);

    // Filtrar items según roles
    const filteredItems = items.filter(item => {
        const hasRequiredRole = !item.roles?.length || 
            hasAnyRole(item.roles);

        return hasRequiredRole;
    });

    if (filteredItems.length === 0) return null;

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarMenu>
                {filteredItems.map((item) => {
                    // Filtrar subitems según roles
                    const filteredSubItems = item.items?.filter(subItem => {
                        const hasSubItemRole = !subItem.roles?.length || 
                            hasAnyRole(subItem.roles);

                        return hasSubItemRole;
                    });

                    // Si no hay subitems visibles y el item principal no tiene URL, no mostrar
                    if ((!filteredSubItems || filteredSubItems.length === 0) && item.url === '#') {
                        return null;
                    }

                    return (
                        <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                                {filteredSubItems?.length ? (
                                    <>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                                                <ChevronRight />
                                                <span className="sr-only">Toggle</span>
                                            </SidebarMenuAction>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {filteredSubItems.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild>
                                                            <Link href={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </>
                                ) : null}
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
