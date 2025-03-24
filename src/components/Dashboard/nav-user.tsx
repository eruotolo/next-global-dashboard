'use client';

import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import useAuthStore from '@/store/authStore';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

export default function NavUser() {
    const { isMobile } = useSidebar();
    const _pathname = usePathname();
    const router = useRouter();
    const session = useAuthStore((state) => state.session);

    const avatar: string | undefined = session?.user ? session.user.image : '';

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="w-8 h-8 rounded-lg">
                                <AvatarImage
                                    src={avatar}
                                    alt={
                                        session?.user
                                            ? `${session.user.name} ${session.user.lastName}`
                                            : 'Cargando...'
                                    }
                                />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-sm leading-tight text-left">
                                <span className="font-semibold truncate">
                                    {session?.user
                                        ? `${session.user.name} ${session.user.lastName}`
                                        : 'Cargando...'}
                                </span>
                                <span className="text-xs truncate">
                                    {session?.user?.roles && session.user.roles.length > 0
                                        ? session.user.roles.join(', ')
                                        : 'Cargando...'}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="rounded-lg w-[--radix-dropdown-menu-trigger-width] min-w-56"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex gap-2 items-center py-1.5 px-1 text-sm text-left">
                                <Avatar className="w-8 h-8 rounded-lg">
                                    <AvatarImage
                                        src={avatar}
                                        alt={
                                            session?.user
                                                ? `${session.user.name} ${session.user.lastName}`
                                                : 'Cargando...'
                                        }
                                    />
                                    <AvatarFallback className="rounded-lg">ER</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-sm leading-tight text-left">
                                    <span className="font-semibold truncate">
                                        {session?.user
                                            ? `${session.user.name} ${session.user.lastName}`
                                            : 'Cargando...'}
                                    </span>
                                    <span className="text-xs truncate">
                                        {session?.user ? session.user.email : 'Cargando...'}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer">
                                <BadgeCheck />
                                Perfil
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                                <LogOut />
                                Cerrar Sesión
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
