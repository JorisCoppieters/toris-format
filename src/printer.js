'use strict'; // JS: ES5

// ******************************
//
//
// PRINTER
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var cprint = require('color-print');
var fs = require('fs');
var parser = require('./parser');
var regexp_shorthand = require('../regexp/shorthand');
var treeFn = require('./tree');
var utils = require('./utils');

// ******************************
// Exposing Functions:
// ******************************

var r_g = regexp_shorthand.r_g;

// ******************************
// Globals:
// ******************************

var t_NL = '\n';
var g_NL = '\r\n';
var g_REGEX_NL = r_g('\\r\\n|\\r|\\n');

var g_CONVERT_LINE_ENDINGS = false;
var g_DEFINITION_TYPE = parser.k_DEFINITION_TYPE_HTML;
var g_PRINT_TREE = false;

// ******************************
// Setup Functions:
// ******************************

function setup (in_config) {
    if (!in_config) {
        return;
    }

    g_CONVERT_LINE_ENDINGS = utils.get_setup_property(in_config, "convert_line_endings", g_CONVERT_LINE_ENDINGS);
    g_DEFINITION_TYPE = utils.get_setup_property(in_config, "definition_type", g_DEFINITION_TYPE);
    g_NL = utils.get_setup_property(in_config, "line_ending", g_NL);
    g_PRINT_TREE = utils.get_setup_property(in_config, "print_tree", g_PRINT_TREE);

    parser.setup(in_config);
}

// ******************************
// Printer Functions:
// ******************************

function print_file (in_file, in_config) {
    var definition_type = null;
    var config = in_config || {};

    var file_contents = fs.readFileSync(in_file, 'utf8');
    var file_extension = utils.get_file_extension(in_file);

    switch (file_extension) {
        case 'htm':
        case 'html':
            definition_type = parser.k_DEFINITION_TYPE_HTML;
            break;

        case 'css':
        case 'scss':
            definition_type = parser.k_DEFINITION_TYPE_SCSS;
            break;

        default:
            throw 'Unhandeled file extension: ' + file_extension;
    }

    config.definition_type = definition_type;

    print_contents(file_contents, config);
}

// ******************************

function print_contents (in_contents, in_config) {
    setup(in_config || {});

    var contents = in_contents || '';
    if (g_CONVERT_LINE_ENDINGS) {
        contents = contents.replace(new RegExp(g_REGEX_NL, 'g'), t_NL);
    }

    var tree;
    try {
        tree = parser.parse_contents(in_contents);
    } catch (err) {
        cprint.red('Failed to parse:');
        cprint.red(err);
        return;
    }

    if (tree === '') {
        cprint.yellow('Empty Contents');
        return;
    }

    var tree_output = treeFn.get_tree_output(tree, in_config);
    if (!tree_output.output) {
        var failed_output = treeFn.get_failed_output(tree);
        cprint.red('Failed to parse:');
        cprint.red(failed_output);
        return;
    }

    var result = tree_output.color_output;
    if (g_CONVERT_LINE_ENDINGS) {
        result = result.replace(new RegExp(t_NL, 'g'), g_NL);
    }

    if (g_PRINT_TREE) {
        cprint.magenta(tree_output.values);
    }

    console.log(result);
}

// ******************************

function print_tree (in_tree) {
    _print_node(in_tree, '');
}

// ******************************

function _print_node (in_node, in_indent) {
    if (!in_node.DEFINITION_KEY)
        return;

    in_indent = in_indent || '';
    var definitionKey = in_node.DEFINITION_KEY;
    var definitionVal = (in_node.VALUE || '').trim();

    if (definitionVal && definitionVal.length > 50)
        cprint.yellow(in_indent + definitionKey + '===>' + definitionVal.substr(0, 50) + '...');
    else if (definitionVal)
        cprint.green(in_indent + definitionKey + '===>' + definitionVal);
    else
        cprint.cyan(in_indent + definitionKey);

    (in_node.CHILDREN || []).forEach(function (child) { _print_node(child, in_indent + '  '); });
}

// ******************************

function print_recognized_chunk (in_tree) {
    if (in_tree.FAILED) {
        console.log(treeFn.get_recognized_chunk(in_tree));
        return;
    }
    cprint.green('Everything was recognized!');
}

// ******************************

function print_contents_diff (in_expected_contents, in_contents) {
    var expected_contents = (in_expected_contents || '').replace(new RegExp(g_REGEX_NL, 'g'), t_NL);
    var contents = (in_contents || '').replace(new RegExp(g_REGEX_NL, 'g'), t_NL);

    var diff_segments_100 = _get_diff_segment(expected_contents, contents, 100);
    if (!diff_segments_100) {
        return;
    }

    var diff_segments_1 = _get_diff_segment(diff_segments_100.diff1, diff_segments_100.diff2, 1);
    if (!diff_segments_1) {
        return;
    }

    var padding = 150;

    var diff_idx1 = diff_segments_100.diff1_start + diff_segments_1.diff1_start;
    var diff_idx2 = diff_segments_100.diff2_start + diff_segments_1.diff2_start;

    if (isNaN(diff_idx1)) {
        diff_idx2++;
        var beginning_section_start = Math.max(0, diff_idx2 - padding);
        var beginning_section_length = diff_idx2 - beginning_section_start;
        var beginning_section = expected_contents.substr(beginning_section_start, beginning_section_length);
        var remaining_section = contents.substr(diff_idx2);
        console.log(cprint.toWhite(beginning_section) + cprint.toCyan(remaining_section));
    } else if (isNaN(diff_idx2)) {
        diff_idx1++;
        var beginning_section_start = Math.max(0, diff_idx1 - padding);
        var beginning_section_length = diff_idx1 - beginning_section_start;
        var beginning_section = expected_contents.substr(beginning_section_start, beginning_section_length);
        var removed_section = expected_contents.substr(diff_idx1);
        console.log(cprint.toWhite(beginning_section) + cprint.toMagenta(removed_section));
    } else {
        var beginning_section_start = Math.max(0, diff_idx1 - padding);
        var beginning_section_length = diff_idx1 - beginning_section_start;

        var remaining_section_start = diff_idx1 + 1;
        var remaining_section_length = Math.min(contents.length - remaining_section_start, padding);

        var beginning_section = expected_contents.substr(beginning_section_start, beginning_section_length);
        var correct_section = expected_contents.substr(diff_idx1, 1);

        var incorrect_section = contents.substr(diff_idx1, 1);
        if (incorrect_section === ' ') {
            incorrect_section = '☐';
        }
        else if (correct_section === ' ') {
            incorrect_section = '☒';
            diff_idx1--;
        }

        var remaining_section = contents.substr(remaining_section_start, remaining_section_length);
        console.log(cprint.toWhite(beginning_section) + cprint.toRed(incorrect_section) + cprint.toYellow(remaining_section));
    }
}

// ******************************

function _get_diff_segment (in_contents1, in_contents2, in_segment_size) {
    var result = false;

    var segment_size = in_segment_size;

    var contents1 = in_contents1 || '';
    var contents1_segment_bound_start = 0;
    var contents1_segment_bound_end = segment_size;

    var contents2 = in_contents2 || '';
    var contents2_segment_bound_start = 0;
    var contents2_segment_bound_end = segment_size;

    do {
        var contents1_segment = contents1.substr(contents1_segment_bound_start, segment_size);
        var contents2_segment = contents2.substr(contents2_segment_bound_start, segment_size);
        if (contents1_segment !== contents2_segment) {
            result = {
                diff1: contents1_segment,
                diff1_start: contents1_segment_bound_start,
                diff2: contents2_segment,
                diff2_start: contents2_segment_bound_start,
            };
            break;
        }

        if (contents1_segment_bound_start + segment_size >= contents1.length) {
            result = {
                diff1: '',
                diff1_start: NaN,
                diff2: contents2_segment,
                diff2_start: contents2_segment_bound_start,
            };
            break;
        }

        if (contents2_segment_bound_start + segment_size >= contents2.length) {
            result = {
                diff1: contents1_segment,
                diff1_start: contents1_segment_bound_start,
                diff2: '',
                diff2_start: NaN,
            };
            break;
        }

        contents1_segment_bound_start += segment_size;
        contents2_segment_bound_start += segment_size;
    }
    while (true);

    return result;
}

// ******************************
// TODO: DEPRECATE
// ******************************

function print_sass_contents (in_contents, in_indent_count, in_convert_Line_endings) {
    return print_contents(in_contents, {
        convert_line_endings: in_convert_Line_endings,
        indent_count: in_indent_count,
        definition_type: parser.k_DEFINITION_TYPE_SCSS
    });
}

// ******************************
// Exports:
// ******************************

module.exports['print_contents'] = print_contents;
module.exports['print_contents_diff'] = print_contents_diff;
module.exports['print_file'] = print_file;
module.exports['print_recognized_chunk'] = print_recognized_chunk;
module.exports['print_tree'] = print_tree;

module.exports['setup'] = setup; // TODO: DEPRECATE EXPORT
module.exports['print_sass_contents'] = print_sass_contents; // TODO: DEPRECATE

// ******************************