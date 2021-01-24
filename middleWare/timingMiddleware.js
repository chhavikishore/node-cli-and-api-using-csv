const responseTime = require('response-time');

module.exports.timingMiddleware = responseTime({ header: 'X-TIME-TO-EXECUTE'});

