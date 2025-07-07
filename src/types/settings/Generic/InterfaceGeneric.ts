export interface UpdateData {
    refreshAction: () => void;
}

export interface EditModalProps {
    id: string;
    refreshAction: () => void;
    open: boolean;
    onCloseAction: (open: boolean) => void;
}

export interface EditModalPropsAlt {
    id: string;
    refreshAction?: () => void;
    open: boolean;
    onCloseAction: (open: boolean) => void;
    signOut?: () => Promise<void>;
}
