'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Read recursive directory.
 * @param {String} dir - The directory path to start read.
 * @param {Array} filelist - List of directory.
 * @returns {Array} - The complete list of directory.
 */
const readRecursiveDirectory = (dir, filelist = []) => {
  try {
    const pathDir = path.join(process.cwd(), dir);
    const files = fs.readdirSync(pathDir);
    files.forEach((file) => {
      if (fs.statSync(path.join(pathDir, file)).isDirectory()) {
        filelist = readRecursiveDirectory(path.join(dir, file), filelist);
      } else {
        filelist.push(path.join(dir, file).replace(/(\\\\|\\)/g, '/'));
      }
    });

    return filelist;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = readRecursiveDirectory;
