import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from 'sonner';
import { inter } from '@/app/fonts';

export const metadata: Metadata = {
    title: 'Chubby Dashboard',
    generator: 'Next.js',
    applicationName: 'WebPage Crow Advance',
    authors: [{ name: 'Edgardo Ruotolo Cardozo', url: 'https://crowadvance.com' }],
    creator: 'Edgardo Ruotolo Cardozo',
    publisher: 'Edgardo Ruotolo Cardozo',
    category: 'Soluciones en Tecnología',
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" className={`${inter.className} antialiased`}>
            <body>
                <main>{children}</main>
                <Toaster richColors />
            </body>
        </html>
    );
}
