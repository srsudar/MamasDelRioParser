/* global require, Promise */
'use strict';
var fs = require('fs');

/**
 * @param {string} path
 *
 * @return {Promise -> string}
 */
exports.getFileAsString = function(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf8', function(err, data) {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

/**
 * Get the string associated with assets/whatsapp1.txt.
 *
 * @return {Promise -> string}
 */
exports.getWhatsappChat1 = function() {
  return exports.getFileAsString('./assets/whatsapp1.txt');
};

/**
 * Get a basic file for line testing.
 *
 * @return {Promise -> string}
 */
exports.getBasicLines = function() {
  return exports.getFileAsString('./assets/basicLines.txt');
};
