import DataTable from '@/components/Datatable/data-table';

import { columns } from '@/components/Datatable/data/columns';
import { tasks } from '@/components/Datatable/data/tasks';

export default function Table() {
    return (
        <div className="bg-muted/50 aspect-video rounded-xl">
            <div className="p-4">
                <p className="font-inter p-4">Dashboard</p>
                <DataTable data={tasks} columns={columns} />
            </div>
        </div>
    );
}
