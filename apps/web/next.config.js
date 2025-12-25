/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "s3.twcstorage.ru", pathname: "/**" },
        ],
    },
};

module.exports = nextConfig;
