'use strict';

var test = require('tape');
var converter = require('../../scripts/converter');

// TODO: tests for unicode and for escaping, ", ', etc.

test('getMessagesAsCsv basic test', function(t) {
  var obj = {foo: 'foo_val', bar: 'bar_val'};
  var expected =
    '"foo","bar"\n' +
    '"foo_val","bar_val"';
  
  var actual = converter.getMessagesAsCsv([obj]);
  t.deepEqual(actual, expected);
  t.end();
});

test('getMessagesAsCsv handles supersets of fields', function(t) {
  // We can't be guaranteed to get all keys if a value is empty or not entered.
  // Make sure we don't fail in this case. This could let people shoot
  // themselves in the foot, e.g. if they try to put objects from different
  // forms in the same input file, and two different questions both keyed to
  // 'v' get output, but we'll allow it for now.
  var obj1 = {foo: 123};
  var obj2 = {bar: 'bar_val'};

  // Potentially dangerous in terms of test flakiness, as I'm not sure if the
  // order of the output CSV file is guaranteed.
  var expected = '"foo","bar"\n' +
    '123,\n' +
    ',"bar_val"';
  var actual = converter.getMessagesAsCsv([obj1, obj2]);
  t.deepEqual(actual, expected);
  t.end();
});
