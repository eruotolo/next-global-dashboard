'use client';

import { PropagateLoader } from 'react-spinners';

export default function Loading() {
    return (
        <>
            <div className="mt-[10px] flex h-[50px] items-center justify-center">
                <PropagateLoader color="#171717" size={12} loading={true} />
            </div>
        </>
    );
}
