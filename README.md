# mCAP JavaScript Client Library
A JavaScript library to develop applications for mCAP

## Setup for development
- Install NodeJS
- Install Grunt
- Run npm install
- Run 'grunt' to start a watch task witch automatically builds the file in the dist folder
- Include 'dist/mCap.js' in your index html

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
You have to install karma-cli global
```
npm install karma-cli -g
```
To start a test use:
```
karma start karma.conf.js
```