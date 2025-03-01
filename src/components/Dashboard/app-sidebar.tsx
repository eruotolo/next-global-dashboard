'use client';

import Link from 'next/link';
import Image from 'next/image';

import NavMain from '@/components/Dashboard/nav-main';
import NavProjects from '@/components/Dashboard/nav-projects';
import NavSetting from '@/components/Dashboard/nav-setting';
import NavUser from '@/components/Dashboard/nav-user';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { navData } from '@/data/navData';

const logo: string = '/logo-sm-wh.svg';

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="#">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Image
                                        src={logo}
                                        alt="Logo"
                                        width={480}
                                        height={473}
                                        className="h-[23px] w-[24px]"
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate text-[16px] font-semibold">
                                        Chubby
                                    </span>
                                    <span className="truncate text-[11px]">Dashboard</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navData.navMain} />
                <NavProjects projects={navData.projects} />
                <NavSetting items={navData.navSetting} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
