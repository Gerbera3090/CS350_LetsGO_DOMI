// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  //reactStrictMode: false, // React Strict Mode 비활성화
  basePath: "/front", // 기본 경로 설정
  env: {
    API_URL: "http://localhost",
  },
};

export default nextConfig;
