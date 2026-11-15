/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Demo pages used to live at /animations/<slug>, before projects existed
    return [{ source: "/animations/:slug", destination: "/web/:slug", permanent: false }];
  },
};

export default nextConfig;
