'use strict';

/**
 * Functions for parsing Whatsapp files.
 */

exports.NO_MSG_FOUND = 'no json found';

/**
 * A regex literal that defines the start of a message. Whatsapp doesn't
 * provide an API for this output, so we are best guessing it here. It could
 * change according to locale to which the file was exported or some other
 * terrible thing like that.
 */
exports.REGEX_MSG_START = /$[0-9](1,2)\/[0-9](1,2)\/[0-9](1,2), /;

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

/**
 * Find the start indices of all messages in str. E.g. if str contains two
 * messages, the result will have length = 2.
 *
 * @param {string} str a mess of string content in which to find message starts
 *
 * @return {Array<integer>} an array with start indices of messages
 */
exports.findMessageStarts = function(str) {
  console.log(str);
  return null;
};

/**
 * Get the index of a message start in the string.
 *
 * @param {string} str
 */
exports.getMessageStartIdx = function(str) {
  return null;
};
