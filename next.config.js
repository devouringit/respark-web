// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})
module.exports = withPWA({
  // next.js config
  sassOptions: {
    includePaths: [path.join(__dirname, 'app/styles')],
  },
  typescript: {
    //true == Dangerously allow production builds to successfully complete even if  your project has type errors.
    ignoreBuildErrors: false,
  },
  images: {
    disableStaticImages: true
  },
  reactStrictMode: true
})

// module.exports = {
//   sassOptions: {
//     includePaths: [path.join(__dirname, 'app/styles')],
//   },
//   typescript: {
//     //true == Dangerously allow production builds to successfully complete even if  your project has type errors.
//     ignoreBuildErrors: false,
//   },
//   images: {
//     disableStaticImages: true
//   },
//   reactStrictMode: true
// }