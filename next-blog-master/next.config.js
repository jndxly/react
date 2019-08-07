/* eslint-disable */
const withLess = require('@zeit/next-less')
const withCss = require("@zeit/next-css");
const images = require('next-images');
const withPlugins = require("next-compose-plugins");


module.exports = withPlugins([
    [withLess, {
        lessLoaderOptions: {
            javascriptEnabled: true,
            importLoaders: 1,
            localIdentName: "[local]___[hash:base64:5]",

        }
    }],
    images,
],{

    distDir: 'build'
})

// module.exports =   withLess(
//   {
//     lessLoaderOptions: {
//       javascriptEnabled: true,
//       importLoaders: 1,
//       localIdentName: "[local]___[hash:base64:5]",
//
//     },
//     distDir: 'build'
//   }
// )
