'use strict';

const express = require('express');

const fs = require('fs');
const path = require('path');

module.exports = () => {
  const router = express.Router();
  const routes_filelist = read_recursive_dir('routes');
  const routes_mapping = generate_route_mapping('routes', routes_filelist);

  console.debug('Loading app routes');
  console.debug('------------------------------');
  routes_mapping.forEach((i) => {
    const rf = require(i.require_path);

    console.debug('/api' + i.route);
    router.use(i.route, rf());
  });

  console.debug('------------------------------');
  console.debug('App routes loaded successfully\n');

  return router;
};

/**
 * Recursively reads a directory and its subdirectories to collect a list of file.
 *
 * @param {string} dir - The directory to start the recursive reading from.
 * @param {string[]} [filelist=[]] - An optional parameter which defaults to an empty array and is used to accumulate the file paths found during the recursive traversal.
 * @returns {string[]} An array containing the paths of all files found in the directory and its subdirectories.
 * @throws {Error} Throws an error if there is an issue during the directory traversal.
 */
function read_recursive_dir(dir, filelist = []) {
  try {
    const path_dir = path.join(process.cwd(), 'src', 'config', dir);
    const files = fs.readdirSync(path_dir);

    // Iterate over each file/directory in the directory
    for (const file of files) {
      const file_path = path.join(path_dir, file);
      const file_stats = fs.statSync(file_path);
      // If it's a directory, recursively call read_recursive_dir
      if (file_stats.isDirectory()) {
        filelist = read_recursive_dir(path.join(dir, file), filelist);
      } else {
        // If it's a file and doesn't start with a dot, add it to the filelist
        if (!file.startsWith('.')) {
          filelist.push(path.join(dir, file));
        }
      }
    }

    // Return the accumulated filelist
    return filelist;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Generates route mappings based on directory and file list.
 * @param {string} dir - The directory path.
 * @param {string[]} filelist - Array of file paths.
 * @returns {Object[]} Array of route mappings.
 * @throws {Error} Throws an error if an error occurs during processing.
 */
function generate_route_mapping(dir, filelist) {
  try {
    const route_mapping = [];

    // Loop through each file in the list
    filelist.forEach((file) => {
      const relative_path = path.relative(dir, file);
      // Generate route based on relative path, replacing backslashes with forward slashes and removing '.js' extension
      const route = '/' + relative_path.replace(/\\/g, '/').replace(/\.js$/, '');
      // Construct require path for the file
      const require_path = './' + dir + route;

      // Check if the file is an index.js file
      // If it's an index file, push route mapping without '/index' in route
      if (relative_path.includes('index.js')) {
        route_mapping.push({
          route: route.replace('/index', ''),
          require_path,
          filename: path.basename(file),
        });

        // Check if the file name matches the last directory in the relative path
        // If it matches, push route mapping with directory name instead of file name
      } else if (
        path.basename(file).replace('.js', '') === relative_path.split('\\').slice(-2, -1)[0]
      ) {
        route_mapping.push({
          route: '/' + relative_path.replace(/\\/g, '/').replace('/' + path.basename(file), ''),
          require_path,
          filename: path.basename(file),
        });

        // If neither index.js nor matches directory name, push route mapping with the original route
      } else {
        route_mapping.push({
          route,
          require_path,
          file: path.basename(file),
        });
      }
    });

    check_for_duplicate_route(route_mapping);

    return route_mapping;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Checks for duplicate routes in a route mapping object.
 * @param {Array<Object>} route_mapping - The route mapping object containing route information.
 * @throws {Error} Throws an error if duplicate routes are found.
 */
function check_for_duplicate_route(route_mapping) {
  const duplicate_routes = [];

  // Extracting route values from the route mapping object
  const value_arr = route_mapping.map((i) => {
    return i.route;
  });

  // Checking for duplicates using the 'some' method
  const is_duplicate = value_arr.some((item, idx) => {
    // If the index of the current item is not equal to its first occurrence index,
    // it means the item is a duplicate
    if (value_arr.indexOf(item) != idx) {
      duplicate_routes.push(item);
    }
    return value_arr.indexOf(item) != idx;
  });

  // If duplicates are found, throw an error
  if (is_duplicate) {
    throw new Error(
      `Cannot exist two or more files for the same route mapping: "${duplicate_routes[0]}"`
    );
  }
}
