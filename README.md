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

