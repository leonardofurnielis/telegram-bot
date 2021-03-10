'use strict';

const readRecursiveDirectory = require('../../services/read-recursive-directory');

describe('[Function] readRecursiveDirectory', () => {
  test('Should return a list of config directory files', () => {
    const fileList = readRecursiveDirectory('/config');
    expect(fileList).toHaveLength(10);
  });

  test('Should return error ENOENT', () => {
    let thrownError;
    try {
      readRecursiveDirectory('/foo');
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError.code).toEqual('ENOENT');
  });
});
