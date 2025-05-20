'use client';

import Image from 'next/image';
import Link from 'next/link';

import NavMain from '@/components/Dashboard/NavMain';
import NavProjects from '@/components/Dashboard/NavProjects';
import NavSetting from '@/components/Dashboard/NavSetting';
import NavUser from '@/components/Dashboard/NavUser';
import NavPrivate from '@/components/Dashboard/NavPrivate';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { navData } from '@/lib/navigation/navData';

import useAuthStore from '@/store/authStore';

const logo: string = '/logo-sm-wh.svg';

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const session = useAuthStore((state) => state.session);
    // Revisa si entre los roles existe 'SuperAdministrador'
    const isSuperAdministrador = session?.user?.roles?.includes('SuperAdministrador');

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="#">
                                <div className="flex justify-center items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8">
                                    <Image
                                        src={logo}
                                        alt="Logo"
                                        width={480}
                                        height={473}
                                        className="h-[23px] w-[24px]"
                                    />
                                </div>
                                <div className="grid flex-1 text-sm leading-tight text-left">
                                    <span className="font-semibold truncate text-[16px]">
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
                {isSuperAdministrador && <NavPrivate items={navData.adminSetting} />}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
