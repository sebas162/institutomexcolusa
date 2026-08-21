const nextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/academic-programs/usa', destination: '/academic-programs', permanent: true },
      { source: '/academic-programs/mexico', destination: '/academic-programs', permanent: true },
      { source: '/academic-programs/colombia', destination: '/academic-programs', permanent: true },
    ];
  },
};

export default nextConfig;
