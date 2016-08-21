'use strict';
var test = require('tape');
var res = require('./test-resources');
var parser = require('../../scripts/parser');

function helperAssertNoMessageStart(str, t) {
  var match = parser.getMessageStartIdx(str);
  t.equal(match, -1);
  t.end();
}

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

test('getMessageStartIdx matches one line', function(t) {
  var str = '2/23/16, 12:45 PM - Sam Sudar: Prueba';
  var actual = parser.getMessageStartIdx(str);
  t.equal(actual, 0);
  t.end();
});

test('getMessageStartIdx matches across lines', function(t) {
  var str =
    'No Modificar:\n----\n{"f":"b","d":"258","m":23,"d":02}\n4/6/16, 4:19 PM';
  var expected = 53;
  var actual = parser.getMessageStartIdx(str);
  t.equal(actual, expected);
  t.end();
});

test('getMessageStartIdx ignores /12/25, 4:19 PM', function(t) {
  var str = '/12/25, 4:19 PM';
  helperAssertNoMessageStart(str, t);
});

test('getMessageStartIdx ignores 12/12/25 4:19 PM', function(t) {
  var str = '/12/25 4:19 PM';
  helperAssertNoMessageStart(str, t);
});

test('getMessageStartIdx ignores 12/12/25,4:19 PM', function(t) {
  var str = '/12/25,4:19 PM';
  helperAssertNoMessageStart(str, t);
});

test('getMessageStartIdx ignores 1/25, 4:19 PM', function(t) {
  var str = '1/25, 4:19 PM';
  helperAssertNoMessageStart(str, t);
});
