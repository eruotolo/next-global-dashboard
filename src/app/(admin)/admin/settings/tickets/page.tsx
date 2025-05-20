import TicketTable from '@/components/Tables/Setting/Ticket/TicketTable';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function TicketsPage() {
    return (
        <ProtectedRoute roles={['Usuario', 'Administrador', 'SuperAdministrador']}>
            <div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <div className="col-span-1 p-6 rounded-xl md:col-span-2 bg-muted/50 aspect-video">
                        <TicketTable />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
