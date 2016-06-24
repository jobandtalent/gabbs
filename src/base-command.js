'use strict';

const os = require('os');
const path = require('path');

/**
 * The base command module is used to encapsulate common functionality to the different commands.
 * @module BaseCommand
 * @param {Array} args
 * @param {Array} extraParams
 */
const BaseCommand = function(args, extraParams) {
  if (typeof args === 'undefined') {
    return;
  }

  /**
   * @type {Array} _args
   * @private
   */
  this._args = args;

  /**
   * @type {Array} _extraParams
   * @private
   */
  this._extraParams = extraParams || [];

  /**
   * @type {Object} _destinationPath
   * @private
   */
  this._destinationPath = args[args.length - 1];

  /**
   * @type {Object} _homeConfig
   * @private
   */
  this._homeConfig = null;
  // Try to read the configuration file
  try {
    const Config = require(`${path.dirname(require.main.filename)}/config/commands`);
    this._homeConfig = require(`${os.homedir()}/${Config.HOME_CONFIG}`);
  } catch (e) {
    // Nothing to do in case the file is not present.
  }
};

/**
 * We need to work with absolute paths since this it's
 * intended to be run as a global command (npm -g).
 *
 * @param {String} pathname
 * @return {String}
 * @method getAbsolutePath
 * @public
 */
BaseCommand.prototype.getAbsolutePath = function(pathname) {
  return `${path.dirname(require.main.filename)}/..${pathname}`;
};

/**
 * @return {String}
 * @method getESPath
 * @public
 */
BaseCommand.prototype.getESPath = function() {
  const Config = require(`${path.dirname(require.main.filename)}/config/commands`);
  let eslintPath = Config.Paths.JS_LINT;
  if (this._args.length > 2 && this._args[1] === '--es6') {
    eslintPath = Config.Paths.JS_LINT_ES6;
  }

  return eslintPath;
};

/**
 * @param {String} path
 * @return {String}
 * @method getDestinationPath
 * @public
 */
BaseCommand.prototype.getDestinationPath = function(path) {
  return `${this._destinationPath}/${path}`;
};

/**
 * @method getHomeConfig
 * @return {Object}
 */
BaseCommand.prototype.getHomeConfig = function() {
  return this._homeConfig;
};

module.exports = BaseCommand;
