export interface UserFormData {
    name?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    birthdate?: string;
    address?: string;
    city?: string;
    password?: string;
    image?: FileList;
}

export interface UserQueryRole {
    id: string;
    userId: string | null; // Changed to allow null
    roleId: string | null; // Changed to allow null
    role: {
        id: string;
        name: string;
        state: number | null;
    } | null; // Made nullable
}

export interface UserQueryWithRoles {
    id: string;
    email: string;
    name: string;
    lastName: string;
    phone: string | null;
    state: number | null;
    roles: UserQueryRole[];
}

export interface EditModalProps {
    id: string | number;
    refresh: () => void;
    open: boolean;
    onClose: (open: boolean) => void;
}

export interface EditProfilModalProps {
    id: string | number;
    open: boolean;
    onClose: (open: boolean) => void;
    signOut?: () => Promise<void>;
}

export interface UserFormPassData {
    password: string;
    confirmPassword: string;
}

export interface UserData {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    birthdate: Date;
    address: string;
    city: string;
    password: string;
    image: string;
}

export interface UserInterface {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    birthdate?: Date | null; // Opcional y puede ser null
    address?: string | null; // Opcional y puede ser null
    city?: string | null; // Opcional y puede ser null
    password?: string; // Aunque no lo mostramos en la tabla, está en el modelo
    image?: string | null; // Opcional y puede ser null
    state?: number | null; // Opcional y puede ser null
    createdAt?: Date; // Opcional si lo usas en algún lugar
    roles?: {
        id: string;
        userId: string | null;
        roleId: string | null;
        role?: {
            id: string;
            name: string;
            state: number;
        } | null;
    }[];
}

export interface UserQueryWithDetails {
    id: string;
    email: string | null;
    name: string | null;
    lastName: string | null;
    phone: string | null;
    birthdate: Date | null;
    address: string | null;
    city: string | null;
    image?: string | null;
}

export interface ChangePassModalProps {
    id: string;
    open: boolean;
    onCloseAction: (open: boolean) => void;
    refresh?: () => void; // opcional
    signOut?: () => Promise<void>; // opcional
    successMessage: string;
    shouldSignOut?: boolean; // indica explícitamente si debe cerrar sesión
    signOutDelay?: number; // opcional: tiempo antes de cerrar sesión
}
