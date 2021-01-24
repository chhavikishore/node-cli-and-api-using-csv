const morgan = require('morgan');
const logger = require('../logger/logger');

logger.stream = {
  write: (message) => logger.info(message.substring(0, message.lastIndexOf('\n'))),
};

module.exports = morgan(
  ':method :url status - :status response-time - :response-time ms res[content-length] - :res[content-length]',
  { stream: logger.stream },
);
