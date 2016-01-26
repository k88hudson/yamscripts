const fs = require('fs-extra');

const baseTemplate = (
`scripts:
  # test: Runs tests
  test: echo "Oops, no test exist yet."
`);
module.exports = function init() {
  if (fs.existsSync('yamscripts.yml')) {
    throw new Error('yamscripts.yml already exists!');
  }
  fs.outputFileSync('yamscripts.yml', baseTemplate, 'utf8');
}
