// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

// module.exports = withBundleAnalyzer({
//   reactStrictMode: false,
//   images: {
//     domains:["images.unsplash.com","shopee.co.th",],
//     deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
//     imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
//     minimumCacheTTL: 360,
//   },
//   experimental: { esmExternals: true,css: true,compress: true, },
//   httpAgentOptions: {
//     keepAlive: false
//   },
//   webpack: (config, {
//     buildId,
//     dev,
//     isServer,
//     defaultLoaders,
//     webpack
// }) => {

//     // Note: we provide webpack above so you should not `require` it
//     // Perform customizations to webpack config
//     config.plugins.push(
//         new webpack.ProvidePlugin({
//             $: "jquery",
//             jQuery: "jquery",
//             "window.jQuery": "jquery"
//         })
//     );
//     // Important: return the modified config
//     return config;
// }
// }
// )


module.exports = ({
  reactStrictMode: false,
  staticFolder: '/public',
  images: {
    path: `/public/`,
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 360,
  },
  experimental: { esmExternals: true, css: true, compress: true, },
  httpAgentOptions: {
    keepAlive: false
  },
  webpack: (config, {
    buildId,
    dev,
    isServer,
    defaultLoaders,
    webpack
  }) => {

    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      })
    );
    // Important: return the modified config
    return config;
  }
}
)