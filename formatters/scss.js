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
var regexp_shorthand = require('../regexp/shorthand');

// ******************************
// Globals:
// ******************************

var g_STATE = null;

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
    var state = in_state || { LAST_TOKEN: '' };
    var options = in_options || { FORMAT_PROPERTY_VALUES_ON_NEWLINES: [], DEBUG: false };

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

    g_STATE = state;

    switch (definition_key) {
        case 'VAL__DASH':
        case 'VAL__EQ':
        case 'VAL__EQEQ':
        case 'VAL__GTEQ':
        case 'VAL__LT':
        case 'VAL__LTEQ':
        case 'VAL__NOTEQ':
        case 'VAL__SQBRAC_L':
        case 'VAL__SQBRAC_R':
        case 'VAL__TIL':
            color_func = cprint.toLightCyan;
            last_token = definition_key;
            break;

        case 'VAL__CURLY_L':
            color_func = cprint.toWhite;
            last_token = definition_key;

            if (within('BLOCK') && !within('HASH_EXPRESSION')) {
                post_indent = 1;
            }

            if (within('HASH_EXPRESSION')) {
                space_before = false;
            }
            break;

        case 'VAL__CURLY_R':
            color_func = cprint.toWhite;
            last_token = definition_key;

            if (within('BLOCK') && !within('HASH_EXPRESSION')) {
                pre_indent = -1;
                newline = true;
            }

            if (within('HASH_EXPRESSION')) {
                space_before = false;
            }
            break;

        case 'VAL__HASH':
            color_func = cprint.toLightCyan;
            last_token = definition_key;

            if (within(['FUNCTION_CALL']) && !within('EXPRESSION_2ND')) {
                space_before = false;
            }
            break;

        case 'VAL__DOT':
            color_func = cprint.toLightCyan;
            last_token = definition_key;

            if (within('SELECTORS') && !within('SELECTOR_2ND') && !last('VAL__GT')) {
                if (whitespace_before_includes_double_newline) {
                    double_newline = true;
                } else {
                    newline = true;
                }
            }
            break;

        case 'VAL__AMP':
            color_func = cprint.toLightCyan;
            last_token = definition_key;

            if (within('SELECTORS') && !within('SELECTOR_2ND')) {
                if (whitespace_before_includes_double_newline) {
                    double_newline = true;
                } else {
                    newline = true;
                }
            }
            break;

        case 'VAL__GT':
            color_func = cprint.toLightCyan;
            last_token = definition_key;

            if (within('FIRST_SELECTOR_PREFIX')) {
                if (whitespace_before_includes_double_newline) {
                    double_newline = true;
                } else {
                    newline = true;
                }
            }
            break;

        case 'VAL__COLON':
            color_func = cprint.toLightCyan;
            last_token = definition_key;

            if (within(['SELECTORS', 'PROPERTY', 'VARIABLE'])) {
                space_before = false;
            }
            break;

        case 'VAL__PAREN_L':
            color_func = cprint.toLightCyan;
            last_token = definition_key;

            if (within('FUNCTION_CALL')) {
                space_before = false;
            }

            if (within('PAREN_EXPRESSION') && last('VAL__NEGATE')) {
                space_before = false;
            }
            break;

        case 'VAL__PAREN_R':
            color_func = cprint.toLightCyan;
            last_token = definition_key;

            if (within('FUNCTION_CALL')) {
                space_before = false;
            }

            if (within('PAREN_EXPRESSION')) {
                space_before = false;
            }
            break;

        case 'VAL__COMMA':
            color_func = cprint.toLightCyan;
            last_token = definition_key;

            if (within(['PROPERTY', 'FUNCTION_CALL', 'NUMERIC_EXPRESSION', 'SELECTORS'])) {
                space_before = false;
            }
            break;

        case 'VAL__PLUS':
        case 'VAL__TIMES':
        case 'VAL__MINUS':
        case 'VAL__PERC':
        case 'VAL__DIVIDE':
            color_func = cprint.toLightCyan;
            last_token = definition_key;
            break;

        case 'VAL__NEGATE':
            color_func = cprint.toLightCyan;
            last_token = definition_key;

            if (last(['VAL__PAREN_L'])) {
                space_before = false;
            }
            break;

        case 'MISSING_SEMI':
        case 'VAL__SEMI':
            color_func = cprint.toLightMagenta;
            last_token = 'VAL__SEMI';
            space_before = false;
            append = ';'
            break;

        case 'VAL__SELECTOR_NAME':
            color_func = cprint.toWhite;
            last_token = definition_key;

            if (within('SELECTOR') && !last(['VAL__GT'])) {
                space_before = false;
            }

            if (within('BLOCK') && !last(['VAL__COLON', 'VAL__DOT', 'VAL__MINUS'])) {
                if (whitespace_before_includes_double_newline) {
                    double_newline = true;
                } else {
                    newline = true;
                }
            }
            break;

        case 'VAL__SELECTOR_MODIFIER':
            color_func = cprint.toCyan;
            last_token = definition_key;

            if (within('SELECTOR') && !within('PROPERTY')) {
                space_before = false;
            }
            break;

        case 'VAL__PROPERTY_KEY':
            color_func = cprint.toGreen;
            last_token = definition_key;
            newline = true;
            break;

        case 'VAL__KEYWORD_NAME':
            color_func = cprint.toYellow;
            last_token = definition_key;

            if (within('FUNCTION_PARAM') && last(['VAL__PAREN_L'])) {
                space_before = false;
            }
            break;

        case 'VAL__DOLLAR':
            color_func = cprint.toLightBlue;
            last_token = definition_key;

            if (within('VARIABLE')) {
                if (whitespace_before_includes_double_newline) {
                    double_newline = true;
                } else {
                    newline = true;
                }
            }

            if (within('VARIABLE_EXPRESSION') && last(['VAL__NEGATE', 'VAL__PAREN_L'])) {
                space_before = false;
            }

            if (within('HASH_EXPRESSION')) {
                space_before = false;
            }
            break;

        case 'VAL__VARIABLE_NAME':
            color_func = cprint.toLightBlue;

            if (within('VARIABLE_EXPRESSION')) {
                space_before = false;
            }
            break;

        case 'VAL__HEX_COLOUR':
            color_func = cprint.toMagenta;
            last_token = definition_key;

            if (within('FUNCTION_PARAM') && last(['VAL__PAREN_L'])) {
                space_before = false;
            }
            break;

        case 'VAL__NUMBER':
            color_func = cprint.toYellow;
            last_token = definition_key;

            if (within('FUNCTION_PARAM') && !within(['FUNCTION_PARAM_2ND', 'HASH_EXPRESSION']) && !last(['VAL__MINUS'])) {
                space_before = false;
            }

            if (within('NUMERIC_EXPRESSION') && last(['VAL__NEGATE', 'VAL__PAREN_L'])) {
                space_before = false;
            }
            break;

        case 'VAL__MEASUREMENT':
            color_func = cprint.toWhite;
            last_token = definition_key;

            if (within('FUNCTION_PARAM') && !within(['FUNCTION_PARAM_2ND', 'HASH_EXPRESSION']) && !last(['VAL__MINUS'])) {
                space_before = false;
            }

            if (within('NUMERIC_EXPRESSION') && last(['VAL__NEGATE', 'VAL__PAREN_L'])) {
                space_before = false;
            }
            break;

        case 'VAL__STRING_DOUBLE_QUOTED':
            color_func = cprint.toMagenta;
            last_token = definition_key;
            break;

        case 'VAL__SINGLE_LINE_COMMENT':
            color_func = cprint.toDarkGrey;
            if (whitespace_before_includes_double_newline) {
                double_newline = true;
            } else if (whitespace_before_includes_newline) {
                newline = true;
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

function within (in_definition_keys) {
    if (!g_STATE || !g_STATE.STACK || !g_STATE.STACK.length) {
        return false;
    }

    var definition_keys = Array.isArray(in_definition_keys) ? in_definition_keys : [in_definition_keys];
    var matched = definition_keys.filter(function (definition_key) {
        return g_STATE.STACK.indexOf(definition_key) > -1;
    });

    return matched.length;
}

// ******************************

function last (in_definition_keys) {
    if (!g_STATE || !g_STATE.LAST_TOKEN) {
        return false;
    }

    var definition_keys = Array.isArray(in_definition_keys) ? in_definition_keys : [in_definition_keys];
    return definition_keys.indexOf(g_STATE.LAST_TOKEN) > -1;
}

// ******************************
// Exports:
// ******************************

module.exports['get_definition_output'] = get_definition_output;

// ******************************