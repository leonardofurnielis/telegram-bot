'use strict';

const path = require('path');
const fs = require('fs');

const read_recursive_directory = (dir, filelist = []) => {
  try {
    const path_dir = path.join(process.cwd(), dir);
    const files = fs.readdirSync(path_dir);
    files.forEach((file) => {
      if (fs.statSync(path.join(path_dir, file)).isDirectory()) {
        filelist = read_recursive_directory(path.join(dir, file), filelist);
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

module.exports = read_recursive_directory;
