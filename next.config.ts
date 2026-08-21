const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
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
