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

var cprint = require('color-print');
var regexp_shorthand = require('../regexp/shorthand');

// ******************************
// Exposing Functions:
// ******************************

var r_A = regexp_shorthand.r_A;
var r_AG = regexp_shorthand.r_AG;
var r_W = regexp_shorthand.r_W;
var r_S = regexp_shorthand.r_S;
var r_w = regexp_shorthand.r_w;
var r_g = regexp_shorthand.r_g;
var r_v = regexp_shorthand.r_v;
var r_dq = regexp_shorthand.r_dq;
var r_sq = regexp_shorthand.r_sq;

// ******************************
// Output:
// ******************************

function get_definition_output (in_definition_key, in_definition_value, in_state, in_options) {
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

    switch (definition_key) {

        case 'HTML_OPEN_ELEMENT_END':
            post_indent = 1;
            break;

        case 'HTML_CLOSE_ELEMENT':
            post_indent = -1;
            break;

        case 'VAL__ANBRAC_L':
            if (state.STACK.indexOf('HTML_ELEMENT') > -1) {
                color_func = cprint.toWhite;
                state.LAST_TOKEN = definition_key;
                newline = true;
            }
            break;

        case 'VAL__ANBRAC_R':
            if (state.STACK.indexOf('HTML_ELEMENT') > -1) {
                color_func = cprint.toWhite;
                state.LAST_TOKEN = definition_key;
                space_before = false;
            }
            break;

        case 'VAL__SLASH':
            if (state.STACK.indexOf('HTML_ELEMENT') > -1) {
                color_func = cprint.toWhite;
                state.LAST_TOKEN = definition_key;
                space_before = false;
            }
            break;

        case 'VAL__ELEMENT_NAME':
            if (state.STACK.indexOf('HTML_ELEMENT') > -1) {
                color_func = cprint.toWhite;
                state.LAST_TOKEN = definition_key;
                space_before = false;
            }
            break;

        case 'VAL__HTML_CONTENT':
            if (state.STACK.indexOf('HTML_ELEMENT') > -1) {
                color_func = cprint.toGreen;
                state.LAST_TOKEN = definition_key;
                newline = true;
            }
            break;

        default:
            if (options.DEBUG && definition_value) {
                append = definition_key + ':' + definition_value;
                color_func = cprint.toBackgroundRed;
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

module.exports['get_definition_output'] = get_definition_output

// ******************************