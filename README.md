[![Build Status](https://travis-ci.org/mwaylabs/mcapjs-client.svg)](https://travis-ci.org/mwaylabs/mcapjs-client)

# mCAP JavaScript Client Library
A JavaScript library to develop applications for mCAP. You will find more informations about mCAP [here](http://mobility-platform.com).

## Setup for development
- Install NodeJS
- Install Grunt
- Run npm install
- Run 'grunt' to start a watch task witch automatically builds the file in the dist folder
- Include 'dist/mcap.js' in your index html

## Before you commit
- Make sure you pass the jshint test
- You can setup a before commit-hook
  * Create a file in ./.git/hooks named pre-commit with the following content
  * ```
       #!/bin/sh 
       grunt jshint  
     ```

  * Make sure you set the file permissions to executable `$ chmod +x pre-commit`

## Tests

### Install Jasmine: 
We use Jasmine version 2.0.0 as test suite.
You find further information here:
[Jasmine version 2.0.0](http://jasmine.github.io/2.0/introduction.html)

To install the [node version of Jasmine](https://github.com/mhevery/jasmine-node) run:

```
npm install jasmine-node -g
```

### Run Karma:

We use [Karma](http://karma-runner.github.io/0.12/index.html) as test runner.
To run the tests you have to complete the following steps. We are working on a solution to make the setup a bit easier

You have to install karma-cli global
```
npm install karma-cli -g
```
Install PhantomJS
```
npm install phantomjs -g
```
Set phantomjs env variable
```
export PHANTOMJS_BIN=$(which phantomjs)
```

To start a test use:
```
karma start karma.conf.js
// or
grunt test
```

It is also possible to test against a running server:
Add a `online.conf.js` file to the root:

```
window.USERNAME = window.USERNAME || 'username';
window.ORGANIZATION = window.ORGANIZATION || 'org';
window.PASSWORD = window.PASSWORD || 'password';
```


```
karma start karma.online.conf.js
```

## Documentation
[Documentation](https://wiki.mwaysolutions.com/confluence/display/mCAP/Getting+Started+with+mCAPjs-client)

## Changelog
[Changelog](https://github.com/mwaylabs/mcapjs-client/blob/master/changelog.md)