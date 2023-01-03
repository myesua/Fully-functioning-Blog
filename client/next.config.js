/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: { ignoreDuringBuilds: true },
  env: {
    POSTS_URL: process.env.POSTS_URL,
    TIPS_URL: process.env.TIPS_URL,
    CATEGORIES_URL: process.env.CATEGORIES_URL,
    USER_DASHBOARD_URL: process.env.USER_DASHBOARD_URL,
    UPLOAD_IMAGE_URL: process.env.UPLOAD_IMAGE_URL,
    UPDATE_PROFILE_URL: process.env.UPDATE_PROFILE_URL,
    UPDATE_URL: process.env.UPDATE_URL,
    RECOVERY_URL: process.env.RECOVERY_URL,
    RESET_URL: process.env.RESET_URL,
    REFRESH_URL: process.env.REFRESH_URL,
    LOGIN_URL: process.env.LOGIN_URL,
    LOGOUT_URL: process.env.LOGOUT_URL,
    ADMIN_URL: process.env.ADMIN_URL,
    PENDING_URL: process.env.PENDING_URL,
    REJECTED_URL: process.env.REJECTED_URL,
  },
  images: {
    domains: ['res.cloudinary.com', 'cdn.pixabay.com'],
  },
  experimental: {
    images: { allowFutureImage: true },
    largePageDataBytes: 128 * 100000,
  },
};

module.exports = nextConfig;
