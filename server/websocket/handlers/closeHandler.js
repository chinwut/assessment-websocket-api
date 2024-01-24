const logger = require('../../logger');

function closeHandler(ws, reason) {
  logger.info(`Connection closed. Reason: ${reason}`);
}

module.exports = closeHandler;
