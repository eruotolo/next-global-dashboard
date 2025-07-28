'use client';

import { useEffect } from 'react';

import AppSidebar from '@/components/Dashboard/AppSidebar';
import { DynamicBreadcrumb } from '@/components/DynamicBreadcrumb/DynamicBreadcrumb';
import SessionMonitor from '@/components/SessionMonitor/SessionMonitor';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import useAuthStore from '@/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const fetchSession = useAuthStore((state) => state.fetchSession);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    return (
        <>
            <SessionMonitor />
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <DynamicBreadcrumb />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
