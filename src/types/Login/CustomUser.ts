export interface CustomUser {
    id: string;
    email: string;
    name: string;
    lastName: string;
    phone?: string;
    address?: string;
    city?: string;
    image?: string;
    state?: number | null;
    roles: string[];
    permissions: string[];
}
