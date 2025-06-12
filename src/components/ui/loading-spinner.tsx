interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
};

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
    return (
        <div
            className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeClasses[size]} text-primary`}
            role="status"
        >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]">
                Cargando...
            </span>
        </div>
    );
}
