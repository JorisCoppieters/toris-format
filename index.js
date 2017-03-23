'use strict'; // JS: ES5

// ******************************
//
//
// TORIS FORMAT v1.6.1
//
// Version History:
//
// 1.6.1
// - Added support for vh as a measurement in CSS grammar
// - Added support for >>> as a selector in CSS grammar
// - Added option to add noopener noreferrer to <a target="_blank"><a/> links
//
// 1.6.0
// - Started work on refactoring into proper AST with Grammar files
// - Added support for scss files
//
// 1.5.1
// - Bug fix around whitespace before content within block elements
//
// 1.5.0
// - Refactored attribute value object parsing
// - Added proper class name parsing
// - Fixed bug with object values not being able to contain commas
//
// 1.4.5
// - Replaced g_ORDER_MULTI_CLASSES_ALPHABETICALLY config key with g_MULTI_CLASSES_ORDER
//
// 1.4.4
// - Added g_ORDER_MULTI_CLASSES_ALPHABETICALLY config key
//
// 1.4.3
// - Fixed config issue in get_setup_property
//
// 1.4.2
// - Deprecated Config keys: NG1_ATTRIBUTES_ORDER, NG1_ATTRIBUTES_ORDER_PRE_NATIVE, NG2_ATTRIBUTES_ORDER, NG2_ATTRIBUTES_ORDER_PRE_NATIVE
// - Added g_NG_ATTRIBUTES_ORDER, g_NG_ATTRIBUTES_ORDER_PRE_NATIVE and require angular_version to be set
// - Added g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST opttion
// - Fixed object binding values not being able to have '<' & '>' characters
// - Split base test into NG1/non-NG1 tests
// - Improved tests
// - Some clean up
//
// 1.4.1
// - Fixed key regex for binding property
// - Fixed key regex for binding two way property
// - Fixed key regex for binding event
// - Fixed key regex for binding custom directive
// - Added <div> wrapping as fallback to HTML content with multiple parent nodes
// - Added option to allow empty files
//
// 1.4.0
// - Stable release
//
// ******************************

// ******************************
// Requires:
// ******************************

var parser = require('./src/parser');
var utils = require('./src/utils');
var cprint = require('color-print');
var fs = require('fs');
var fsp = require('fs-process');
var re = require('./regexp/shorthand');

// ******************************
// Constants:
// ******************************

const k_VERSION = '1.6.1';

// ******************************
// Globals:
// ******************************

// Config - General:
var g_DEFINITION_TYPE = parser.k_DEFINITION_TYPE_HTML;
var g_DEBUG = false;

// Config - Indenting:
var g_INDENT_COUNT = 0;
var g_INDENT = '    ';

// RegEx:
var t_NL = '\n';
var g_NL = '\r\n';
var g_REGEX_NL = re.r_g('\\r\\n|\\r|\\n');

// ******************************
// Setup Functions:
// ******************************

function setup (in_config) {
  if (!in_config) {
    return;
  }

  // General:
  g_NL = utils.get_setup_property(in_config, "line_ending", g_NL);
  g_DEFINITION_TYPE = utils.get_setup_property(in_config, "definition_type", g_DEFINITION_TYPE);
  g_DEBUG = utils.get_setup_property(in_config, "debug", g_DEBUG);
  parser.setup(in_config);
}

// ******************************
// SCSS Format Functions:
// ******************************

function format_sass_contents (in_contents, in_indent_count, in_convert_newlines) {
  return _format_contents(
    in_contents,
    {
      indent_count: in_indent_count || 0,
      definition_type: parser.k_DEFINITION_TYPE_SCSS
    },
    in_convert_newlines
  );
}

// ******************************

function print_sass_contents (in_contents, in_indent_count, in_convert_newlines) {
  _print_contents(
    in_contents,
    {
      indent_count: in_indent_count || 0,
      definition_type: parser.k_DEFINITION_TYPE_SCSS
    },
    in_convert_newlines
  );
}

// ******************************
// HTML Format Functions:
// ******************************

function format_html_contents (in_contents, in_indent_count, in_convert_newlines) {
  return _format_contents(
    in_contents,
    {
      indent_count: in_indent_count || 0,
      definition_type: parser.k_DEFINITION_TYPE_HTML
    },
    in_convert_newlines
  );
}

// ******************************

function print_html_contents (in_contents, in_indent_count, in_convert_newlines) {
  _print_contents(
    in_contents,
    {
      indent_count: in_indent_count || 0,
      definition_type: parser.k_DEFINITION_TYPE_HTML
    },
    in_convert_newlines
  );
}

// ******************************
// Helper Functions:
// ******************************

function _format_contents (in_contents, in_parser_config, in_convert_newlines) {
  var contents = in_contents || '';
  if (in_convert_newlines) {
    contents = contents.replace(new RegExp(g_REGEX_NL, 'g'), t_NL);
  }

  parser.setup(in_parser_config || {});

  var tree;
  try {
    tree = parser.parse_contents(in_contents);
  } catch (err) {
    throw 'Failed to parse:\n' + err;
    return;
  }

  if (tree === '') {
    return '';
  }

  var tree_output = parser.output_tree(tree);
  if (!tree_output.output) {
    var failed_output = get_failed_output(tree, contents);
    throw 'Failed to parse:\n' + failed_output;
  }

  // writeDebugFile('./_debug_ast_structure.txt', tree_output.values);

  var result = tree_output.output;
  if (in_convert_newlines) {
    result = result.replace(new RegExp(t_NL, 'g'), g_NL);
  }
  return result;
}

// ******************************

function _print_contents (in_contents, in_parser_config, in_convert_newlines) {
  var contents = in_contents || '';
  if (in_convert_newlines) {
    contents = contents.replace(new RegExp(g_REGEX_NL, 'g'), t_NL);
  }

  parser.setup(in_parser_config || {});

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

  var tree_output = parser.output_tree(tree);
  if (!tree_output.output) {
    var failed_output = get_failed_output(tree, contents);
    cprint.red('Failed to parse:');
    cprint.red(failed_output);
    return;
  }

  // writeDebugFile('./_debug_ast_structure.txt', tree_output.values);

  var result = tree_output.color_output;
  if (in_convert_newlines) {
    result = result.replace(new RegExp(t_NL, 'g'), g_NL);
  }
  console.log(result);
}

// ******************************

function print_contents_diff (in_expected_contents, in_contents) {
  var expected_contents = (in_expected_contents || '').replace(new RegExp(g_REGEX_NL, 'g'), t_NL);
  var contents = (in_contents || '').replace(new RegExp(g_REGEX_NL, 'g'), t_NL);

  var diff_segments_100 = get_diff_segment(expected_contents, contents, 100);
  if (!diff_segments_100) {
    return;
  }

  var diff_segments_1 = get_diff_segment(diff_segments_100.diff1, diff_segments_100.diff2, 1);
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

function get_diff_segment (in_contents1, in_contents2, in_segment_size) {
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

function get_failed_output (in_tree, in_contents) {
  var tree_output_failed = parser.output_tree_failed(in_tree);
  var recognised_contents_length = Math.max(0, in_contents.length - tree_output_failed.least_remaining);
  var unrecognised_contents_length = 100;

  var recognised_contents = in_contents.substr(0, recognised_contents_length);
  var unrecognised_contents = in_contents.substr(recognised_contents_length, unrecognised_contents_length);
  while (unrecognised_contents.trim().length === 0 && unrecognised_contents_length < in_contents.length - recognised_contents_length) {
    unrecognised_contents_length += 10;
    unrecognised_contents = in_contents.substr(recognised_contents_length, unrecognised_contents_length);
  }

  if (recognised_contents.length > 100) {
    recognised_contents = recognised_contents.substr(recognised_contents.length - 100, 100);
  }

  // writeDebugFile('./_debug_ast_failed_structure.txt', tree_output_failed.values);

  unrecognised_contents += '...';
  var result = cprint.toGreen(recognised_contents) + cprint.toRed(unrecognised_contents);
  if (g_DEBUG) {
    result += '\n\n' + cprint.toYellow('Best Path:' + tree_output_failed.best_path);
  }
  return result;
}

// ******************************

function writeDebugFile (in_file_name, in_file_contents) {
  var writeFileFn = function () {
    if (g_DEBUG) {
      fsp.write(in_file_name, in_file_contents);
    }
  }

  if (!fs.existsSync(in_file_name)) {
    writeFileFn();
  }
}

// ******************************
// Exports:
// ******************************

module.exports['k_VERSION'] = k_VERSION;

module.exports['k_DEFINITION_TYPE_HTML'] = parser.k_DEFINITION_TYPE_HTML;
module.exports['format_html_contents'] = format_html_contents;
module.exports['print_html_contents'] = print_html_contents;

module.exports['k_DEFINITION_TYPE_SCSS'] = parser.k_DEFINITION_TYPE_SCSS;
module.exports['format_sass_contents'] = format_sass_contents;
module.exports['print_sass_contents'] = print_sass_contents;

module.exports['print_contents_diff'] = print_contents_diff;
module.exports['setup'] = setup;

// ******************************