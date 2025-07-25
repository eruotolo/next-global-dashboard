'use client';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import useAuthStore from '@/store/authStore';
import type { ItemsNavSetting } from '@/types/settings/Sidebar/ItemsNavSetting';

export default function NavSetting({
    items,
    ...props
}: {
    items: ItemsNavSetting[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    const session = useAuthStore((state) => state.session);
    const userRoles = session?.user?.roles || [];

    const filteredItems = items.filter((item) => {
        if (!item.roles || item.roles.length === 0) return true;
        return item.roles.some((role) => userRoles.includes(role));
    });

    if (filteredItems.length === 0) return null;

    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {filteredItems.map((item) => {
                        const filteredSubItems = item.items?.filter((subItem) => {
                            if (!subItem.roles || subItem.roles.length === 0) return true;
                            return subItem.roles.some((role) => userRoles.includes(role));
                        });

                        if (
                            (!filteredSubItems || filteredSubItems.length === 0) &&
                            item.url === '#'
                        ) {
                            return null;
                        }

                        return (
                            <Collapsible key={item.title} asChild>
                                <SidebarMenuItem>
                                    {filteredSubItems?.length ? (
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                size="sm"
                                                tooltip={item.title}
                                                className="cursor-pointer"
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                    ) : (
                                        <SidebarMenuButton size="sm" asChild tooltip={item.title}>
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
                                                        <SidebarMenuSubButton size="sm" asChild>
                                                            <Link href={subItem.url}>
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
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
