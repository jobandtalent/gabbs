'use strict';
const winston = require('winston');

/**
 * The Logger object provides a layer on top of an error logger,
 * in order to decouple the application layer from a specific
 * logger implementation.
 *
 * @see https://github.com/winstonjs/winston
 */
const logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({ colorize: true })
  ]
});

module.exports = {
  /**
   * @param {String} message
   * @param {Boolean|undefined} raw
   * @method log
   * @public
   */
  log(message, raw) {
    /* eslint-disable no-param-reassign */
    if (typeof raw === 'undefined') {
      raw = false;
    }
    /* eslint-enable no-param-reassign */

    if (raw) {
      console.log(message); // eslint-disable-line no-console
    } else {
      logger.log('info', message);
    }
  },

  /**
   * @param {String|Object} message
   * @method error
   * @public
   */
  error(message) {
    logger.log('error', message);
  }
};
