import type { NextConfig } from 'next'

/**
 * Next.js configuration optimized for App Router best practices.
 * 
 * Architecture decisions:
 * - Experimental features are enabled for optimal performance
 * - Optimized for server components and streaming
 */
const nextConfig: NextConfig = {
  // Enable React compiler optimizations
  reactStrictMode: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  },
}

export default nextConfig
