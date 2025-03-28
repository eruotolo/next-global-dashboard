'use client';

import SessionMonitor from '@/components/SessionMonitor/SessionMonitor';
import useAuthStore from '@/store/authStore';
import { useEffect } from 'react';

import AppSidebar from '@/components/Dashboard/AppSidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import { DynamicBreadcrumb } from '@/components/DynamicBreadcrumb/DynamicBreadcrumb';

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
                    <header className="flex gap-2 items-center h-16 shrink-0">
                        <div className="flex gap-2 items-center px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <DynamicBreadcrumb />
                        </div>
                    </header>
                    <div className="flex flex-col flex-1 gap-4 p-4 pt-0">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
