export interface EmailConfig {
    apiKey: string;
    senderName: string;
    senderEmail: string;
}

export interface PasswordResetEmailData {
    userName: string;
    temporaryPassword: string;
    resetBy: string;
    userEmail: string;
}

export interface EmailSendResult {
    success: boolean;
    error?: string;
}