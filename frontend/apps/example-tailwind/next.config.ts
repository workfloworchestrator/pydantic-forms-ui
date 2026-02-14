import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['pydantic-forms'],
    turbopack: {},
};

export default nextConfig;
