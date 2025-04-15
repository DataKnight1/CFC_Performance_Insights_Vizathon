let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

// Extract repository name from environment variable or use a default
const repoName = process.env.GITHUB_REPOSITORY 
  ? process.env.GITHUB_REPOSITORY.split('/')[1] 
  : 'CFC_Performance_Insights_Vizathon';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static exports for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? `/${repoName}` : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Required for static export
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'], // Allow external image sources
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
