const colors = require('colors');

module.exports = {
  stringify(json) {
    // These are the settings npm uses
    return JSON.stringify(json, null, 2) + '\n';
  },

  extractComments(raw) {
    return raw.split('\n').reduce((currentArr, line, index, oldArr) => {
      const value = line && line.match(/^\s*#/) ? line : '';
      oldArr[index] = value;
      if (value && (index === 0 || currentArr.length === 0)) currentArr.push(value);
      else if (value && oldArr[index - 1]) currentArr[currentArr.length - 1] += ('\n' + value);
      else if (value) currentArr.push(value);
      return currentArr;
    }, []);
  },

  testComment(line) {
    return /^\s*#/.test(line);
  },

  longestTaskLength(tasks) {
    return tasks.reduce((max, task) => {
      return Math.max(max, task.length);
    }, 0);
  },

  createSpace(n) {
    return new Array(n + 1).join(' ');
  },

  createHelpRegex(keys) {
    return new RegExp(`^\\s*#\\s*(${keys.join('|')}):\\s+`);
  },

  formatComments(comments, keys, options) {
    const helpRegex = this.createHelpRegex(keys);
    const hashRegex = /^\s*#\s*/;
    const spacer = this.longestTaskLength(keys) + options.buffer;
    const keysLeft = new Set(keys);

    return comments
      .map(comment => {
        if (!comment.match(helpRegex)) return;
        return comment.split('\n').map(line => {
          const matches = line.match(helpRegex);
          if (matches) {
            const task = matches[1];
            keysLeft.delete(task);
            const additionalSpace = this.createSpace(spacer - task.length);
            line = line.replace(matches[0], '');
            line = `${colors.yellow(task)}${additionalSpace}${line}`;
          } else {
            line = line.replace(hashRegex, this.createSpace(spacer));
          }
          return this.createSpace(options.indent) + line;
        }).join('\n');
      })
      .filter(comment => comment)
      .join(options.taskSeparator);
  }
};
