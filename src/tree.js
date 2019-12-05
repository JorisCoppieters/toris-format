'use strict'; // JS: ES5

// ******************************
//
//
// PARSER
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var FORMATTER_SCSS = require('../formatters/scss');
var FORMATTER_POWERSHELL = require('../formatters/powershell');

var cprint = require('color-print');
var parser = require('./parser');
var utils = require('./utils');

// ******************************
// Globals:
// ******************************

var g_NL = '\n';

// Config - General:
var g_DEBUG = false;
var g_DEFINITION_TYPE = parser.k_DEFINITION_TYPE_HTML;

// Config - Indenting:
var g_INDENT_COUNT = 0;
var g_INDENT = '    ';

// ******************************
// Setup Functions:
// ******************************

function setup (in_config) {
    if (!in_config) {
        return;
    }

    // General:
    g_DEBUG = utils.get_setup_property(in_config, 'debug', g_DEBUG);
    g_DEFINITION_TYPE = utils.get_setup_property(in_config, 'definition_type', g_DEFINITION_TYPE);
    g_INDENT = utils.get_setup_property(in_config, 'indent', g_INDENT);
    g_INDENT_COUNT = utils.get_setup_property(in_config, 'indent_count', g_INDENT_COUNT);
}

// ******************************
// Tree Functions:
// ******************************

function get_tree_output (in_tree, in_config) {
    var state = { LAST_TOKEN: '' };
    var config = in_config || {};
    var tree_output = {};
    var indent = '';

    setup(in_config);

    _populate_tree_output(in_tree, state, tree_output, indent, config);

    return tree_output;
}

// ******************************

function _populate_tree_output (in_tree, in_state, in_tree_output, in_indent, in_config) {
    var state = in_state || {};
    state.LAST_TOKEN = state.LAST_TOKEN || '';
    state.STACK = state.STACK || [];

    var tree_output = in_tree_output || {};
    var indent = in_indent || '';

    if (in_tree.FAILED) {
        return tree_output;
    }

    var definition_key = in_tree.DEFINITION_KEY;
    var definition_value = (in_tree.VALUE || '').trim();
    var definition_stack_marker = in_tree.STACK_MARKER;

    var original_stack = state.STACK;
    if (definition_stack_marker) {
        state.STACK = state.STACK.slice(0);
        state.STACK.push(definition_stack_marker);
    }

    var output;

    switch(g_DEFINITION_TYPE) {
    case parser.k_DEFINITION_TYPE_HTML:
        throw 'HTML outputting not supported yet...';

    case parser.k_DEFINITION_TYPE_SCSS:
        output = FORMATTER_SCSS.get_definition_output(in_tree.DEFINITION_KEY, in_tree.VALUE, state, in_config);
        break;

    case parser.k_DEFINITION_TYPE_POWERSHELL:
        output = FORMATTER_POWERSHELL.get_definition_output(in_tree.DEFINITION_KEY, in_tree.VALUE, state, in_config);
        break;

    default:
        throw 'Unhandled definition type "' + g_DEFINITION_TYPE + '"';
    }

    var append = output.append;
    var color_func = output.color_func;
    var newline = output.newline;
    var double_newline = output.double_newline;
    var space_before = output.space_before;
    var pre_indent = output.pre_indent;
    var post_indent = output.post_indent;
    var last_token = output.last_token;

    if (last_token) {
        state.SECOND_TO_LAST_TOKEN = state.LAST_TOKEN;
        state.LAST_TOKEN = last_token;
    }

    if (pre_indent != 0) {
        _inc_indent(pre_indent);
    }

    var output_indent = _get_indent();

    if (post_indent != 0) {
        _inc_indent(post_indent);
    }

    if (append) {
        if (!color_func && g_DEBUG) {
            append = definition_key;
            color_func = cprint.toBackgroundRed;
        }

        color_func = color_func || cprint.toRed;

        var delim = '';
        if (double_newline) {
            delim = g_NL + g_NL + output_indent;
        } else if (newline) {
            delim = g_NL + output_indent;
        } else if (space_before) {
            delim = ' ';
        }

        tree_output.output = utils.str_append(tree_output.output, append, delim);
        tree_output.color_output = utils.str_append(tree_output.color_output, color_func(append), delim);
    }

    var definition_key_value = definition_key + (definition_value ? (' ===> ' + definition_value) : '');
    tree_output.values = utils.str_append(tree_output.values, definition_key_value, g_NL + indent);
    tree_output.structure = utils.str_append(tree_output.structure, definition_key, g_NL + indent);

    if (in_tree.CHILDREN) {
        in_tree.CHILDREN.forEach(function (child) {
            _populate_tree_output(child, state, tree_output, indent + '  ', in_config);
        });
    }

    if (definition_stack_marker) {
        state.STACK = original_stack;
    }
}

// ******************************

function get_failed_output (in_tree) {
    var failed_tree_output = get_failed_tree_output(in_tree);

    var result = get_recognized_chunk(in_tree);
    if (g_DEBUG) {
        result += '\n' + cprint.toYellow('Best Path:\n' + failed_tree_output.best_path);
    }

    return result;
}

// ******************************

function get_failed_tree_output (in_tree) {
    var tree_output = {};
    var tree_path = '';
    var indent = '';

    _populate_tree_failed_output(in_tree, tree_output, tree_path, indent);

    return tree_output;
}

// ******************************

function _populate_tree_failed_output (in_tree, in_tree_output, in_tree_path, in_indent) {
    var tree_output = in_tree_output || {};
    var tree_path = in_tree_path || '';
    var indent = in_indent || '';

    var definition_key = in_tree.DEFINITION_KEY || 'Root';
    var definition_value = (in_tree.VALUE || '').trim();

    var definition_key_value = definition_key + (definition_value ? (' ===> ' + definition_value) : '');
    tree_output.values = utils.str_append(tree_output.values, definition_key_value, g_NL + indent);
    tree_output.structure = utils.str_append(tree_output.structure, definition_key, g_NL + indent);

    if (!tree_output.least_remaining || tree_output.least_remaining > in_tree.REMAINING_LENGTH) {
        tree_output.least_remaining = in_tree.REMAINING_LENGTH;
        tree_output.best_path = tree_path;
    }

    if (in_tree.ALL_CHILDREN) {
        in_tree.ALL_CHILDREN.forEach(function (child) {
            _populate_tree_failed_output(child, tree_output, tree_path + g_NL + indent + definition_key_value, indent + '  ');
        });
    }
}

// ******************************

function get_tree_output_structure (in_tree, in_config) {
    var config = in_config || {};

    setup(config);

    switch(g_DEFINITION_TYPE) {
    case parser.k_DEFINITION_TYPE_HTML:
        throw 'HTML structure not supported yet...';

    case parser.k_DEFINITION_TYPE_SCSS:
        throw 'SCSS structure not supported yet...';

    case parser.k_DEFINITION_TYPE_POWERSHELL:
        throw 'Powershell structure not supported yet...';

    default:
        throw 'Unhandled definition type "' + g_DEFINITION_TYPE + '"';
    }
}

// ******************************

function get_recognized_chunk (in_tree) {
    if (in_tree.FAILED) {
        var failed_tree_output = get_failed_tree_output(in_tree);
        var recognised_contents = _get_recognized_contents(failed_tree_output, in_tree.INPUT);
        var unrecognised_contents = _get_unrecognized_contents(failed_tree_output, in_tree.INPUT);

        if (recognised_contents.length > 100) {
            recognised_contents = '...' + recognised_contents.substr(recognised_contents.length - 100, 100);
        }

        if (unrecognised_contents.length > 100) {
            unrecognised_contents = unrecognised_contents.substr(0, 100) + '...';
        }

        return cprint.toGreen(recognised_contents) + cprint.toRed(unrecognised_contents);
    }

    return false;
}

// ******************************

function _get_recognized_contents (in_failed_tree_output, in_contents) {
    var contents = in_contents.replace(new RegExp('(\\r\\n|\\r|\\n)', 'g'), '\n');

    var recognised_contents_length = Math.max(0, contents.length - in_failed_tree_output.least_remaining);

    var recognised_contents = contents.substr(0, recognised_contents_length);
    if (recognised_contents.length > 100) {
        recognised_contents = recognised_contents.substr(recognised_contents.length - 100, 100);
    }

    return recognised_contents;
}

// ******************************

function _get_unrecognized_contents (in_failed_tree_output, in_contents) {
    var contents = in_contents.replace(new RegExp('(\\r\\n|\\r|\\n)', 'g'), '\n');

    var recognised_contents_length = Math.max(0, contents.length - in_failed_tree_output.least_remaining);
    var unrecognised_contents_length = 100;

    var unrecognised_contents = contents.substr(recognised_contents_length, unrecognised_contents_length);
    while (unrecognised_contents.trim().length === 0 && unrecognised_contents_length < contents.length - recognised_contents_length) {
        unrecognised_contents_length += 10;
        unrecognised_contents = contents.substr(recognised_contents_length, unrecognised_contents_length);
    }

    return unrecognised_contents;
}

// ******************************
// Indent Functions:
// ******************************

function _get_indent (in_inc) {
    return utils.str_repeat(g_INDENT, g_INDENT_COUNT + (in_inc || 0));
}

// ******************************

function _inc_indent (in_inc) {
    g_INDENT_COUNT = Math.max(0, g_INDENT_COUNT + (in_inc || 0));
}

// ******************************
// Exports:
// ******************************

module.exports['setup'] = setup;
module.exports['get_failed_tree_output'] = get_failed_tree_output;
module.exports['get_failed_output'] = get_failed_output;
module.exports['get_recognized_chunk'] = get_recognized_chunk;
module.exports['get_tree_output'] = get_tree_output;
module.exports['get_tree_output_structure'] = get_tree_output_structure;

// ******************************