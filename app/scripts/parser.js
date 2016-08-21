'use strict';

/**
 * Functions for parsing Whatsapp files.
 */

/**
 * Convert raw string content into an array of lines. Similar to Python's
 * readlines method.
 *
 * @param {string} str the raw content from the file read
 *
 * @return {Array<string>} an array of string contents of the file
 */
exports.readLines = function(str) {
  var result = str.split(/\r\n|\n/);
  return result;
};
