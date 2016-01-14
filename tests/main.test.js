const fs = require("fs-extra");
const path = require("path");
const chai = require("chai");

// chai.use(require('chai-fs'));
const assert = chai.assert;
const colors = require('colors');
const yamScripts = require('../index');

describe('getComments', () => {
  it("get comments", () => {
    const sample = `
# foo: This is the foo task
# This is more info for it.
asdasdasd
# bar: This is bar.
asdasd
# this comment should not show up
# baz: This is baz!
`;
    console.log(yamScripts.getComments(sample, ['foo', 'bar', 'baz']));

  });
});

// describe('main', () => {
//   it('should', () => {
//     const title = /\s*#\s*(foo|bar):.+\n/g;
//     const commentRegex = /\s*#\s*.+\n/g;
//     const sample = `
// # foo: assadasd
// # asdasdsad
// asdasdasd
// # bar: bjasdja

// asdasd
// # foo
// `;
//   const lines = sample.split('\n');
//   const output = [''];
//   let index = 0;
//   lines.forEach(line => {6tfdcx
//     if (commentRegex.test(line)) output[index]
//   });
//   console.log(sample.replace(commentRegex, str => '[' + colors.green(str) + ']'));
//   // it('should create scripts', () => {
//   //   const result = yamScripts({cwd: './examples/comments'});
//   // });
// });


// function createPackageJson() {
//   fs.outputFileSync(PACKAGE_JSON_TEST_PATH,
// `{
//   "name": "test",
//   "description": "just a test"
// }
// `, 'utf8');
// }

// function createYaml() {
//   fs.outputFileSync(YAML_TEST_PATH,
// `foo: echo foo
// bar: echo bar
// `, 'utf8')
// }

// function cleanup() {
//   fs.removeSync(PACKAGE_JSON_TEST_PATH);
//   fs.removeSync(YAML_TEST_PATH);
// }

// describe("main", () => {
//   beforeEach(() => {
//     createPackageJson();
//     createYaml();
//   });
//   afterEach(cleanup);

//   it("should create scripts", () => {
//     writeScripts({packagePath: PACKAGE_JSON_TEST_PATH, yamlPath: YAML_TEST_PATH});
//     const content = JSON.parse(fs.readFileSync(PACKAGE_JSON_TEST_PATH, 'utf-8'));
//     const scripts = content.scripts;
//     assert.deepEqual(scripts, {foo: 'echo foo', bar: 'echo bar'});
//   });

// });
