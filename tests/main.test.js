const fs = require("fs-extra");
const path = require("path");
const chai = require("chai");
const assert = chai.assert;
const colors = require('colors');
const YamScripts = require('../lib/yamscripts');
const stripAnsi = require('strip-ansi');

const sampleComments = `# foo: This is the foo task
# This is more info for it.
foo: bar
# bar:bar: This is bar.
bar:bar: foo
# this comment should not show up
# baz: This is baz!`;

const result = `
    foo      This is the foo task
             This is more info for it.
    bar:bar  This is bar.`.replace('\n', '');

describe('getComments', () => {
  it('should get format comments given some yaml text', () => {
    const yamScripts = new YamScripts();
    const actual = yamScripts.getComments(sampleComments, ['foo', 'bar:bar', 'baz']);
    console.log(actual);
    assert.equal(stripAnsi(actual), result)
  });
});

describe('compile', () => {
  it('should compile without errors', () => {
    const yamScripts = new YamScripts();
    yamScripts.run({_: ['compile'], cwd: path.join(__dirname, '../examples/simple')});
  });
  it('should compile a file with comments without errors', () => {
    const yamScripts = new YamScripts();
    yamScripts.run({_: ['compile'], cwd: path.join(__dirname, '../examples/comments')});
  });
});
