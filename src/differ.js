'use strict'; // JS: ES5

// ******************************
//
//
// DIFFER
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var fs = require('fs');
var parser = require('./parser');
var parserHtml = require('./parser_html');
var regexp_shorthand = require('../regexp/shorthand');
var treeFn = require('./tree');
var utils = require('./utils');
var logger = require('./logger');

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

// ******************************
// Setup Functions:
// ******************************

function setup (in_config) {
    if (!in_config) {
        return;
    }

    g_DEFINITION_TYPE = utils.get_setup_property(in_config, 'definition_type', g_DEFINITION_TYPE);
    g_CONVERT_LINE_ENDINGS = utils.get_setup_property(in_config, 'convert_line_endings', g_CONVERT_LINE_ENDINGS);
    g_NL = utils.get_setup_property(in_config, 'line_ending', g_NL);

    parser.setup(in_config);
}

// ******************************
// Differ Functions:
// ******************************

function diff_file (in_file_a, in_file_b, in_config) {
    var definition_type = null;
    var config = in_config || {};

    var file_a_contents = fs.readFileSync(in_file_a, 'utf8');
    var file_b_contents = fs.readFileSync(in_file_b, 'utf8');
    var file_extension = utils.get_file_extension(in_file_a);

    switch (file_extension) {
    case 'htm':
    case 'html':
        definition_type = parser.k_DEFINITION_TYPE_HTML;
        break;

    case 'css':
    case 'scss':
        definition_type = parser.k_DEFINITION_TYPE_SCSS;
        break;

    case 'ps1':
        definition_type = parser.k_DEFINITION_TYPE_PS1;
        break;

    default:
        throw new Error('Unhandled file extension: ' + file_extension);
    }

    config.definition_type = definition_type;

    return diff_contents(file_a_contents, file_b_contents, config);
}

// ******************************

function diff_contents (in_contents_a, in_contents_b, in_config) {
    setup(in_config);

    var contents_a = in_contents_a || '';
    var contents_b = in_contents_b || '';

    if (g_CONVERT_LINE_ENDINGS) {
        contents_a = contents_a.replace(new RegExp(g_REGEX_NL, 'g'), t_NL);
        contents_b = contents_b.replace(new RegExp(g_REGEX_NL, 'g'), t_NL);
    }

    if (g_DEFINITION_TYPE === parser.k_DEFINITION_TYPE_HTML) {
        return parserHtml.diff_html_contents(contents_a, contents_b);
    }

    // var tree;
    // try {
    //     tree = parser.parse_contents(in_contents);
    // } catch (err) {
    //     throw new Error('Failed to parse:\n' + err);
    // }

    // if (tree === '') {
    //     return '';
    // }

    // var tree_output = treeFn.get_tree_output(tree, in_config);
    // if (!tree_output.output) {
    //     var failed_output = treeFn.get_failed_output(tree, logger.CONFIG.logColour);
    //     throw new Error('Failed to parse:\n' + failed_output)
    // }

    // var result = tree_output.output;
    // if (g_CONVERT_LINE_ENDINGS) {
    //     result = result.replace(new RegExp(t_NL, 'g'), g_NL);
    // }

    return result;
}

// ******************************
// TODO: DEPRECATE
// ******************************

function diff_sass_contents (in_contents, in_indent_count, in_convert_Line_endings) {
    return diff_contents(in_contents, {
        convert_line_endings: in_convert_Line_endings,
        indent_count: in_indent_count,
        definition_type: parser.k_DEFINITION_TYPE_SCSS
    });
}

// ******************************
// Exports:
// ******************************

module.exports['diff_contents'] = diff_contents;
module.exports['diff_file'] = diff_file;

module.exports['setup'] = setup; // TODO: DEPRECATE EXPORT
module.exports['diff_sass_contents'] = diff_sass_contents; // TODO: DEPRECATE

// ******************************