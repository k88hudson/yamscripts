'use strict';

const yaml = require("yamljs");
const path = require("path");
const fs = require("fs");
const colors = require("colors");

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

module.exports.getComments = function getComments(raw, keys) {
  const results = [];
  raw.split('\n').reduce((prev, current) => {
    const isComment = testComment(current);
    if (!isComment) return current;
    else if (testComment(prev)) results[results.length - 1] += ('\n' + current);
    else results.push(current);
    return current;
  });
  return formatComments(results, keys);
};


function buildScripts(raw, json, options) {
  const isNested = json.scripts && typeof json.scripts === 'object';
  const scripts = isNested ? json.scripts : json;
  const keys = Object.keys(scripts);
  const helpRegex = new RegExp(`^\\s*#\\s*(${keys.join('|')}):`);
  const comments = extractComments(raw)
    .filter(comment => helpRegex.test(comment))
    .map(comment => {
      const name = comment.match(helpRegex)[1];
      return '  ' + comment
        .replace(/#\s?/g, '')
        .replace(/\n/g, '\n  ')
        .replace(name + ':', colors.yellow(name + ' '));
    })
    .join('\n');
  const help = `================================================

Hi there!
This project is built with npm scripts.

Usage:
  npm run ${colors.grey('[command]')}

Commands:
${comments}

Have a great day!

================================================
`;
  console.log(help)
  return scripts;
}

const defaultParams = {
  cwd: '.',
  packagePath: 'package.json',
  yamPath: 'yamscripts.yml'
};

module.exports.writeScripts = function writeScripts(rawOptions) {
  const options = Object.assign({}, defaultParams, rawOptions || {});
  const packagePath = path.join(options.cwd, options.packagePath);
  const yamPath = path.join(options.cwd, options.yamPath);

  const packageJSON = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  const raw = fs.readFileSync(yamPath, "utf8")
  const json = yaml.load(yamPath);

  const scripts = buildScripts(raw, json, options);
  console.log(scripts);
  packageJSON.scripts = scripts;
  fs.writeFileSync(packagePath, stringify(packageJSON), "utf8");
}
