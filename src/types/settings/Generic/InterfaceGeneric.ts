export interface UpdateData {
    refreshAction: () => void;
}

export interface EditModalProps {
    id: string;
    refresh: () => void;
    open: boolean;
    onClose: (open: boolean) => void;
}

export interface EditModalPropsAlt {
    id: string;
    refreshAction?: () => void;
    open: boolean;
    onClose: (open: boolean) => void;
    signOut?: () => Promise<void>;
}
