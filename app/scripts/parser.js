'use strict';

/**
 * Functions for parsing Whatsapp files.
 */

exports.NO_MSG_FOUND = 'no json found';

/**
 * The maximum number of messages we allow. This is here mostly to avoid being
 * caught in an infinite while loop.
 */
var MAX_MESSAGES = 100;

/** The flag we return if we don't find a match in a string. */
var FLAG_NO_MATCH = -1;

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
 * A regex literal that defines the start of a message. Whatsapp doesn't
 * provide an API for this output, so we are best guessing it here. It could
 * change according to locale to which the file was exported or some other
 * terrible thing like that.
 *
 * Returned new each time, as the lastIndex property can be set after calling
 * exec(), so this avoids pollution across invocations.
 *
 * We're basically just saying match the beginning of the string, a date, and
 * then a comma followed by a space..
 *
 * @return {regex} regex literal to match the start of a message. Set up with
 * global attribute.
 */
exports.getStartMessageRegex = function() {
  return /(^|\n)[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{1,2}, /g;
};

/**
 * Take a string and return an array of strings representing the messages. This
 * is essentially just breaking the str into message-sized chunks.
 *
 * @param {string} str a monstro string
 *
 * @return {Array<string>} array of string messages
 */
exports.extractMessages = function(str) {
  var indices = exports.findMessageStarts(str);
  var result = [];
  
  for (var i = 0; i < indices.length; i++) {
    // Only read up to the next index, except for the last one which we will
    // read until the end of the string.
    var start = indices[i];
    var end = str.length;
    if (i !== indices.length - 1) {
      // Safe to use i+1.
      end = indices[i + 1];
    }
    var msg = str.substring(start, end);
    result.push(msg);
  }

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
  var arr;
  var regex = exports.getStartMessageRegex();
  var iterations = 0;
  while ((arr = regex.exec(str)) !== null && iterations < MAX_MESSAGES) {
    result.push(arr.index);
    iterations++;
  }
  return result;
};

/**
 * Get the index of a message start in the string.
 *
 * @param {string} str
 */
exports.getMessageStartIdx = function(str) {
  var regex = exports.getStartMessageRegex();
  var match = regex.exec(str);
  if (!match) {
    return FLAG_NO_MATCH;
  }
  return match.index;
};
