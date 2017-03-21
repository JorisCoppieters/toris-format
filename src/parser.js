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

var utils = require('./utils');
var cprint = require('color-print');
var grammar_utils = require('../grammars/utils');

var GRAMMAR_SCSS = require('../grammars/scss');
var GRAMMAR_SCSS_OUTPUT = require('../grammars/scss_output');
var GRAMMAR_HTML = require('../grammars/html');
var GRAMMAR_HTML_OUTPUT = require('../grammars/html_output');

// ******************************
// Exposing Functions:
// ******************************

var r_A = grammar_utils.r_A;
var r_AG = grammar_utils.r_AG;
var r_W = grammar_utils.r_W;
var r_S = grammar_utils.r_S;
var r_w = grammar_utils.r_w;
var r_g = grammar_utils.r_g;
var r_v = grammar_utils.r_v;
var r_dq = grammar_utils.r_dq;
var r_sq = grammar_utils.r_sq;

// ******************************
// Constants:
// ******************************

const k_DEFINITION_TYPE_HTML = 'HTML';
const k_DEFINITION_TYPE_SCSS = 'SCSS';
const k_DEFINITION_KEY_START = 'START';
const k_DEFINITION_KEY_EMPTY = 'EMPTY';

const k_DEBUG_ON = 'ON';
const k_DEBUG_OFF = 'OFF';

// ******************************
// Globals:
// ******************************

var g_DEBUG = false;
var g_NL = '\n';

// Config - General:
var g_ALLOW_EMPTY_CONTENT = false;
var g_DEFINITION_TYPE = k_DEFINITION_TYPE_HTML;

// Config - Indenting:
var g_INDENT_COUNT = 0;
var g_INDENT = '    ';

// Config - HTML (Base):
var g_BLOCK_ELEMENTS_BASE = ['address', 'blockquote', 'center', 'dir', 'div', 'dl', 'fieldset', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'isindex', 'menu', 'noframes', 'noscript', 'ol', 'p', 'pre', 'table', 'ul'];
var g_INLINE_ELEMENTS_BASE = ['a', 'abbr', 'acronym', 'b', 'basefont', 'bdo', 'big', 'br', 'cite', 'code', 'dfn', 'em', 'font', 'i', 'img', 'input', 'kbd', 'label', 'q', 's', 'samp', 'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'textarea', 'tt', 'u', 'var'];
var g_ONE_TIME_BOUND_ELEMENT_PREFIXES_BASE = ['ng-'];
var g_SELF_CLOSING_HTML_TAGS_BASE = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

// Config - HTML:
var g_ALLOW_EMPTY_FILES = false;
var g_ADD_NOOPENER_NOREFERRER = false;
var g_ANGULAR_VERSION = 1;
var g_BLOCK_ELEMENTS = g_BLOCK_ELEMENTS_BASE;
var g_FORCE_BLOCK_WHITESPACE_FORMATTING = false;
var g_FORCE_INLINE_WHITESPACE_FORMATTING = false;
var g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST = -1;
var g_INLINE_ELEMENTS = g_INLINE_ELEMENTS_BASE;
var g_MULTI_CLASSES_ORDER = [];
var g_NG_ATTRIBUTES_ORDER = [];
var g_NG_ATTRIBUTES_ORDER_PRE_NATIVE = [];
var g_NONE_ONE_TIME_BOUND_ELEMENTS = [];
var g_ONE_TIME_BOUND_ELEMENT_PREFIXES = g_ONE_TIME_BOUND_ELEMENT_PREFIXES_BASE;
var g_REMOVE_CSS = false;
var g_SELF_CLOSING_HTML_TAGS = g_SELF_CLOSING_HTML_TAGS_BASE;

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
  g_DEFINITION_TYPE = utils.get_setup_property(in_config, "definition_type", g_DEFINITION_TYPE);
  g_INDENT = utils.get_setup_property(in_config, "indent", g_INDENT);
  g_INDENT_COUNT = utils.get_setup_property(in_config, "indent_count", g_INDENT);

  if (g_DEFINITION_TYPE === k_DEFINITION_TYPE_HTML) {
    // HTML:
    g_ADD_NOOPENER_NOREFERRER = utils.get_setup_property(in_config, "add_noopener_noreferrer", g_ADD_NOOPENER_NOREFERRER);
    g_ANGULAR_VERSION = utils.get_setup_property(in_config, ["angular_version", "ng_version"], g_ANGULAR_VERSION);
    g_BLOCK_ELEMENTS = utils.get_setup_property(in_config, "block_elements", g_BLOCK_ELEMENTS, g_BLOCK_ELEMENTS_BASE);
    g_FORCE_BLOCK_WHITESPACE_FORMATTING = utils.get_setup_property(in_config, "force_block_whitespace_formatting", g_FORCE_BLOCK_WHITESPACE_FORMATTING);
    g_FORCE_INLINE_WHITESPACE_FORMATTING = utils.get_setup_property(in_config, "force_inline_whitespace_formatting", g_FORCE_INLINE_WHITESPACE_FORMATTING);
    g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST = utils.get_setup_property(in_config, "format_multi_classes_with_at_least", g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST);
    g_INLINE_ELEMENTS = utils.get_setup_property(in_config, "inline_elements", g_INLINE_ELEMENTS, g_INLINE_ELEMENTS_BASE);
    g_MULTI_CLASSES_ORDER = utils.get_setup_property(in_config, "multi_classes_order", g_MULTI_CLASSES_ORDER);
    g_NG_ATTRIBUTES_ORDER = utils.get_setup_property(in_config, "ng_attributes_order", g_NG_ATTRIBUTES_ORDER);
    g_NG_ATTRIBUTES_ORDER_PRE_NATIVE = utils.get_setup_property(in_config, "ng_attributes_order_pre_native", g_NG_ATTRIBUTES_ORDER_PRE_NATIVE);
    g_NONE_ONE_TIME_BOUND_ELEMENTS = utils.get_setup_property(in_config, "none_one_time_bound_elements", g_NONE_ONE_TIME_BOUND_ELEMENTS);
    g_ONE_TIME_BOUND_ELEMENT_PREFIXES = utils.get_setup_property(in_config, "one_time_bound_element_prefixes", g_ONE_TIME_BOUND_ELEMENT_PREFIXES, g_ONE_TIME_BOUND_ELEMENT_PREFIXES_BASE);
    g_REMOVE_CSS = utils.get_setup_property(in_config, "remove_css", g_REMOVE_CSS);
    g_SELF_CLOSING_HTML_TAGS = utils.get_setup_property(in_config, "self_closing_tags", g_SELF_CLOSING_HTML_TAGS, g_SELF_CLOSING_HTML_TAGS_BASE);

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
        definition = GRAMMAR_HTML;
        break;

      case k_DEFINITION_TYPE_SCSS:
        definition = GRAMMAR_SCSS;
        break;

      default:
        throw_error(fn, 'Unhandled definition type: ' + g_DEFINITION_TYPE);
    }

    // definition[k_DEFINITION_KEY_START].DEBUG = 'ON';

    var tree = {}
    parse_definition_key(tree, contents, definition, k_DEFINITION_KEY_START);
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
      result = '';
      break;
    }

    var definition_key = (in_definition_key) ? in_definition_key : k_DEFINITION_KEY_START;
    var definition_value = in_definition[definition_key];

    if (!definition_value) {
      throw_error(fn, 'Couldn\'t find definition key!', definition_key);
    }

    var tree = out_tree || {};
    var indent = in_indent || '';
    var debug = (definition_value.DEBUG || in_debug || k_DEBUG_OFF);

    var is_start = (definition_key === k_DEFINITION_KEY_START);
    if (is_start) {
      contents = contents.replace(new RegExp(r_g('\\r\\n|\\r|\\n'), 'g'), g_NL);
    }

    if (debug === k_DEBUG_ON) {
      cprint.white(indent + definition_key);
    }

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

    if (is_start) {
      if (result !== '') {
        tree.FAILED = true;
        result = '';
      }
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
      if (in_debug === k_DEBUG_ON) {
        cprint.red(in_indent + in_definition_key + ' [FAILED]');
        break;
      }
    }

    out_tree.CHILDREN = [matched_sub_tree];

    if (in_debug === k_DEBUG_ON) {
      cprint.cyan(in_indent + in_definition_key + '[MATCHED]');
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
      if (in_debug === k_DEBUG_ON) {
        cprint.red(in_indent + in_definition_key + ' [FAILED]');
        break;
      }
    }

    out_tree.CHILDREN = sub_tree_children;

    if (in_debug === k_DEBUG_ON) {
      cprint.cyan(in_indent + in_definition_key + '[MATCHED]');
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
        if (in_debug === k_DEBUG_ON) {
          cprint.red(in_indent + in_definition_key + ' [FAILED]');
        }
        break;
      }
    }

    out_tree.CHILDREN = sub_tree_children;

    if (in_debug === k_DEBUG_ON) {
      cprint.cyan(in_indent + in_definition_key + '[MATCHED]');
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

    if (in_definition_key === k_DEFINITION_KEY_EMPTY) {
      if (in_debug === k_DEBUG_ON) {
        cprint.green(in_indent + in_definition_key + ' [MATCHED (EMPTY)]');
      }
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
      if (in_debug === k_DEBUG_ON) {
        cprint.red(in_indent + original_contents.substr(0, 100) + '...');
        cprint.red(in_indent + in_definition_key + ' [FAILED]');
      }
      break;
    }

    var remaining = matches[matches.length - 1];
    matches = matches = matches.slice(1, matches.length - 1);

    out_tree.VALUE = matches[matches.length - 1];

    if (in_debug === k_DEBUG_ON) {
      cprint.yellow(in_indent + original_contents.substr(0, 100) + '...');
      cprint.green(in_indent + remaining.substr(0, 100) + '...');
      cprint.green(in_indent + in_definition_key + ' [MATCHED]');
    }

    out_tree.REMAINING_LENGTH = remaining.length;

    result = remaining;
  }
  while (false);

  return result;
}

// ******************************

function output_tree (in_tree, in_state, in_tree_output, in_indent) {
  var fn = 'output_tree';
  var state = in_state || { LAST_TOKEN: '' };
  var tree_output = in_tree_output || {};
  var indent = in_indent || '';

  if (in_tree.FAILED) {
    return tree_output;
  }

  var definition_key = in_tree.DEFINITION_KEY;
  var definition_value = (in_tree.VALUE || '').trim();

  var output;

  switch(g_DEFINITION_TYPE) {
    case k_DEFINITION_TYPE_HTML:
      var options = {
        DEBUG: g_DEBUG
      }
      output = GRAMMAR_HTML_OUTPUT.get_output(in_tree.DEFINITION_KEY, in_tree.VALUE, state, options);
      break;

    case k_DEFINITION_TYPE_SCSS:
      var options = {
        DEBUG: g_DEBUG,
        FORMAT_PROPERTY_VALUES_ON_NEWLINES: g_FORMAT_PROPERTY_VALUES_ON_NEWLINES,
      }
      output = GRAMMAR_SCSS_OUTPUT.get_output(in_tree.DEFINITION_KEY, in_tree.VALUE, state, options);
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
      output_tree(child, state, tree_output, indent + '  ');
    });
  }

  return tree_output;
}

// ******************************

function output_tree_failed (in_tree, in_tree_output, in_tree_path, in_indent) {
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
      output_tree_failed(child, tree_output, tree_path + g_NL + indent + definition_key_value, indent + '  ');
    });
  }

  return tree_output;
}

// ******************************

function get_indent (in_inc) {
  return utils.str_repeat(g_INDENT, g_INDENT_COUNT + (in_inc || 0));
}

// ******************************

function inc_indent (in_inc) {
  g_INDENT_COUNT = Math.max(0, g_INDENT_COUNT + in_inc);
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
module.exports['setup'] = setup;
module.exports['parse_contents'] = parse_contents;
module.exports['output_tree'] = output_tree;
module.exports['output_tree_failed'] = output_tree_failed;

// ******************************