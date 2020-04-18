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

var GRAMMAR_SCSS = require('../grammars/scss');
var GRAMMAR_PS1 = require('../grammars/ps1');

var checks = require('./checks');
var cprint = require('color-print');
var grammar  = require('../grammars/_core');
var parserHtml = require('./parser_html');
var regexp_shorthand = require('../regexp/shorthand');
var utils = require('./utils');

// ******************************
// Exposing Functions:
// ******************************

var r_AG = regexp_shorthand.r_AG;
var r_W = regexp_shorthand.r_W;
var r_LW = regexp_shorthand.r_LW;
var r_g = regexp_shorthand.r_g;
var r_v = regexp_shorthand.r_v;

// ******************************
// Constants:
// ******************************

const FALSE = false;

const k_DEFINITION_TYPE_HTML = 'HTML';
const k_DEFINITION_TYPE_SCSS = 'SCSS';
const k_DEFINITION_TYPE_PS1 = 'PS1';

// ******************************
// Globals:
// ******************************

// Config - General:
var g_ALLOW_EMPTY_CONTENT = false;
var g_DEBUG = false;
var g_DEFINITION_TYPE = k_DEFINITION_TYPE_HTML;
var g_PRINT_TREE_CONSTRUCTION = false;
var g_RUN_CHECKS = false;
var g_CASE_INSENSITIVE = false;
var g_PARSE_AS_SEPARATE_LINES = false;

// ******************************
// Setup Functions:
// ******************************

function setup (in_config) {
    if (!in_config) {
        return;
    }

    // General:
    g_ALLOW_EMPTY_CONTENT = utils.get_setup_property(in_config, 'allow_empty', g_ALLOW_EMPTY_CONTENT);
    g_DEBUG = utils.get_setup_property(in_config, 'debug', g_DEBUG);
    g_DEFINITION_TYPE = utils.get_setup_property(in_config, 'definition_type', g_DEFINITION_TYPE);
    g_PRINT_TREE_CONSTRUCTION = utils.get_setup_property(in_config, 'print_tree_construction', g_PRINT_TREE_CONSTRUCTION);
    g_RUN_CHECKS = utils.get_setup_property(in_config, 'run_checks', g_RUN_CHECKS);
    g_CASE_INSENSITIVE = true;
    g_PARSE_AS_SEPARATE_LINES = true;

    if (g_DEFINITION_TYPE === k_DEFINITION_TYPE_HTML) {
        // HTML:
        parserHtml.setup(in_config);
    }
}

// ******************************
// Parsing Functions:
// ******************************

function parse_contents (in_contents) {
    var result = false;

    do {
        var contents = in_contents || '';
        if (contents.trim().length === 0) {
            if (g_ALLOW_EMPTY_CONTENT) {
                return '';
            }
            throw 'No content to parse!';
        }

        var definition;

        switch(g_DEFINITION_TYPE) {
        case k_DEFINITION_TYPE_HTML:
            throw 'HTML parsing not supported yet...';

        case k_DEFINITION_TYPE_SCSS:
            definition = GRAMMAR_SCSS;
            break;

        case k_DEFINITION_TYPE_PS1:
            definition = GRAMMAR_PS1;
            break;

        default:
            throw 'Unhandled definition type "' + g_DEFINITION_TYPE + '"';
        }

        if (!grammar.k_DEFINITION_KEY_START) {
            throw 'Definition doesn\'t have starting element "' + g_DEFINITION_TYPE + '"';
        }

        if (g_RUN_CHECKS) {
            try {
                checks.check_grammar(definition);
            } catch (err) {
                throw err;
            }
        }

        if (g_PRINT_TREE_CONSTRUCTION) {
            definition[grammar.k_DEFINITION_KEY_START].DEBUG = grammar.k_DEBUG_MATCH_VAL;
        }

        var tree = {};
        parse_definition_key(tree, contents, definition, grammar.k_DEFINITION_KEY_START);
        result = tree;
    }
    while (FALSE);

    return result;
}

// ******************************

function parse_definition_key (out_tree, in_contents, in_definition, in_definition_key, in_indent, in_debug) {
    var result = false;

    do {
        var contents = in_contents || '';
        var original_contents = contents;

        // if (contents.trim().length === 0) {
        //     result = false;
        //     break;
        // }

        var definition_key = (in_definition_key) ? in_definition_key : grammar.k_DEFINITION_KEY_START;
        var definition_value = in_definition[definition_key];

        if (!definition_value) {
            throw 'Couldn\'t find definition key "' + definition_key + '"';
        }

        var tree = out_tree || {};
        var indent = in_indent || '';
        var debug = (definition_value.DEBUG || in_debug || grammar.k_DEBUG_OFF);

        var is_start = (definition_key === grammar.k_DEFINITION_KEY_START);
        if (is_start) {
            tree.INPUT = original_contents;
            contents = contents.replace(new RegExp(r_g('\\r\\n|\\r|\\n'), 'g'), '\n');
        }

        _log_debug_match(debug, cprint.toWhite(indent + definition_key));

        switch (definition_value.OPERATOR) {
        case '||':
            result = _parse_definition_or(tree, contents, in_definition, definition_key, definition_value, indent, debug);
            break;

        case '&&':
            result = _parse_definition_and(tree, contents, in_definition, definition_key, definition_value, indent, debug);
            break;

        case '*':
            result = _parse_definition_multiple(tree, true, contents, in_definition, definition_key, definition_value, indent, debug);
            break;

        case '+':
            result = _parse_definition_multiple(tree, false, contents, in_definition, definition_key, definition_value, indent, debug);
            break;

        case '==':
            result = _parse_definition_equals(tree, contents, in_definition, definition_key, definition_value, indent, debug);
            break;

        default:
            throw 'Invalid operator "' + definition_value.OPERATOR + '" for definition key "' + definition_key + '"';
        }

        tree.DEFINITION_KEY = definition_key;
        tree.STACK_MARKER = definition_value.STACK || null;

        if (is_start) {
            if ((!tree.VALUE && !tree.CHILDREN) || result.trim() !== '') {
                tree.FAILED = true;
                result = '';
            }
            break;
        }

    }
    while (FALSE);

    return result;
}

// ******************************

function _parse_definition_or (out_tree, in_contents, in_definition, in_definition_key, in_definition_value, in_indent, in_debug) {
    var result = false;

    do {
        var segments = in_definition_value.SEGMENTS || [];
        if (!segments) {
            throw 'Segments haven\'t been defined for definition key "' + in_definition_key + '"';
        }

        var remaining = false;
        var matched = false;
        var sub_tree = {};
        var matched_sub_tree = {};
        var all_matched_sub_trees = [];

        segments.forEach(function (sub_definition_key) {
            if (matched) {
                return;
            }

            sub_tree = {};
            remaining = parse_definition_key(sub_tree, in_contents, in_definition, sub_definition_key, in_indent + '  ', in_debug);
            all_matched_sub_trees.push(sub_tree);

            if (remaining !== false) {
                matched = true;
                matched_sub_tree = sub_tree;
            }
        });

        out_tree.ALL_CHILDREN = all_matched_sub_trees;

        if (!matched) {
            _log_debug_all(in_debug, cprint.toRed(in_indent + in_definition_key + ' [FAILED]'));
            break;
        }

        out_tree.CHILDREN = [matched_sub_tree];

        if (matched) {
            _log_debug_match_val(in_debug, cprint.toCyan(in_indent + in_definition_key + ' [MATCHED]'));
        }

        result = remaining;
    }
    while (FALSE);

    return result;
}

// ******************************

function _parse_definition_and (out_tree, in_contents, in_definition, in_definition_key, in_definition_value, in_indent, in_debug) {
    var result = false;

    do {
        var segments = in_definition_value.SEGMENTS || [];
        if (!segments) {
            throw 'Segments haven\'t been defined for definition key "' + in_definition_key + '"';
        }

        var contents = in_contents;

        var remaining = '';
        var matched = true;
        var sub_tree = {};
        var sub_tree_children = [];
        var all_matched_sub_trees = [];

        segments.forEach(function (sub_definition_key) {
            if (!matched) {
                return;
            }

            sub_tree = {};
            remaining = parse_definition_key(sub_tree, contents, in_definition, sub_definition_key, in_indent + '  ', in_debug);
            all_matched_sub_trees.push(sub_tree);

            if (remaining === false) {
                matched = false;
                return;
            }

            sub_tree_children.push(sub_tree);
            contents = remaining;
        });

        out_tree.ALL_CHILDREN = all_matched_sub_trees;

        if (!matched) {
            _log_debug_all(in_debug, cprint.toRed(in_indent + in_definition_key + ' [FAILED]'));
            break;
        }

        out_tree.CHILDREN = sub_tree_children;

        if (matched) {
            _log_debug_match_val(in_debug, cprint.toCyan(in_indent + in_definition_key + ' [MATCHED]'));
        }

        result = remaining;
    }
    while (FALSE);

    return result;
}

// ******************************

function _parse_definition_multiple (out_tree, in_optional, in_contents, in_definition, in_definition_key, in_definition_value, in_indent, in_debug) {
    var result = false;

    do {
        var segments = in_definition_value.SEGMENTS || [];
        if (!segments) {
            throw 'Segments haven\'t been defined for definition key "' + in_definition_key + '"';
        }

        var contents = in_contents;
        var remaining = contents;
        var matched = true;
        var matched_any = false;
        var sub_tree = {};
        var sub_tree_children = [];
        var all_matched_sub_trees = [];

        while (matched) {
            if (remaining === '') {
                break;
            }

            segments.forEach(function (sub_definition_key) {
                if (!matched || remaining === '') {
                    return;
                }

                sub_tree = {};
                remaining = parse_definition_key(sub_tree, contents, in_definition, sub_definition_key, in_indent + '  ', in_debug);
                all_matched_sub_trees.push(sub_tree);

                if (remaining === false) {
                    matched = false;
                    return;
                }

                sub_tree_children.push(sub_tree);
                contents = remaining;
                matched_any = true;
            });
        }

        out_tree.ALL_CHILDREN = all_matched_sub_trees;

        if (!matched_any) {
            if (!in_optional) {
                _log_debug_all(in_debug, cprint.toRed(in_indent + in_definition_key + ' [FAILED]'));
                break;
            }
        }

        out_tree.CHILDREN = sub_tree_children;

        if (matched_any) {
            _log_debug_match_val(in_debug, cprint.toCyan(in_indent + in_definition_key + ' [MATCHED]'));
        }

        result = contents;
    }
    while (FALSE);

    return result;
}

// ******************************

function _parse_definition_equals (out_tree, in_contents, in_definition, in_definition_key, in_definition_value, in_indent, in_debug) {
    var result = false;

    do {
        var contents = in_contents;
        var original_contents = contents;

        var regexp = in_definition_value.REGEXP || null;

        if (in_definition_key === grammar.k_DEFINITION_KEY_EMPTY) {
            _log_debug_match(in_debug, cprint.toGreen(in_indent + in_definition_key + ' [MATCHED (EMPTY)]'));
            result = contents;
            break;
        }

        if (in_definition_value.VALUE) {
            try {
                var definition_value = in_definition_value.VALUE || [];
                var options = '';
                if (in_definition_value.CASE_INSENSITIVE || g_CASE_INSENSITIVE) {
                    options += 'i';
                }
                var whitespaceRegexp = g_PARSE_AS_SEPARATE_LINES ? r_LW : r_W;
                regexp = new RegExp('^' + '(' + whitespaceRegexp + definition_value + ')' + r_v(r_AG) + '$', options);
            } catch (err) {
                throw 'Failed to create RegExp for definition key "' + in_definition_key + '"';
            }
        }

        if (!regexp) {
            throw 'RegExp hasn\'t been defined for definition key "' + in_definition_key + '"';
        }

        var matches = contents.match(regexp);
        if (!matches) {
            _log_debug_all(in_debug, cprint.toRed(in_indent + original_contents.substr(0, 100) + '...'));
            _log_debug_all(in_debug, cprint.toRed(in_indent + in_definition_key + ' [FAILED]'));
            break;
        }

        var remaining = matches[matches.length - 1];
        matches = matches = matches.slice(1, matches.length - 1);
        var value = matches[matches.length - 1];

        out_tree.VALUE = value;

        _log_debug_match_val(in_debug, cprint.toWhite('-----------------------'));
        _log_debug_match_val(in_debug, cprint.toGreen(value) + cprint.toWhite(remaining.substr(0, 50) + '...'));
        _log_debug_match_val(in_debug, cprint.toWhite('-----------------------'));
        _log_debug_match_val(in_debug, cprint.toGreen(in_indent + in_definition_key + ' [MATCHED]'));

        out_tree.REMAINING_LENGTH = remaining.length;

        result = remaining;
    }
    while (FALSE);

    return result;
}

// ******************************
// Debug Functions:
// ******************************

function _log_debug_all (in_debug_mode, in_message) {
    if (_get_debug_level(in_debug_mode) < _get_debug_level(grammar.k_DEBUG_ALL))
        return;
    process.stdout.write(in_message + '\n');
}

// ******************************

function _log_debug_match (in_debug_mode, in_message) {
    if (_get_debug_level(in_debug_mode) < _get_debug_level(grammar.k_DEBUG_MATCH))
        return;
    process.stdout.write(in_message + '\n');
}

// ******************************

function _log_debug_match_val (in_debug_mode, in_message) {
    if (_get_debug_level(in_debug_mode) < _get_debug_level(grammar.k_DEBUG_MATCH_VAL))
        return;
    process.stdout.write(in_message + '\n');
}

// ******************************

function _get_debug_level (in_debug_level) {
    switch (in_debug_level) {
    case grammar.k_DEBUG_OFF:
        return 0;
    case grammar.k_DEBUG_MATCH_VAL:
        return 1;
    case grammar.k_DEBUG_MATCH:
        return 2;
    case grammar.k_DEBUG_ALL:
        return 3;
    }
}

// ******************************
// Exports:
// ******************************

module.exports['k_DEFINITION_TYPE_HTML'] = k_DEFINITION_TYPE_HTML;
module.exports['k_DEFINITION_TYPE_SCSS'] = k_DEFINITION_TYPE_SCSS;
module.exports['k_DEFINITION_TYPE_PS1'] = k_DEFINITION_TYPE_PS1;

module.exports['parse_contents'] = parse_contents;
module.exports['setup'] = setup;

// ******************************