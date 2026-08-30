import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 프로필 사진은 소유자가 직접 입력한 URL이므로 https 원격 이미지를 허용합니다.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
