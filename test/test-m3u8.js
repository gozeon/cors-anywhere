// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;

var createServer = require('../').createServer;
var modifyResponse = require('http-proxy-response-rewrite')

createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [],
    removeHeaders: [],
    httpProxyOptions: {
        customListeners: {
            proxyRes: function (proxyRes, req, res) {
                function replaceLinks(input) {
                    return input.replace(/https?:\/\/[^\s'"<>]+/g, (match) => {
                        return 'http://localhost:8080/' + match;
                    });
                }
                // const pathname = req.corsAnywhereRequestState.location.pathname
                // if(/\.m3u8$/i.test(pathname)) {
                if (proxyRes['headers']['content-type'] == 'application/vnd.apple.mpegurl') {
                    modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {
                        return replaceLinks(body)
                    })
                }
            }
        },
    }

}).listen(port, host, function () {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});