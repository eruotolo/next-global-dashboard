import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    devIndicators: {
        position: 'bottom-right',
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.public.blob.vercel-storage.com',
                port: '',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/admin',
                destination: '/admin/dashboard',
                permanent: true,
            },
            {
                source: '/admin/settings',
                destination: '/admin/settings/users',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
