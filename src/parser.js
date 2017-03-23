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

var checks = require('./checks');
var cprint = require('color-print');
var FORMATTER_SCSS = require('../formatters/scss');
var FORMATTER_SCSS_OLD = require('../formatters/scss_old');
var FORMATTER_TANGRAM_API = require('../formatters/tangram_api');
var grammar  = require('../grammars/_core');
var GRAMMAR_HTML = require('../grammars/html');
var GRAMMAR_SCSS = require('../grammars/scss');
var GRAMMAR_SCSS_OLD = require('../grammars/scss_old');
var GRAMMAR_TANGRAM_API = require('../grammars/tangram_api');
var regexp_shorthand = require('../regexp/shorthand');
var utils = require('./utils');

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
// Constants:
// ******************************

const k_DEFINITION_TYPE_HTML = 'HTML';
const k_DEFINITION_TYPE_SCSS = 'SCSS';
const k_DEFINITION_TYPE_TANGRAM_API = 'TANGRAM_API';

// ******************************
// Globals:
// ******************************

var g_DEBUG = false;
var g_PRINT_TREE = false;
var g_RUN_CHECKS = false;

var g_NL = '\n';

// Config - General:
var g_ALLOW_EMPTY_CONTENT = false;
var g_DEFINITION_TYPE = k_DEFINITION_TYPE_HTML;

// Config - Indenting:
var g_INDENT_COUNT = 0;
var g_INDENT = '    ';

// Config - SASS:
var g_FORMAT_PROPERTY_VALUES_ON_NEWLINES = [];

// ******************************
// Setup Functions:
// ******************************

function setup (in_config) {
  if (!in_config) {
    return;
  }

  // General:
  g_ALLOW_EMPTY_CONTENT = utils.get_setup_property(in_config, "allow_empty", g_ALLOW_EMPTY_CONTENT);
  g_DEBUG = utils.get_setup_property(in_config, "debug", g_DEBUG);
  g_PRINT_TREE = utils.get_setup_property(in_config, "print_tree", g_PRINT_TREE);
  g_RUN_CHECKS = utils.get_setup_property(in_config, "run_checks", g_RUN_CHECKS);
  g_DEFINITION_TYPE = utils.get_setup_property(in_config, "definition_type", g_DEFINITION_TYPE);
  g_INDENT = utils.get_setup_property(in_config, "indent", g_INDENT);
  g_INDENT_COUNT = utils.get_setup_property(in_config, "indent_count", g_INDENT_COUNT);

  if (g_DEFINITION_TYPE === k_DEFINITION_TYPE_HTML) {
    // HTML:

  } else if (g_DEFINITION_TYPE === k_DEFINITION_TYPE_SCSS) {
    // SASS:
    g_FORMAT_PROPERTY_VALUES_ON_NEWLINES = utils.get_setup_property(in_config, "format_property_values_on_newlines", g_FORMAT_PROPERTY_VALUES_ON_NEWLINES);
  }
}

// ******************************
// Functions:
// ******************************

function parse_contents (in_contents) {
  var fn = 'parse_contents';
  var result = false;

  do {
    var contents = in_contents || '';
    if (contents.trim().length === 0) {
      if (g_ALLOW_EMPTY_CONTENT) {
        return '';
      }
      throw_error(fn, 'No content to parse!');
    }

    var definition;

    switch(g_DEFINITION_TYPE) {
      case k_DEFINITION_TYPE_HTML:
        throw_error(fn, 'HTML parsing not supported yet...');
        // definition = GRAMMAR_HTML;
        break;

      case k_DEFINITION_TYPE_SCSS:
        definition = GRAMMAR_SCSS_OLD;
        break;

      case k_DEFINITION_TYPE_TANGRAM_API:
        definition = GRAMMAR_TANGRAM_API;
        break;

      default:
        throw_error(fn, 'Unhandled definition type: ' + g_DEFINITION_TYPE);
    }

    if (!grammar.k_DEFINITION_KEY_START) {
      throw_error(fn, 'Definition doesn\'t have starting element: ' + g_DEFINITION_TYPE);
    }

    if (g_RUN_CHECKS) {
      try {
        checks.check_grammar(definition);
      } catch (err) {
        throw_error(fn, err);
      }
    }

    if (g_PRINT_TREE) {
      definition[grammar.k_DEFINITION_KEY_START].DEBUG = grammar.k_DEBUG_MATCH_VAL;
    }

    var tree = {}
    parse_definition_key(tree, contents, definition, grammar.k_DEFINITION_KEY_START);
    result = tree;
  }
  while (false);

  return result;
}

// ******************************

function parse_definition_key (out_tree, in_contents, in_definition, in_definition_key, in_indent, in_debug) {
  var fn = 'parse_definition_key';
  var result = false;

  do {
    var contents = in_contents || '';
    var original_contents = contents;

    if (contents.trim().length === 0) {
      result = false;
      break;
    }

    var definition_key = (in_definition_key) ? in_definition_key : grammar.k_DEFINITION_KEY_START;
    var definition_value = in_definition[definition_key];

    if (!definition_value) {
      throw_error(fn, 'Couldn\'t find definition key!', definition_key);
    }

    var tree = out_tree || {};
    var indent = in_indent || '';
    var debug = (definition_value.DEBUG || in_debug || grammar.k_DEBUG_OFF);

    var is_start = (definition_key === grammar.k_DEFINITION_KEY_START);
    if (is_start) {
      tree.INPUT = original_contents;
      contents = contents.replace(new RegExp(r_g('\\r\\n|\\r|\\n'), 'g'), g_NL);
    }

    log_debug_match(debug, cprint.toWhite(indent + definition_key));

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
        throw_error(fn, 'Invalid operator: ' + definition_value.OPERATOR, definition_key);
        break;
    }

    tree.DEFINITION_KEY = definition_key;

    if ((!tree.VALUE && !tree.CHILDREN) || result.trim() !== '') {
      if (is_start) {
        tree.FAILED = true;
      }
      result = '';
      break;
    }
  }
  while (false);

  return result;
}

// ******************************

function _parse_definition_or (out_tree, in_contents, in_definition, in_definition_key, in_definition_value, in_indent, in_debug) {
  var fn = '_parse_definition_or';
  var result = false;

  do {
    var segments = in_definition_value.SEGMENTS || [];
    if (!segments) {
      throw_error(fn, 'Segments haven\'t been defined', in_definition_key);
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
      log_debug_all(in_debug, cprint.toRed(in_indent + in_definition_key + ' [FAILED]'));
      break;
    }

    out_tree.CHILDREN = [matched_sub_tree];

    if (matched) {
      log_debug_match_val(in_debug, cprint.toCyan(in_indent + in_definition_key + ' [MATCHED]'));
    }

    result = remaining;
  }
  while (false);

  return result;
}

// ******************************

function _parse_definition_and (out_tree, in_contents, in_definition, in_definition_key, in_definition_value, in_indent, in_debug) {
  var fn = '_parse_definition_and';
  var result = false;

  do {
    var segments = in_definition_value.SEGMENTS || [];
    if (!segments) {
      throw_error(fn, 'Segments haven\'t been defined', in_definition_key);
    }

    var contents = in_contents;
    var original_contents = contents;

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
      log_debug_all(in_debug, cprint.toRed(in_indent + in_definition_key + ' [FAILED]'));
      break;
    }

    out_tree.CHILDREN = sub_tree_children;

    if (matched) {
      log_debug_match_val(in_debug, cprint.toCyan(in_indent + in_definition_key + ' [MATCHED]'));
    }

    result = remaining;
  }
  while (false);

  return result;
}

// ******************************

function _parse_definition_multiple (out_tree, in_optional, in_contents, in_definition, in_definition_key, in_definition_value, in_indent, in_debug) {
  var fn = '_parse_definition_multiple';
  var result = false;

  do {
    var segments = in_definition_value.SEGMENTS || [];
    if (!segments) {
      throw_error(fn, 'Segments haven\'t been defined', in_definition_key);
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
        log_debug_all(in_debug, cprint.toRed(in_indent + in_definition_key + ' [FAILED]'));
        break;
      }
    }

    out_tree.CHILDREN = sub_tree_children;

    if (matched_any) {
      log_debug_match_val(in_debug, cprint.toCyan(in_indent + in_definition_key + ' [MATCHED]'));
    }

    result = contents;
  }
  while (false);

  return result;
}

// ******************************

function _parse_definition_equals (out_tree, in_contents, in_definition, in_definition_key, in_definition_value, in_indent, in_debug) {
  var fn = '_parse_definition_equals';
  var result = false;

  do {
    var contents = in_contents;
    var original_contents = contents;

    var regexp = in_definition_value.REGEXP || null;

    if (in_definition_key === grammar.k_DEFINITION_KEY_EMPTY) {
      log_debug_match(in_debug, cprint.toGreen(in_indent + in_definition_key + ' [MATCHED (EMPTY)]'));
      result = contents;
      break;
    }

    if (in_definition_value.VALUE) {
      try {
        var value = in_definition_value.VALUE || [];
        regexp = new RegExp('^' + '(' + r_W + value + ')' + r_v(r_AG) + '$');
      } catch (err) {
        throw_error(fn, 'Failed to create RegExp', in_definition_key);
      }
    }

    if (!regexp) {
      throw_error(fn, 'RegExp hasn\'t been defined', in_definition_key);
    }

    var matches = contents.match(regexp);
    if (!matches) {
      log_debug_all(in_debug, cprint.toRed(in_indent + original_contents.substr(0, 100) + '...'));
      log_debug_all(in_debug, cprint.toRed(in_indent + in_definition_key + ' [FAILED]'));
      break;
    }

    var remaining = matches[matches.length - 1];
    matches = matches = matches.slice(1, matches.length - 1);
    var value = matches[matches.length - 1];

    out_tree.VALUE = value;

    log_debug_match_val(in_debug, cprint.toWhite('-----------------------'));
    log_debug_match_val(in_debug, cprint.toGreen(value) + cprint.toWhite(remaining.substr(0, 50) + '...'));
    log_debug_match_val(in_debug, cprint.toWhite('-----------------------'));
    log_debug_match_val(in_debug, cprint.toGreen(in_indent + in_definition_key + ' [MATCHED]'));

    out_tree.REMAINING_LENGTH = remaining.length;

    result = remaining;
  }
  while (false);

  return result;
}

// ******************************

function get_tree_output (in_tree) {
  var state = { LAST_TOKEN: '' };
  var tree_output = {};
  var indent = '';

  _populate_tree_output(in_tree, state, tree_output, indent);

  return tree_output;
}

// ******************************

function _populate_tree_output (in_tree, in_state, in_tree_output, in_indent) {
  var fn = '_populate_tree_output';

  var state = in_state;
  var tree_output = in_tree_output;
  var indent = in_indent;

  if (in_tree.FAILED) {
    return tree_output;
  }

  var definition_key = in_tree.DEFINITION_KEY;
  var definition_value = (in_tree.VALUE || '').trim();

  var output;

  switch(g_DEFINITION_TYPE) {
    case k_DEFINITION_TYPE_HTML:
      throw_error(fn, 'HTML outputting not supported yet...');
      break;

    case k_DEFINITION_TYPE_TANGRAM_API:
      output = {};
      break;

    case k_DEFINITION_TYPE_SCSS:
      var options = {
        DEBUG: g_DEBUG,
        FORMAT_PROPERTY_VALUES_ON_NEWLINES: g_FORMAT_PROPERTY_VALUES_ON_NEWLINES,
      }
      output = FORMATTER_SCSS_OLD.get_output(in_tree.DEFINITION_KEY, in_tree.VALUE, state, options);
      break;

    default:
      throw_error(fn, 'Unhandled definition type: ' + g_DEFINITION_TYPE);
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
    inc_indent(pre_indent);
  }

  var output_indent = get_indent();

  if (post_indent != 0) {
    inc_indent(post_indent);
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
      _populate_tree_output(child, state, tree_output, indent + '  ');
    });
  }
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

function get_tree_output_structure (in_tree) {
  var structure;
  switch(g_DEFINITION_TYPE) {
    case k_DEFINITION_TYPE_HTML:
      throw_error(fn, 'HTML structure not supported yet...');
      break;

    case k_DEFINITION_TYPE_TANGRAM_API:
      var options = {
        DEBUG: g_DEBUG
      }
      structure = FORMATTER_TANGRAM_API.get_tree_output_structure(in_tree, options);
      break;

    case k_DEFINITION_TYPE_SCSS:
      throw_error(fn, 'SCSS structure not supported yet...');
      break;

    default:
      throw_error(fn, 'Unhandled definition type: ' + g_DEFINITION_TYPE);
  }

  return structure;
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
    console.log(get_recognized_chunk(in_tree));
    return;
  }
  cprint.green('Everything was recognized!');
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
  var recognised_contents_length = Math.max(0, in_contents.length - in_failed_tree_output.least_remaining);

  var recognised_contents = in_contents.substr(0, recognised_contents_length);
  if (recognised_contents.length > 100) {
    recognised_contents = recognised_contents.substr(recognised_contents.length - 100, 100);
  }

  return recognised_contents;
}

// ******************************

function _get_unrecognized_contents (in_failed_tree_output, in_contents) {
  var recognised_contents_length = Math.max(0, in_contents.length - in_failed_tree_output.least_remaining);
  var unrecognised_contents_length = 100;

  var unrecognised_contents = in_contents.substr(recognised_contents_length, unrecognised_contents_length);
  while (unrecognised_contents.trim().length === 0 && unrecognised_contents_length < in_contents.length - recognised_contents_length) {
    unrecognised_contents_length += 10;
    unrecognised_contents = in_contents.substr(recognised_contents_length, unrecognised_contents_length);
  }

  return unrecognised_contents;
}

// ******************************

function get_indent (in_inc) {
  return utils.str_repeat(g_INDENT, g_INDENT_COUNT + (in_inc || 0));
}

// ******************************

function inc_indent (in_inc) {
  g_INDENT_COUNT = Math.max(0, g_INDENT_COUNT + (in_inc || 0));
}

// ******************************

function log_debug_all (in_debug_mode, in_message) {
  if (get_debug_level(in_debug_mode) < get_debug_level(grammar.k_DEBUG_ALL))
    return;
  console.log(in_message);
}

// ******************************

function log_debug_match (in_debug_mode, in_message) {
  if (get_debug_level(in_debug_mode) < get_debug_level(grammar.k_DEBUG_MATCH))
    return;
  console.log(in_message);
}

// ******************************

function log_debug_match_val (in_debug_mode, in_message) {
  if (get_debug_level(in_debug_mode) < get_debug_level(grammar.k_DEBUG_MATCH_VAL))
    return;
  console.log(in_message);
}

// ******************************

function get_debug_level (in_debug_level, in_message) {
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

function throw_error (in_function_name, in_message, in_definition_key) {
  if (in_definition_key) {
    throw in_function_name + ': [' + in_definition_key + '] ' + in_message;
  }

  throw in_function_name + ': ' + in_message;
}

// ******************************
// Exports:
// ******************************

module.exports['k_DEFINITION_TYPE_HTML'] = k_DEFINITION_TYPE_HTML;
module.exports['k_DEFINITION_TYPE_SCSS'] = k_DEFINITION_TYPE_SCSS;
module.exports['k_DEFINITION_TYPE_TANGRAM_API'] = k_DEFINITION_TYPE_TANGRAM_API;
module.exports['setup'] = setup;
module.exports['parse_contents'] = parse_contents;
module.exports['print_tree'] = print_tree;
module.exports['print_recognized_chunk'] = print_recognized_chunk;
module.exports['get_recognized_chunk'] = get_recognized_chunk;
module.exports['get_tree_output'] = get_tree_output;
module.exports['get_failed_tree_output'] = get_failed_tree_output;
module.exports['get_tree_output_structure'] = get_tree_output_structure;

module.exports['parseContents'] = parse_contents;
module.exports['printTree'] = print_tree;
module.exports['printRecognizedChunk'] = print_recognized_chunk;
module.exports['getRecognizedChunk'] = get_recognized_chunk;
module.exports['getTreeOutput'] = get_tree_output;
module.exports['getFailedTreeOutput'] = get_failed_tree_output;
module.exports['getTreeOutputStructure'] = get_tree_output_structure;

// ******************************