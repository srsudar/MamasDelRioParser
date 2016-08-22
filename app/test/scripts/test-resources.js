/* global require, Promise */
'use strict';
var fs = require('fs');

exports.TestStruct = function(msg, raw, lines) {
  if (!(this instanceof exports.TestStruct)) {
    throw new Error('must call TestStruct with new');
  }
  this.msg = msg;
  this.raw = raw;
  this.lines = lines;
};

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
exports.getWhatsappChat1Str = function() {
  return exports.getFileAsString('./assets/whatsapp1.txt');
};

/**
 * Get the string associated with assets/whatsapp2.txt.
 *
 * @return {Promise -> string}
 */
exports.getWhatsappChat2Str = function() {
  return exports.getFileAsString('./assets/whatsapp2.txt');
};

/**
 * Get a basic file for line testing.
 *
 * @return {Promise -> string}
 */
exports.getBasicLines = function() {
  return exports.getFileAsString('./assets/basicLines.txt');
};
