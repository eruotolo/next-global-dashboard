'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import useAuthStore from '@/store/authStore';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronsUpDown, LogOut, Key, UserPen } from 'lucide-react';

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

const DynamicEditUserModal = dynamic(
    () => import('@/components/Modal/Setting/Users/EditUserModal'),
    { ssr: false },
);

const DynamicChangeUserPassModal = dynamic(
    () => import('@/components/Modal/Setting/Users/ChangeUserPasswordModal'),
    { ssr: false },
);

export default function NavUser() {
    const { isMobile } = useSidebar();
    const _pathname = usePathname();
    const router = useRouter();
    const session = useAuthStore((state) => state.session);

    const [openEditUser, setOpenEditUser] = useState(false);
    const [openChangePass, setOpenChangePass] = useState(false);

    const avatar: string | undefined = session?.user ? session.user.image : '';

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    const handleEditUserCloseModal = () => {
        setOpenEditUser(false);
    };

    const handleChangePassCloseModal = (isOpen: boolean) => {
        setOpenChangePass(isOpen);
    };

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
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
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {session?.user
                                            ? `${session.user.name} ${session.user.lastName}`
                                            : 'Cargando...'}
                                    </span>
                                    <span className="truncate text-xs">
                                        {session?.user?.roles && session.user.roles.length > 0
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
                                                session?.user
                                                    ? `${session.user.name} ${session.user.lastName}`
                                                    : 'Cargando...'
                                            }
                                        />
                                        <AvatarFallback className="rounded-lg">ER</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {session?.user
                                                ? `${session.user.name} ${session.user.lastName}`
                                                : 'Cargando...'}
                                        </span>
                                        <span className="truncate text-xs">
                                            {session?.user ? session.user.email : 'Cargando...'}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => setOpenEditUser(true)}
                                >
                                    <UserPen />
                                    Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => setOpenChangePass(true)}
                                >
                                    <Key />
                                    Cambiar Password
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="cursor-pointer"
                                >
                                    <LogOut />
                                    Cerrar Sesión
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            {openEditUser && session?.user?.id && (
                <DynamicEditUserModal
                    id={session.user.id}
                    open={openEditUser}
                    onClose={handleEditUserCloseModal}
                />
            )}

            {openChangePass && session?.user?.id && (
                <DynamicChangeUserPassModal
                    id={session.user.id}
                    open={openChangePass}
                    onClose={handleChangePassCloseModal}
                    signOut={handleSignOut}
                    successMessage="El password se ha cambiado correctamente, se va a cerrar la session. Por favor, ingrese nuevamente sus credenciales."
                    shouldSignOut={true}
                    signOutDelay={5000}
                />
            )}
        </>
    );
}
