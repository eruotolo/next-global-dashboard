import Image from 'next/image';
import Link from 'next/link';

import { ForgotPassword } from '@/components/Login/forgotPassword';
const logo: string = '/logo-sm-wh.svg';

export default function RecoveryPage() {
    return (
        <div className="flex flex-col gap-6 justify-center items-center p-6 md:p-10 bg-muted min-h-svh">
            <div className="flex flex-col gap-6 w-full max-w-sm">
                <Link href="#" className="flex gap-2 items-center self-center font-medium">
                    <div className="flex justify-center items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={480}
                            height={473}
                            className="h-[23px] w-[24px]"
                        />
                    </div>
                    <div className="grid flex-1 text-sm leading-tight text-left">
                        <span className="font-semibold truncate text-[16px]">Chubby</span>
                        <span className="truncate text-[11px]">Dashboard</span>
                    </div>
                </Link>
                <ForgotPassword />
            </div>
        </div>
    );
}
