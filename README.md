# Gabbs [![Build Status](https://circleci.com/gh/jobandtalent/gabbs.png?style=shield)](https://circleci.com/gh/jobandtalent/gabbs) [![npm version](https://badge.fury.io/js/%40jobandtalent%2Fgabbs.svg)](https://badge.fury.io/js/%40jobandtalent%2Fgabbs)
![npm](https://nodei.co/npm/@jobandtalent/gabbs.png?mini=true)

Library for building command line tools


### Tutorial

Let's create a command line utility called `test-gabbs`. First we need to create a bootstrap file:

`test-gabbs.js`

```javascript
const runner = require('@jobandtalent/gabbs').runner;

runner.start().then((result) => {
  console.log(result);
});
```

Now we'll add our first parameter. We want to call it `hello-world` so we'll add a file with that name in the `./command` folder.

`./command/hello-world.js`

```javascript
const BaseCommand = require('@jobandtalent/gabbs').BaseCommand;

const HelloWorld = function(args) {
  BaseCommand.call(this, args);
};

HelloWorld.prototype = new HelloWorld();

HelloWorld.prototype.run = function() {
  return new Promise((resolve) => {
    resolve('Hello world!');
  });
};

module.exports = HelloWorld;
```

Notice how in the method `run` we are returning a `Promise`, that's the way
gabbs processes asynchronous operations.

Now we can run our first parameter:

```bash
./test-gabbs --hello-world # => Will output 'Hello world!'
```

#### Arguments

You can access to the command line arguments by using the private property `_args`.

Let's use that for printing a customized message:

```javascript
HelloWorld.prototype.run = function() {
  const self = this;
  return new Promise((resolve) => {
    resolve(self._args[1]);
  });
};
```

```bash
./test-gabbs --hello-world "My custom hello world!" # => Will output 'My custom hello world!'
```

#### Logger

gabbs incorportes a logger utility in order to pretty-print output:

```javascript
const logger = require('@jobandtalent/gabbs').logger;

HelloWorld.prototype.run = function() {
  return new Promise((resolve, reject) => {
    asyncTask((err, data) => {
      if (err) {
        logger.error('Something bad happened!');
        reject();
      } else {
        logger.log('Processed finished');
        resolve(data);
      }
    });
  });
};
```

#### Running processes

In order to implement more complex commands you can use the `Spawn` object that will let you to run external tasks.

The `Spawn` object provides a layer of Promises so you can return it directly in your `run` method.

```javascript
const Spawn = require('@jobandtalent/gabbs').Spawn;

HelloWorld.prototype.run = function() {
  const process = new Spawn();
  return process.run('sh', ['./script.sh', 'first-parameter']);
};
```

You can chain subprocess execution by using [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all):

```javascript
HelloWorld.prototype.run = function() {
  ...
  return Promise.all([
    process.run('sh', ['./script.sh', 'first-parameter']),
    process.run('npm', ['install', '--dev'])
  ]);
};
```

#### Accessing to the github api

Another utility is the `GHApi` wrapper that encapsulates the [gh](https://www.npmjs.com/package/github) library in order to provide a layer of Promises for
accessing to the github api.

Suppose that we want to add a new parameter to our tool that reads a file from github:

`./command/github-test.js`

```javascript
const GHApi = require('@jobandtalent/gabbs').GHApi;

GithubTest.prototype.run = function() {
  const api = new GHApi();
  // Here you will need to create a github application token
  // @see https://help.github.com/articles/creating-an-access-token-for-command-line-use/
  api.connect('username', 'github-token');

  return new Promise((resolve, reject) => {
    api.getFileAtRevision(self._args[1], self._args[2], self._args[3])
    .then((file) => {
       resolve(file.content);
     });
  });
};
```

Now, with this command we have a way of reading from command line any file from github:

```bash
# Output package.json file from the jobandtalent/gabbs repository
./test-gabbs --github-test jobandtalent gabbs package.json
```

The `GHApi` object provides the following methods:

```javascript
connect = function(username, token) {};
getFilesFromPullRequest = function(user, repo, id) {};
getFileAtRevision = function(user, repo, path, ref) {};
extractRepoInfoFromUrl = function(url) {};
createRelease = function(owner, repo, tag) {};
```

### License

Apache 2

### Maintainer

[Jobandtalent Frontend Guild](mailto:frontend.team@jobandtalent.com)
