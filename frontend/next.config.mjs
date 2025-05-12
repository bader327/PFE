/** 

@type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/admin', // Redirects to admin dashboard by default
        permanent: false,
      },
      {
        source: '/dashboard/admin',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/dashboard/teacher',
        destination: '/teacher',
        permanent: false,
      },
      {
        source: '/dashboard/student',
        destination: '/student',
        permanent: false,
      },
      {
        source: '/dashboard/parent',
        destination: '/parent',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;