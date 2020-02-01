const https = require('https');
const url = require('url');

// @param Object|String options http request options or URL
// @example:
// {
//     hostname: 'flaviocopes.com',
//     port: 443,
//     path: '/todos',
//     method: 'GET'
// }
module.exports = options => {
    if (typeof options === 'string') {
        options = url.parse(options);
    }

    let data = '';

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            res.on('data', (d) => {
                data += d;
            });

            res.on('end', () => {
                resolve(data);
            });
        });

        req.on('error', error => {
            reject(error);
        });

        req.end();
    });
};
