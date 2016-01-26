#!/usr/bin/env node
'use strict';
const YamScripts = require('../lib/yamscripts');
const init = require('./init');
const args = require('minimist')(process.argv.slice(2), {alias: {
  help: 'h',
  input: 'i',
  output: 'o',
  force: 'f'
}});

if (args._[0] === 'init') {
  init(args);
} else {
  const yamScripts = new YamScripts(args);
  yamScripts.run();
}
