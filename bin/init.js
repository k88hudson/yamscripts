'use strict';
const fs = require('fs-extra');
const yaml = require('yamljs');
const colors = require('colors');

const baseTemplate = (
`scripts:
  # test: Runs tests
  test: echo "Oops, no tests exist yet."
`);
module.exports = function init(options) {
  if (!options.force && fs.existsSync('yamscripts.yml')) {
    console.error(colors.red('Oops, yamscripts.yml already exists! If you really want to overwrite it, use yamscripts init --force.'));
    process.exit(1);
  }
  let packageJSON;
  try {
    packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  } catch (e) {}

  const output = packageJSON && packageJSON.scripts ? yaml.stringify({scripts: packageJSON.scripts}, null, 2) : baseTemplate;
  fs.outputFileSync('yamscripts.yml', output, 'utf8');
  console.log(colors.green('Successfully created yamscripts.yml!'));
}
