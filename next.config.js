/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: function (config, options) {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    config.experiments = { ...config.experiments, asyncWebAssembly: true }
    return config
  },
}

module.exports = nextConfig
