/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Polyfill を確実に読み込むための設定
  webpack: (config) => {
    // 必要ならここで追加の Polyfill をバンドルに含める
    config.entry = async () => {
      const entries = await config.entry();
      if (entries["main.js"] && !entries["main.js"].includes("./polyfills.js")) {
        entries["main.js"].unshift("./polyfills.js");
      }
      return entries;
    };
    return config;
  },
};

module.exports = nextConfig;
