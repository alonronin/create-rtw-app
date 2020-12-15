#!/usr/bin/env node

const meow = require('meow');
const createRtwApp = require('./');

const cli = meow(
  `
  Usage
    $ yarn create rtw-app <project-name>
  
  Options
    --force, -f         force override directory
    --no-install, -n    don't install dependencies
          
  Examples
    $ yarn create rtw-app my-project
`,
  {
    flags: {
      force: {
        type: 'boolean',
        alias: 'f',
      },
      noInstall: {
        type: 'boolean',
        alias: 'n',
      },
    },
  }
);

createRtwApp(cli).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
