export interface UserInterface {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
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
