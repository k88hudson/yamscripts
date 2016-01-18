'use strict';
const yaml = require('yamljs');
const path = require('path');
const fs = require('fs');
const colors = require('colors');
const stringEscape = require('js-string-escape');
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

function createHelpRegex(keys) {
  return new RegExp(`^\\s*#\\s*(${keys.join('|')}):\\s+`);
}

function formatComments(comments, keys) {
  const INDENT = 4;
  const BUFFER = 2;
  const TASK_SEPARATOR = '\n';
  const helpRegex = createHelpRegex(keys);
  const hashRegex = /^\s*#\s*/;
  const spacer = longestTaskLength(keys) + BUFFER;

  const keysLeft = new Set(keys);
  console.log(keysLeft);
  const formattedComments = comments
    .map(comment => {
      if (!comment.match(helpRegex)) return;
      return comment.split('\n').map(line => {
        const matches = line.match(helpRegex);
        if (matches) {
          const task = matches[1];
          keysLeft.delete(task);
          const additionalSpace = createSpace(spacer - task.length);
          line = line.replace(matches[0], '');
          line = `${colors.yellow(task)}${additionalSpace}${line}`;
        } else {
          line = line.replace(hashRegex, createSpace(spacer));
        }
        return createSpace(INDENT) + line;
      }).join('\n');
    })
    .filter(comment => comment);
  console.log(keysLeft);
  return formattedComments.join(TASK_SEPARATOR);
}

const defaultParams = {
  cwd: '.',
  input: 'package.json',
  output: 'yamscripts.yml'
};

module.exports = class YamScripts {

  getComments(raw, keys) {
    const results = [];
    raw.split('\n').reduce((prev, current) => {
      const isComment = testComment(current);
      if (!isComment) return current;
      else if (testComment(prev)) results[results.length - 1] += ('\n' + current);
      else results.push(current);
      return current;
    }, '');
    return formatComments(results, keys);
  }

  outputHelp(raw, keys) {
    const comments = this.getComments(raw, keys);
    const help = `${colors.grey('===============YAMSCRIPTS===============')}

  Hi there!
  This project is built with npm scripts.

  Usage:
    npm run ${colors.yellow('[command]')}

  Commands:
${comments}

  Have a great day!

${colors.grey('=======================================')}
  `;
    process.stdout.write(help);
  }

  buildScripts(raw, json, options) {
    const isNested = json.scripts && typeof json.scripts === 'object';
    return isNested ? json.scripts : json;
  }

  addExtras(userScripts, options) {
    const scripts = Object.assign({
      __: '# NOTE: THESE SCRIPTS ARE COMPILED!!! EDIT yamscripts.yml instead!!!'
    }, userScripts);

    // TODO actually make this work
    if (!scripts.help) scripts.help = 'yamscripts help';

    if (!scripts.yamscripts) scripts.yamscripts = "yamscripts compile";
  }

  run(rawOptions) {
    const options = Object.assign({}, defaultParams, rawOptions || {});
    const command = options._[0];
    const packagePath = path.join(options.cwd, options.input);
    const yamPath = path.join(options.cwd, options.output);

    let packageJSON;
    let raw;

    try {
      packageJSON = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    } catch (e) { throw new Error(`It looks like there's no package.json at ${packagePath} `); }

    try {
      raw = fs.readFileSync(yamPath, "utf8");
    } catch (e) { throw new Error(`It looks like there's no yamscripts file at ${yamPath} `)}

    const json = yaml.parse(raw);
    const scripts = this.buildScripts(raw, json, options);

    if (command === 'help') {
      this.outputHelp(raw, Object.keys(scripts));
    } else if (command === 'compile') {
      packageJSON.scripts = this.addExtras(scripts, options);
      fs.writeFileSync(packagePath, stringify(packageJSON), "utf8");
    }
  }

}
