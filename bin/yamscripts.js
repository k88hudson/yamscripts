const YamScripts = require('../lib/yamscripts');
const args = require('minimist')(process.argv.slice(2), {alias: {
  help: 'h',
  input: 'i',
  output: 'o'
}});
const yamScripts = new YamScripts();
yamScripts.compile(args);