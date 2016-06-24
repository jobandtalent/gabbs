'use strict';
/**
 * Module on top of 'spawn' in order to ease its usage
 */

/**
 * @constructor
 */
const Spawn = function() {
};

/**
 * @param {String} command
 * @param {String} parameters
 * @param {Function|undefined} onDataListener
 * @return {Promise}
 * @method run
 * @public
 */
Spawn.prototype.run = function(command, params, options) {
  const childProcess = require('child_process');

  /* eslint-disable no-param-reassign */
  if (typeof options === 'undefined') {
    options = {};
  }
  /* eslint-enable no-param-reassign */

  return new Promise((resolve, reject) => {
    const workerProcess = childProcess.spawn(command, params, options);

    let output = '';
    if (workerProcess.stdout !== null) {
      workerProcess.stdout.setEncoding('utf8');
      workerProcess.stdout.on('data', (data) => {
        output += data;
      });
    }

    if (workerProcess.stderr !== null) {
      workerProcess.stderr.setEncoding('utf8');
      workerProcess.stderr.on('data', (err) => reject(err));

      workerProcess.stderr.on('close', () => {
        resolve(output);
      });
    }
  });
};

module.exports = Spawn;
