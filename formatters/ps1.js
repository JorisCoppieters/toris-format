'use strict'; // JS: ES5

// ******************************
//
//
// SCSS OUTPUT FILE
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var cprint = require('color-print');
var utils = require('../src/utils');
var regexp_shorthand = require('../regexp/shorthand');

// ******************************
// Exposing Functions:
// ******************************

var r_W = regexp_shorthand.r_W;
var r_v = regexp_shorthand.r_v;

// ******************************
// Globals:
// ******************************

var g_DEBUG = false;
var g_FORMAT_PROPERTY_VALUES_ON_NEWLINES = [];

// ******************************
// Setup Functions:
// ******************************

function setup (in_config) {
    if (!in_config) {
        return;
    }

    g_DEBUG = utils.get_setup_property(in_config, 'debug', g_DEBUG);
    g_FORMAT_PROPERTY_VALUES_ON_NEWLINES = utils.get_setup_property(in_config, 'format_property_values_on_newlines', g_FORMAT_PROPERTY_VALUES_ON_NEWLINES);
}

// ******************************
// Output:
// ******************************

function get_definition_output (in_definition_key, in_definition_value, in_state, in_config) {
    setup(in_config);

    var state = in_state || { LAST_TOKEN: '' };

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

    switch (definition_key) {

    case 'VAL__ifKeyword':
    case 'VAL__elseifKeyword':
    case 'VAL__elseKeyword':
        double_newline = whitespace_before_includes_double_newline;
        newline = true;
        color_func = cprint.toCyan;
        last_token = definition_value;
        append = definition_value.toLowerCase();
        break;

    case 'VAL__DQUOTE':
    case 'VAL__SQUOTE':
        color_func = cprint.toWhite;
        last_token = definition_value;
        space_before = ['STRING'].indexOf(state.LAST_TOKEN) < 0;
        break;

    case 'VAL__PAREN_L':
        color_func = cprint.toWhite;
        last_token = definition_value;
        break;

    case 'VAL__PAREN_R':
        color_func = cprint.toWhite;
        last_token = definition_value;
        space_before = false;
        break;

    case 'VAL__CURLY_L':
        color_func = cprint.toCyan;
        last_token = definition_value;
        post_indent++;
        space_before = true;
        break;

    case 'VAL__CURLY_R':
        color_func = cprint.toCyan;
        last_token = definition_value;
        newline = true;
        pre_indent--;
        space_before = true;
        break;

    case 'VAL__DOLLAR':
        color_func = cprint.toBlue;
        space_before = ['('].indexOf(state.LAST_TOKEN) < 0;
        last_token = definition_value;
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

module.exports['get_definition_output'] = get_definition_output;

module.exports['setup'] = setup; // TODO: DEPRECATE EXPORT

// ******************************