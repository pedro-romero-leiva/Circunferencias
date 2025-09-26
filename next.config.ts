import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  
  // Configuración para GitHub Pages
  output: 'export',
  trailingSlash: true,
  basePath: '/Circunferencias',
  assetPrefix: '/Circunferencias/',
  
  // Configuración base del proyecto
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    // Necesario para export estático
    unoptimized: true,
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;