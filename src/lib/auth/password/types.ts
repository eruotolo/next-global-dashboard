export type PasswordResetType = 'user_recovery' | 'admin_reset';

export interface PasswordResetOptions {
    resetType: PasswordResetType;
    sendEmail?: boolean;
    resetByUserId?: string;
    resetByUserName?: string;
}

export interface PasswordResetResult {
    success: boolean;
    temporaryPassword?: string;
    emailSent?: boolean;
    message: string;
    error?: string;
}

export interface UserPasswordResetData {
    id: string;
    name: string;
    lastName: string | null;
    email: string;
    password: string;
}