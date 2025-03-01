'use client';

import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import useAuthStore from '@/store/authStore';

import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    const pathname = usePathname();
    const router = useRouter();
    const session = useAuthStore((state) => state.session);

    const avatar: string | undefined = session && session.user ? session.user.image : '';

    const handleSignOut = async () => {
        console.log('Cerrando sesión...');
        await signOut({ redirect: false });
        console.log('Sesión cerrada');
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
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={avatar}
                                    alt={
                                        session && session.user
                                            ? session.user.name + ' ' + session.user.lastName
                                            : 'Cargando...'
                                    }
                                />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {session && session.user
                                        ? session.user.name + ' ' + session.user.lastName
                                        : 'Cargando...'}
                                </span>
                                <span className="truncate text-xs">
                                    {session &&
                                    session.user &&
                                    session.user.roles &&
                                    session.user.roles.length > 0
                                        ? session.user.roles.join(', ')
                                        : 'Cargando...'}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={avatar}
                                        alt={
                                            session && session.user
                                                ? session.user.name + ' ' + session.user.lastName
                                                : 'Cargando...'
                                        }
                                    />
                                    <AvatarFallback className="rounded-lg">ER</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {session && session.user
                                            ? session.user.name + ' ' + session.user.lastName
                                            : 'Cargando...'}
                                    </span>
                                    <span className="truncate text-xs">
                                        {session && session.user
                                            ? session.user.email
                                            : 'Cargando...'}
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
