export interface UpdateData {
    refresh: () => void;
}

export interface EditModalProps {
    id: string;
    refresh: () => void;
    open: boolean;
    onClose: (open: boolean) => void;
}

export interface EditModalPropsAlt {
    id: string;
    refresh?: () => void;
    open: boolean;
    onClose: (open: boolean) => void;
    signOut?: () => Promise<void>;
}
