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

/** The maximum number of times we try to sniff a JSON object. */
var NUM_PARSE_ATTEMPTS = 10;

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
 * Convert str to messages and try to extract JSON from each message. Returns
 * all the JSON object as well as all the messages from which JSON was not
 * extracted, to allow manual inspection of missed errors.
 *
 * @param {string} str the string from which to parse and extract messages
 *
 * @return {object} an object with two keys:
 * {
 *   json: Array,
 *   noJson: Array
 * }
 * json is an Array of all JSON object extracted, while noJson is an Array of
 * all the messages that did not produce JSON.
 */
exports.extractAllMessages = function(str) {
  var messages = exports.extractMessages(str);
  var json = [];
  var noJson = [];
  
  messages.forEach(msg => {
    var sniffed = exports.sniffJson(msg);  // sniff sniff
    if (sniffed) {
      json.push(sniffed);
    } else {
      noJson.push(msg);
    }
  });

  return {
    json: json,
    noJson: noJson
  };
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
 * Make a best effort attempt to extract a JSON string from the string. This
 * tries to find JSON in the message somewhere. It does its best to find the
 * start and end of the JSON, but it isn't perfect and it definitely can be
 * deceived.
 *
 * E.g., (ignoring quotations and escaping in these examples), hello {'foo':
 * 'bar'} should return parsed {foo: bar}, dropping the hellow.
 *
 * "hello { {foo: bar}" is trickier, as there is a { in the message that might
 * throw it off. sniffJson tries to solve this, but it doesn't try to be
 * perfect. It tries to catch innocent mistakes.
 *
 * @param {sting} str string to sniff
 *
 * @return {object|null} returns the parsed JSON or null if it cannot find
 * JSON.
 */
exports.sniffJson = function(str) {
  // We are going to find {, and count +1 for each additional { we find. We
  // will subtract 1 for each } we find. If we ever go negative, we know we
  // have started in the wrong place or it is corrupted.
  // 
  // We aren't trying to account for parse error inside the JSON--we're just
  // trying to find the right place to start parsing.
  //
  // Once we make it back to 0, we know we have valid JSON. We'll try it.

  var open = '{';
  var close = '}';

  var exploring = str;
  var start = exploring.indexOf(open) - 1;
  // Try a limited number of times.
  for (var i = 0; i < NUM_PARSE_ATTEMPTS; i++) {
    start++;
    exploring = exploring.substring(start);
    var counter = 0;

    var foundStart = false;
    for (var ptr = 0; ptr < exploring.length; ptr++) {
      var chr = exploring.charAt(ptr);
      if (chr === open) {
        // console.log('found start');
        foundStart = true;
        counter++;
      } else if (chr === close) {
        counter--;
      }
      if (counter === 0 && foundStart) {
        // We've found an end point. Extract the string and try to parse it.
        // ptr is pointing at a }. We need to take substring to that position
        // +1, to ensure that we capture the closing brace.
        var strOfInterest = exploring.substring(0, ptr + 1);
        var parsed = exports.tryToParse(strOfInterest);
        if (parsed) {
          return parsed;
        } else {
          // Invalid starting point. Choose the next.
          break;
        }
      } else if (counter < 0) {
        // More } than {, we've found an invalid start point.
        break;
      }
    }
  }
  return null;
};

/**
 * Safe way to parse questionable strings to JSON.
 *
 * @param {string} str the string to try and parse
 *
 * @return {object|null} JSON.parse() result if the parse succeeds, else null
 */
exports.tryToParse = function(str) {
  var result = null;
  try {
    result = JSON.parse(str);
  } catch (err) {
    // Couldn't parse the value.
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
    // We have two cases to consider here. We are matching ^ or \n. ^
    // represents no character, while \n is a character. If we've matched \n,
    // the index+1 is the start.
    var nextStart = arr.index;
    if (nextStart !== 0) {
      // ^ matches the beginning of the input string, so this can only occur if
      // the index is zero.
      nextStart = nextStart + 1;
    }
    result.push(nextStart);
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
