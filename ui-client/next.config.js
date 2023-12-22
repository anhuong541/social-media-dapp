/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["mdx", "md", "jsx", "js", "tsx", "ts"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.notion.so" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "cryptologos.cc" },
      { protocol: "https", hostname: "s2.coinmarketcap.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "www.dextools.io" },
      { protocol: "https", hostname: "assets.coingecko.com" },
      { protocol: "https", hostname: "www.forbes.com" },
      { protocol: "https", hostname: "blur.io" },
      { protocol: "https", hostname: "opensea.io" },
      { protocol: "https", hostname: "x2y2.io" },
      { protocol: "https", hostname: "cdn.simplehash.com" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
      { protocol: "https", hostname: "i.seadn.io" },
      { protocol: "https", hostname: "public.sandbox.exchange.coinbase.com" },
      { protocol: "https", hostname: "cointracking.info" },
      { protocol: "https", hostname: "assets-global.website-files.com" },
      { protocol: "https", hostname: "metacore.mobula.io" },
      // {protocol: "https", hostname: ""},
      // {protocol: "https", hostname: ""},
      // {protocol: "https", hostname: ""},
      // {protocol: "https", hostname: ""},
      // {protocol: "https", hostname: ""},
      // {protocol: "https", hostname: ""},
      // {protocol: "https", hostname: ""},
      // {protocol: "https", hostname: ""},
      // {protocol: "https", hostname: ""},
      // {protocol: "https", hostname: ""}
    ],
  },
};

module.exports = nextConfig;
