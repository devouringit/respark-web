// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
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
}