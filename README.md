# Gabbs [![Build Status](https://circleci.com/gh/jobandtalent/gabbs.png?style=shield)](https://circleci.com/gh/jobandtalent/gabbs) [![npm version](https://badge.fury.io/js/%40jobandtalent%2Fgabbs.svg)](https://badge.fury.io/js/%40jobandtalent%2Fgabbs)

Library for building command line tools

### Tutorial

If we want to create a command line utility called `test-gabbs`, first you need to create a bootstrap file that
will use the `Runner` object:

`test-gabbs.js`

```javascript
const runner = require('@jobandtalent/gabbs').runner;

runner.start().then((result) => {
  console.log(result);
});
```

Now we need to add our first parameter, for that we need to create a file with the name of the parameter in
the folder `./command` placed at the same level than `test-gabbs.js`.

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

Notice how in the previous example in the method `run` we are returning a Promise, that's the way
gabbs processes asynchronous operations.

Now you can run your first parameter for your `test-gabbs` command:

```bash
./test-gabbs --hello-world # => Will output 'Hello world!'
```

From inside a command you can access to the command line arguments by using the private property
`_args`, for example:

```javascript
HelloWorld.prototype.run = function() {
  const self = this;
  return new Promise((resolve) => {
    resolve(self._args[1]);
  });
};
```

By running `./test-gabbs --hello-world "My custom hello world!"` we will display now the custom message.

Of course you can do more complex tasks, gabbs incorportes a logger utility in order to pretty-print
output:

```javascript
const logger = require('@jobandtalent/gabbs').logger;

HelloWorld.prototype.run = function() {
  return new Promise((resolve, reject) => {
    asyncTas((err) => {
      if (err) {
        logger.error('Something bad happened!');
        reject();
      } else {
        logger.log('Processed finished');
        resolve();
      }
    });
  });
};

module.exports = HelloWorld;
```

#### Running tasks with Spawn

In order to perform more complex tasks you can use the `Spawn` object in order to run tasks in separate threads.

`Spawn` provides a layer of Promises so you can return it directly in your `run` method for simple operations.

```javascript
const Spawn = require('@jobandtalent/gabbs').Spawn;

HelloWorld.prototype.run = function() {
  const process = new Spawn();
  return process.run('sh', ['./script.sh', 'first-parameter']);
};

module.exports = HelloWorld;
```

#### Accessing to the github api

Another utility is the `GHApi` wrapper that encapsulates the `gh` library in order to provide a layer of Promises for
accessing to the github api.

Let's see an example. Suppose that we want to add a new parameter to our tool that reads a file from github as 
in:

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

Now, with this command we have a way of reading from command line any file from github, for example
`test-gabbs --github-test jobandtalent gabbs package.json` will read the `package.json` from this repository.

### License

Apache 2

### Maintainer

[Jobandtalent Frontend Guild](mailto:frontend.team@jobandtalent.com)
