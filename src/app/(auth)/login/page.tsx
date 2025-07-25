import Image from 'next/image';
import Link from 'next/link';

import { LoginForm } from '@/components/Login/LoginForm';

const logo: string = '/logo-sm-wh.svg';

export default function LoginPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={480}
                            height={473}
                            className="h-[23px] w-[24px]"
                        />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate text-[16px] font-semibold">Chubby</span>
                        <span className="truncate text-[11px]">Dashboard</span>
                    </div>
                </Link>
                <LoginForm />
            </div>
        </div>
    );
}
