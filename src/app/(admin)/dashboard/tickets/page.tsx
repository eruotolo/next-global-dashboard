import TicketTable from '@/components/Tables/Setting/Ticket/TicketTable';

export default function TicketsPage() {
    return (
        <div>
            <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                <div className="col-span-1 p-6 rounded-xl md:col-span-2 bg-muted/50 aspect-video">
                    <TicketTable />
                </div>
            </div>
        </div>
    );
}
