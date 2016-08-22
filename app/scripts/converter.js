'use strict';

var csv = require('json2csv');

/**
 * Convert the array of JSON objects to CSV data.
 *
 * @param {Array<object>} json
 *
 * @return don't yet know
 */
exports.getMessagesAsCsv = function(json) {
  var allNames = new Set();
  json.forEach(obj => {
    Object.getOwnPropertyNames(obj).forEach(field => {
      allNames.add(field);
    });
  });
  var fields = Array.from(allNames);
  var result = csv(
    {
      data: json,
      fields: fields
    }
  );
  return result;
};
