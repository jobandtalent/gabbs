'use strict';
const path = require('path');

module.exports = {
  /**
   * @method _failure
   * @param {Error|undefined| err
   * @return {Promise}
   * @private
   */
  _failure(err) {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  },

  /**
   * @param {String} commandFolder
   * @param {Command|null} DefaultCommand
   * @method start
   * @public
   */
  start(DefaultCommand) {
    const args = process.argv.slice(2);
    if (args.length < 1) {
      return this._failure();
    }

    try {
      const CommandRunner = require(`${path.dirname(require.main.filename)}/command/${args[0].replace('--', '')}`);
      const runner = new CommandRunner(args);
      let runnerResult;

      let defaultCommand = null;
      if (typeof DefaultCommand !== 'undefined') {
        defaultCommand = new DefaultCommand(args);
      }

      if (!(defaultCommand === null || runner instanceof DefaultCommand)
          && runner.getHomeConfig() !== null) {
        runnerResult = defaultCommand.run().then(() => runner.run());
      } else {
        runnerResult = runner.run();
      }

      return runnerResult;
    } catch (e) {
      return this._failure(e);
    }
  }
};
