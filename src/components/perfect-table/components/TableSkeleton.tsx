// Skeleton mejorado para loading states

import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    showHeader?: boolean;
    showActions?: boolean;
}

export function TableSkeleton({
    rows = 5,
    columns = 4,
    showHeader = true,
    showActions = true,
}: TableSkeletonProps) {
    return (
        <div className="space-y-4">
            {/* Header skeleton */}
            {showHeader && (
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                </div>
            )}

            {/* Search skeleton */}
            <Skeleton className="h-10 w-full max-w-sm" />

            {/* Table skeleton */}
            <div className="rounded-lg border">
                {/* Table header */}
                <div className="border-b p-4">
                    <div className="flex items-center space-x-4">
                        {Array.from({ length: columns }).map((_, i) => (
                            <Skeleton key={i} className="h-4 flex-1" />
                        ))}
                        {showActions && <Skeleton className="h-4 w-20" />}
                    </div>
                </div>

                {/* Table rows */}
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="border-b p-4 last:border-b-0">
                        <div className="flex items-center space-x-4">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <div key={colIndex} className="flex-1">
                                    {colIndex === 0 ? (
                                        <div className="flex items-center space-x-2">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    ) : (
                                        <Skeleton className="h-4 w-full" />
                                    )}
                                </div>
                            ))}
                            {showActions && <Skeleton className="h-8 w-8" />}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </div>
    );
}

// Skeletons especializados
export function UserTableSkeleton() {
    return <TableSkeleton columns={5} showActions={true} />;
}

export function RoleTableSkeleton() {
    return <TableSkeleton columns={3} showActions={true} />;
}

export function TicketTableSkeleton() {
    return <TableSkeleton columns={6} showActions={true} />;
}
