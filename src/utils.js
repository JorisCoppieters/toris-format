'use strict';

// ******************************
//
//
// Utilities
//
//
// ******************************

// ******************************
// Exports:
// ******************************

module.exports['num_lines'] = num_lines;
module.exports['is_numeric'] = is_numeric;
module.exports['str_append'] = str_append;
module.exports['str_repeat'] = str_repeat;

// ******************************
// Functions:
// ******************************

function num_lines(in_content) {
  if (!in_content) {
    return 0;
  }
  return (in_content || '').replace(new RegExp('\\n', 'g'), '\n').split('\n').length;
}

// ******************************

function is_numeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// ******************************

function str_append (in_string, in_append, in_delim) {
  var string = in_string || '';
  var append = in_append || '';
  if (in_delim) {
    return string + (string.length ? in_delim : '') + append;
  }
  return string + append;
}

// ******************************

function str_repeat (s, n) {
  return Array(n+1).join(s);
}

// ******************************
