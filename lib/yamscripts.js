const yaml = require('yamljs');
const path = require('path');
const fs = require('fs');
const colors = require('colors');

function stringify(json) {
  // These are the settings npm uses
  return JSON.stringify(json, null, 2);
}

function extractComments(raw) {
  return raw.split('\n').reduce((currentArr, line, index, oldArr) => {
    const value = line && line.match(/^\s?#/) ? line : '';
    if (value && (index === 0 || currentArr.length === 0)) currentArr.push(value);
    else if (value && oldArr[index - 1]) currentArr[currentArr.length - 1] += ('\n' + value);
    else if (value) currentArr.push(value);
    return currentArr;
  }, []);
}

function testComment(line) {
  return /^\s*#/.test(line);
}

function longestTaskLength(tasks) {
  return tasks.reduce((max, task) => {
    return Math.max(max, task.length);
  }, 0);
}

function createSpace(n) {
  return new Array(n + 1).join(' ');
}

function formatComments(comments, keys) {
  const INDENT = 2;
  const BUFFER = 2;
  const helpRegex = new RegExp(`^\\s*#\\s*(${keys.join('|')}):\\s*`);
  const hashRegex = /^\s*#\s*/g;
  const spacer = longestTaskLength(keys) + BUFFER;
  return comments
    .map(comment => {
      if (!comment.match(helpRegex)) return;
      return comment.split('\n').map(line => {
        const matches = line.match(helpRegex);
        if (matches) {
          const task = matches[1];
          const additionalSpace = createSpace(spacer - task.length);
          line = line.replace(matches[0], '');
          line = `${colors.yellow(task)}${additionalSpace}${line}`;
        } else {
          line = line.replace(hashRegex, createSpace(spacer));
        }
        return createSpace(INDENT) + line;
      }).join('\n');
    })
    .filter(comment => comment)
    .join('\n');
}

class YamScripts {
  getComments(raw, keys) {
    const results = [];
    raw.split('\n').reduce((prev, current) => {
      const isComment = testComment(current);
      if (!isComment) return current;
      else if (testComment(prev)) results[results.length - 1] += ('\n' + current);
      else results.push(current);
      return current;
    });
    return formatComments(results, keys);
  }
}
