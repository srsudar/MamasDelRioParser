'use strict';
var test = require('tape');
var res = require('./test-resources');
var parser = require('../../scripts/parser');

test('readLines works on empty string', function(t) {
  // This is the default behavior. No reason to change this I don't think...
  var expected = [''];
  var actual = parser.readLines('');
  t.deepEqual(actual, expected);
  t.end();
});

test('readLines works on basicLines.txt', function(t) {
  // We're hardcoding these values.
  var expected = [
    'this is a file for',
    'testing',
    'basic line parsing',
    '',
    '12345 1',
    '12:34',
    ''
  ];

  res.getBasicLines().then(raw => {
    var actual = parser.readLines(raw);
    t.deepEqual(actual, expected);
    t.end();
  });
});
