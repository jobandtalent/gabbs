'use strict';

/**
 * Wraps the github npm module adding a layer of promises and authentication.
 *
 * @see https://www.npmjs.com/package/github
 * @see https://developer.github.com/v3/
 * @module GHApi
 */
const GitHubApi = require('github');

const GHApi = function() {
  /**
   * @const USER_AGENT
   */
  this.USER_AGENT = 'Jobandtalent-frontend';

  /**
   * @const TIMEOUT
   */
  this.TIMEOUT = 5000;

  /**
   * @type {GitHubApi} _github
   * @private
   */
  this._github = new GitHubApi({
    version: '3.0.0',
    protocol: 'https',
    host: 'api.github.com',
    timeout: this.TIMEOUT,
    headers: {
      'user-agent': this.USER_AGENT
    }
  });
};

/**
 * Authenticates the user using basic authentication with a token,
 * some methods can be performed without requiring to be logged in, for
 * that reason we have separated connect from the constructor.
 *
 * @param {String} username
 * @param {String} token
 * @method connect
 * @see http://mikedeboer.github.io/node-github/#Client.prototype.authenticate
 * @see https://developer.github.com/v3/#authentication
 * @public
 */
GHApi.prototype.connect = function(username, token) {
  this._github.authenticate({
    type: 'basic',
    username,
    password: token
  });
};

/**
 * Returns the list of file patchs for a pull request.
 *
 * @param {String} user e.g. jobandtalent
 * @param {String} repo e.g. frontend-style-guides
 * @param {String} id A number that identifies the Pull Request, e.g. 3
 * @see http://mikedeboer.github.io/node-github/#pullRequests.prototype.getFiles
 * @see https://developer.github.com/v3/pulls/
 * @return {Promise}
 */
GHApi.prototype.getFilesFromPullRequest = function(user, repo, id) {
  const self = this;
  return new Promise((resolve, reject) => {
    self._github.pullRequests.getFiles({
      user,
      repo,
      number: id
    }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * The github api returns files encoded using base64, this method performs
 * the decoding process.
 *
 * @param {String} rawFileContent
 * @return {String}
 * @method _decodeFileContent
 * @private
 */
GHApi.prototype._decodeFileContent = function(rawFileContent) {
  return new Buffer(rawFileContent, 'base64').toString('ascii');
};

/**
 * @param {String} user
 * @param {String} repo
 * @param {String} path Absolute path to the file in the repo
 * @param {String} ref Git commit reference
 * @method getFileAtRevision
 * @return {Promise}
 * @see http://mikedeboer.github.io/node-github/#repos.prototype.getContent
 * @see https://developer.github.com/v3/repos/contents/#get-contents
 * @public
 */
GHApi.prototype.getFileAtRevision = function(user, repo, path, ref) {
  let params = {
    user,
    repo,
    path
  };

  if (typeof ref !== 'undefined') {
    params.ref = ref;
  }

  const self = this;
  return new Promise((resolve, reject) => {
    self._github.repos.getContent(params, (err, res) => {
      if (err) {
        reject(err);
      } else {
        // we need to decode the file from base64 format
        resolve({
          filename: path,
          content: self._decodeFileContent(res.content)
        });
      }
    });
  });
};

/**
 * @param {String} url
 * @return {Object}
 *  {String} user
 *  {String} repo
 *  {Number} pullRequestNumber
 * @public
 */
GHApi.prototype.extractRepoInfoFromUrl = function(url) {
  const result = url.match(/[https|http:\/\/github\.com]+\/([\w]+)\/([\w-]+)\/pull\/([\d]+)/);
  const repoInfo = {
    user: result[1],
    repo: result[2],
    pullRequestNumber: result[3]
  };

  return repoInfo;
};

/**
 * @param {String} owner e.g. 'jobandtalent'
 * @param {String} repo e.g. 'nevada'
 * @param {String} tag e.g. '2.0.0'
 * @public
 */
GHApi.prototype.createRelease = function(owner, repo, tag) {
  const self = this;
  return new Promise((resolve, reject) => {
    self._github.releases.createRelease({ owner, repo, tag_name: tag }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = GHApi;
