import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        domains: ['ne03u8ci5d2wddbb.public.blob.vercel-storage.com'],
        // O alternativamente, usa remotePatterns para más flexibilidad
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.public.blob.vercel-storage.com',
            },
        ],
    },
};

export default nextConfig;
