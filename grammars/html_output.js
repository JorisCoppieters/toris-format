'use strict'; // JS: ES5

// ******************************
//
//
// HTML OUTPUT FILE
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var utils = require('./utils');
var cprint = require('color-print');

// ******************************
// Exposing Functions:
// ******************************

var r_A = utils.r_A;
var r_AG = utils.r_AG;
var r_W = utils.r_W;
var r_S = utils.r_S;
var r_w = utils.r_w;
var r_g = utils.r_g;
var r_v = utils.r_v;
var r_dq = utils.r_dq;
var r_sq = utils.r_sq;

// ******************************
// Output:
// ******************************

function get_output (in_definition_key, in_definition_value, in_state, in_options) {
  var state = in_state;
  state.ELEMENT_STACK = state.ELEMENT_STACK || [];

  var options = in_options || { DEBUG: false };

  var definition_key = in_definition_key;
  var definition_value = (in_definition_value || '').trim();
  var whitespace_matches = (in_definition_value || '').match(new RegExp('^' + r_v(r_W), 'i'));
  var whitespace_before = '';
  var whitespace_before_includes_newline = false;
  var whitespace_before_includes_double_newline = false;
  if (whitespace_matches) {
    whitespace_before = whitespace_matches[1];
    whitespace_before_includes_newline = whitespace_before.match(/^[\s]*?(\n|\r\n?)[\s]*?$/);
    whitespace_before_includes_double_newline = whitespace_before.match(/^[\s]*?(\n|\r\n?)[\s]*?(\n|\r\n?)[\s]*?$/);
  }

  var append = definition_value;
  var color_func = false;
  var newline = false;
  var double_newline = false;
  var space_before = true;
  var pre_indent = 0;
  var post_indent = 0;
  var last_token = false;

  // if (definition_key) {
  //   if (definition_key.match(/DECLARATION_.*/)) {
  //     state.DECLARATION_TYPE = definition_key;
  //     state.VALUE_TYPE = false;
  //   } else if (definition_key.match(/TYPE_.*/)) {
  //     state.VALUE_TYPE = definition_key;
  //   }
  // }

  switch (definition_key) {

    case 'HTML_OPEN_ELEMENT':
      state.DECLARATION_TYPE = 'OPEN_ELEMENT';
      break;

    case 'HTML_CLOSE_ELEMENT':
      state.DECLARATION_TYPE = 'CLOSE_ELEMENT';
      post_indent = -1;
      break;

    case 'HTML_OPEN_ELEMENT_END_CLOSED':
      post_indent = 1;
      break;

    case 'OPEN_ANGLED_BRACKET':
      if (['OPEN_ELEMENT', 'CLOSE_ELEMENT'].indexOf(state.DECLARATION_TYPE) > -1) {
        append = '<';
        color_func = cprint.toWhite;
        state.LAST_TOKEN = '<';
        newline = true;
      }
      break;

    case 'CLOSE_ANGLED_BRACKET':
      if (['OPEN_ELEMENT', 'CLOSE_ELEMENT'].indexOf(state.DECLARATION_TYPE) > -1) {
        append = '>';
        color_func = cprint.toWhite;
        state.LAST_TOKEN = '>';
        space_before = false;
      }
      break;

    case 'SLASH':
      if (['OPEN_ELEMENT', 'CLOSE_ELEMENT'].indexOf(state.DECLARATION_TYPE) > -1) {
        append = '/';
        color_func = cprint.toWhite;
        state.LAST_TOKEN = '/';
        space_before = false;
      }
      break;

    case 'HTML_ELEMENT_NAME':
      if (['OPEN_ELEMENT', 'CLOSE_ELEMENT'].indexOf(state.DECLARATION_TYPE) > -1) {
        append = definition_value;
        color_func = cprint.toWhite;
        state.LAST_TOKEN = 'ELEMENT_NAME';
        state.ELEMENT_STACK.push(definition_value);
        state.CURRENT_ELEMENT_NAME = definition_value;
        space_before = false;
      }
      break;

    case 'HTML_CONTENT':
      if (['OPEN_ELEMENT', 'CLOSE_ELEMENT'].indexOf(state.DECLARATION_TYPE) > -1) {
        append = definition_value;
        color_func = cprint.toGreen;
        state.LAST_TOKEN = 'CONTENT';
        newline = true;
      }
      break;

    default:
      if (options.DEBUG && definition_value) {
        append = definition_key + ':' + definition_value;
        color_func = cprint.toRed;
      }
      break;
  }

  return {
    append,
    color_func,
    newline,
    double_newline,
    space_before,
    pre_indent,
    post_indent,
    last_token
  };
}

// ******************************
// Exports:
// ******************************

module.exports['get_output'] = get_output;

// ******************************