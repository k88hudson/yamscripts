const utils = require('../lib/utils');
const assert = require('chai').assert;

describe('stringify', () => {
  it('should stringify an object', () => {
    const expected = `{
  "foo": "bar"
}`;
    assert.equal(utils.stringify({foo: 'bar'}), expected);
  });
});

describe('extractComments', () => {
  it('should extract comments from raw yaml with different spacing', () => {
    const sample = `
      foo: bar
      # hello world

      bar: foo
      #what's up?
      hi: hello
#     yo!
    `;
    const expected = [
      '      # hello world',
      '      #what\'s up?',
      '#     yo!'
    ];
    assert.deepEqual(utils.extractComments(sample), expected);
  });
  it('should combine adjacent comments', () => {
    const sample = `
    # hi
    # hello
    foo:bar
    # what is up
    `;
    const expected = [
      '    # hi\n    # hello',
      '    # what is up'
    ];
    assert.deepEqual(utils.extractComments(sample), expected);
  })
});

describe('testComment', () => {
  it('should return true for a comment', () => {
    assert.equal(utils.testComment('#foo'), true);
    assert.equal(utils.testComment('   #foo'), true);
    assert.equal(utils.testComment('# foo'), true);
    assert.equal(utils.testComment(' #   foo'), true);
  });
  it('should return false for something that is not a comment', () => {
    assert.equal(utils.testComment(''), false);
    assert.equal(utils.testComment('foo # foo'), false);
  });
});

describe('longestTaskLength', () => {
  it('should find the length of the longest string in a list of strings', () => {
    assert.equal(utils.longestTaskLength([
      'pan', 'pat', 'hi'
    ]), 3);
    assert.equal(utils.longestTaskLength([
      'who', 'foo:bar', 'pickle'
    ]), 7);
    assert.equal(utils.longestTaskLength([]), 0);
  });
});

describe('createHelpRegex', () => {
  it('should create a regex given a list of keys', () => {
    assert.deepEqual(
      utils.createHelpRegex(['foo', 'foo:bar', 'baz']),
      /^\s*#\s*(foo|foo:bar|baz):\s+/
    );
  });
});

describe('formatComments', () => {
  // TODO
});
