// const { createProxyMiddleware } = require('http-proxy-middleware');

// function bypassProxyMiddleware(proxyMiddleware) {
//     return function (req, res, next) {
//         // Add your URL conditions here
//         if (req.url.startsWith('/pub-8b49af329fae499aa563997f5d4068a4')) {
//             req.url = req.url.replace(/^\/pub-8b49af329fae499aa563997f5d4068a4/, 'https://pub-8b49af329fae499aa563997f5d4068a4.r2.dev');
//             next(); // Bypass the proxy and continue to the next middleware
//         } else {
//             // Use the proxy middleware for other requests
//             proxyMiddleware(req, res, next);
//         }
//     };
// }

// module.exports = function (app) {
//     const proxyMiddleware = createProxyMiddleware({
//         target: 'https://stablediffusionapi.com',
//         changeOrigin: true,
//         secure: false,
//     });

//     app.use('/api', bypassProxyMiddleware(proxyMiddleware));
// };