import { create } from 'zustand';
import { getAllRoles } from '@/actions/Settings/Roles';
import { getAllUsers } from '@/actions/Settings/Users';
import type { RolePermissionInterface } from '@/types/settings/Roles/RolesInterface';
import type { UserInterface } from '@/types/settings/Table/UserInterface';

interface UserRoleState {
    userData: UserInterface[];
    rolesData: RolePermissionInterface[];
    isLoadingUsers: boolean;
    isLoadingRoles: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    fetchRoles: () => Promise<void>;
    refreshAll: () => Promise<void>;
}

export const useUserRoleStore = create<UserRoleState>((set) => ({
    userData: [],
    rolesData: [],
    isLoadingUsers: false,
    isLoadingRoles: false,
    error: null,

    fetchUsers: async () => {
        set({ isLoadingUsers: true, error: null });
        try {
            const data = await getAllUsers();
            const transformedData =
                data?.map((user) => ({
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    roles: user.roles.map((role) => ({
                        id: role.id,
                        userId: role.userId || null,
                        roleId: role.roleId || null,
                        role: role.role
                            ? {
                                  id: role.role.id,
                                  name: role.role.name,
                                  state: role.role.state ?? 1,
                              }
                            : null,
                    })),
                })) || [];
            set({ userData: transformedData });
        } catch (err) {
            console.error('Error al obtener los usuarios:', err);
            set({ error: 'Error al obtener los usuarios.' });
        } finally {
            set({ isLoadingUsers: false });
        }
    },

    fetchRoles: async () => {
        set({ isLoadingRoles: true, error: null });
        try {
            const data = await getAllRoles();
            const transformedData =
                data?.map((role) => ({
                    id: role.id,
                    name: role.name,
                    state: role.state,
                    permissionRole:
                        role.permissionRole?.map((permission) => ({
                            id: permission.id,
                            roleId: permission.roleId,
                            permissionId: permission.permissionId,
                            permission: permission.permission
                                ? {
                                      id: permission.permission.id,
                                      name: permission.permission.name,
                                  }
                                : null,
                        })) || [],
                })) || [];
            set({ rolesData: transformedData });
        } catch (err) {
            console.error('Error al obtener los roles:', err);
            set({ error: 'Error al obtener los roles.' });
        } finally {
            set({ isLoadingRoles: false });
        }
    },

    refreshAll: async () => {
        set({ isLoadingUsers: true, isLoadingRoles: true });
        await Promise.all([
            useUserRoleStore.getState().fetchUsers(),
            useUserRoleStore.getState().fetchRoles(),
        ]);
    },
}));
