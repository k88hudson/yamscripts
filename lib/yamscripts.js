'use strict';
const yaml = require('yamljs');
const path = require('path');
const fs = require('fs');
const colors = require('colors');
const utils = require('./utils');

const DEFAULT_OPTIONS = {
  _: ['compile'],
  cwd: '.',
  input: 'package.json',
  output: 'yamscripts.yml',
  indent: 4,
  buffer: 2,
  taskSeparator: '\n'
};

module.exports = class YamScripts {

  constructor(args) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, args || {});
  }

  getComments(raw, keys) {
    const results = [];
    raw.split('\n').reduce((prev, current) => {
      const isComment = utils.testComment(current);
      if (!isComment) return current;
      else if (utils.testComment(prev)) results[results.length - 1] += ('\n' + current);
      else results.push(current);
      return current;
    }, '');
    return utils.formatComments(results, keys, this.options);
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

  buildScripts(raw, json) {
    function isNested(item) {
      return item && typeof item === 'object';
    }
    function compileScript(text) {
      if (!text) return '';
      return text.replace(/=>/g, 'npm run ');
    }
    function createSequenceScript(prefix, key, script) {
      let options = '';
      if (script._) return script._;
      if (script._parallel) options += '--parallel ';
      if (script._series) options += '--series ';
      return `npm-run-all ${options}${prefix}${key}`;
    }
    const base = isNested(json.scripts) ? json.scripts : json;
    const scripts = {};
    function createScript(obj, prefix) {
      prefix = prefix || '';
      Object.keys(obj).forEach(key => {
        if (/^_/.test(key)) return;
        const script = obj[key];
        if (isNested(script)) {
          scripts[prefix + key] = createSequenceScript(prefix, key, script);
          createScript(script, `${prefix}${key}:`);
        } else if (key === 'pre' || key === 'post') {
          scripts [key + prefix.replace(/:$/, '')] = compileScript(script);
        } else {
          scripts[prefix + key] = compileScript(script);
        }
      });
    }
    createScript(base);
    return scripts;
  }

  addExtras(userScripts) {
    const scripts = Object.assign({
      __: '# NOTE: THESE SCRIPTS ARE COMPILED!!! EDIT yamscripts.yml instead!!!'
    }, userScripts);

    if (!scripts.help) scripts.help = 'yamscripts help';
    if (!scripts.yamscripts) scripts.yamscripts = "yamscripts compile";
    return scripts;
  }

  run() {
    const options = this.options;
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
    const scripts = this.buildScripts(raw, json);

    if (command === 'help') {
      this.outputHelp(raw, Object.keys(scripts));
    } else if (command === 'compile') {
      packageJSON.scripts = this.addExtras(scripts);
      fs.writeFileSync(packagePath, utils.stringify(packageJSON), "utf8");
    }
  }

};
