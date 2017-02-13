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

module.exports['get_setup_property'] = get_setup_property;
module.exports['num_lines'] = num_lines;
module.exports['is_numeric'] = is_numeric;
module.exports['str_append'] = str_append;
module.exports['str_repeat'] = str_repeat;

// ******************************
// Functions:
// ******************************

function get_setup_property (in_config, in_field, in_default_value, in_base_value) {
  if (!in_config) {
    return in_default_value;
  }

  if (Array.isArray(in_field)) {
    var valid_fields = in_field.filter(function (field) {return typeof(in_config[field]) !== "undefined";});
    if (!valid_fields || !valid_fields.length) {
      return in_default_value;
    }
    var field = valid_fields[0];
    return in_config[field];
  }

  if (typeof(in_config[in_field]) === "undefined") {
    return in_default_value;
  }
  var val = in_config[in_field];

  if (Array.isArray(in_base_value) && Array.isArray(val)) {
    val = in_base_value.concat(val);
  }

  return val;
}

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
