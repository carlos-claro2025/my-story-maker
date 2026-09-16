/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // O editor real é o estático em public/index.html
      { source: '/editor', destination: '/index.html', permanent: false },
    ];
  },
};

module.exports = nextConfig;
