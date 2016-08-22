'use strict';

/**
 * Functions for parsing Whatsapp files.
 */

exports.NO_MSG_FOUND = 'no json found';

/**
 * The maximum number of messages we allow. This is here mostly to avoid being
 * caught in an infinite while loop.
 */
exports.MAX_MESSAGES = 100;

/** The flag we return if we don't find a match in a string. */
var FLAG_NO_MATCH = -1;

/**
 * A regex literal that defines the start of a message. Whatsapp doesn't
 * provide an API for this output, so we are best guessing it here. It could
 * change according to locale to which the file was exported or some other
 * terrible thing like that.
 *
 * We're basically just saying match the beginning of the string, a date, and
 * then a comma followed by a space..
 */
exports.REGEX_MSG_START = /(^|\n)[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{1,2}, /;

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
  var result = [];
  // This feels ugly, as we're creating lots of strings. Is there a native
  // regex way to do this?
  var nextStart = exports.getMessageStartIdx(str);
  var numFound = 0;
  while (nextStart !== FLAG_NO_MATCH && numFound <= exports.MAX_MESSAGES) {
    numFound++;
    result.push(nextStart);
    nextStart = exports.getMessageStartIdx(str.substring(nextStart));
  }
  return result;
};

/**
 * Get the index of a message start in the string.
 *
 * @param {string} str
 */
exports.getMessageStartIdx = function(str) {
  var match = exports.REGEX_MSG_START.exec(str);
  if (!match) {
    return FLAG_NO_MATCH;
  }
  return match.index;
};
