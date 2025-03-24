'use client';

import { PropagateLoader } from 'react-spinners';

export default function Loading() {
    return (
        <>
            <div className="flex justify-center items-center mt-[10px] h-[50px]">
                <PropagateLoader color="#171717" size={12} loading={true} />
            </div>
        </>
    );
}
