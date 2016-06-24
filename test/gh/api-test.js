/* eslint-env mocha */
'use strict';

const expect = require('expect.js');
const GHApi = require('../../src/gh/api');
const sinon = require('sinon');

describe('GHApi', () => {
  let api = null;

  beforeEach(() => {
    api = new GHApi();
  });

  it('decodes properly a base64 string', () => {
    const base64String = 'dGVzdA==';

    expect(() => { api._decodeFileContent(); }).to.throwException();
    expect(api._decodeFileContent(base64String)).to.be('test');
  });

  it('sends a request to github', () => {
    const username = 'test@tld.com';
    const token = 'test-token';

    api._github.authenticate = () => {};

    const apiSpy = sinon.spy(api._github, 'authenticate');

    expect(api._github.authenticate.calledOnce).to.be(false);
    expect(api.connect(username, token)).to.be();
    sinon.assert.calledOnce(api._github.authenticate);

    const spyCall = apiSpy.getCall(0);
    expect(spyCall.args[0].username).to.be(username);
  });

  it('gets a file', (done) => {
    const user = 'test-user';
    const repo = 'test-repo';
    const path = '.';
    const ref = 'test-ref';

    api._github.repos.getContent = (params, callback) => {
      callback(false, { content: '' });
    };

    const apiSpy = sinon.spy(api._github.repos, 'getContent');

    api.getFileAtRevision(user, repo, path, ref)
    .then(() => {
      sinon.assert.calledOnce(api._github.repos.getContent);
      done();
    }).catch(() => {
      expect(false).to.be(true);
      done();
    });
  });
});
