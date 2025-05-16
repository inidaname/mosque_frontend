/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: getEnvConfig(),
}

// export default nextConfig

module.exports = nextConfig;


function getEnvConfig() {
  const environment = process.env.TARGET_ENV || process.env.NODE_ENV;
  try {
    return require(`./env-${environment}.json`);
  } catch (err) {
    return require("./env-development.json");
  }
}
