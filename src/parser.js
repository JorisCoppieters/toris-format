'use strict';

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

let utils = require('./utils');
let cprint = require('color-print');
let GRAMMAR_CORE = require('../grammars/core');
let GRAMMAR_SCSS = require('../grammars/scss');
let GRAMMAR_HTML = require('../grammars/html');

// ******************************
// Exposing Functions:
// ******************************

var r_A = GRAMMAR_CORE.r_A;
var r_AG = GRAMMAR_CORE.r_AG;
var r_W = GRAMMAR_CORE.r_W;
var r_S = GRAMMAR_CORE.r_S;
var r_w = GRAMMAR_CORE.r_w;
var r_g = GRAMMAR_CORE.r_g;
var r_v = GRAMMAR_CORE.r_v;
var r_dq = GRAMMAR_CORE.r_dq;
var r_sq = GRAMMAR_CORE.r_sq;

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
// Exports:
// ******************************

module.exports['k_DEFINITION_TYPE_HTML'] = k_DEFINITION_TYPE_HTML;
module.exports['k_DEFINITION_TYPE_SCSS'] = k_DEFINITION_TYPE_SCSS;
module.exports['parse_contents'] = parse_contents;
module.exports['output_tree'] = output_tree;
module.exports['output_tree_failed'] = output_tree_failed;

// ******************************
// Globals:
// ******************************

let g_HTML_INDENT_COUNT = 0;
let g_INDENT = '    ';

let t_NL = '\n';
let g_NL = '\r\n';
let g_REGEX_NL = r_g('\\r\\n|\\r|\\n');

// ******************************
// Functions:
// ******************************

function parse_contents (in_contents, in_definition_type) {
  let fn = 'parse_contents';
  let result = false;

  do {
    let contents = in_contents || '';

    let definition;

    switch(in_definition_type) {
      case k_DEFINITION_TYPE_HTML:
        definition = GRAMMAR_HTML;
        break;

      case k_DEFINITION_TYPE_SCSS:
        definition = GRAMMAR_SCSS;
        break;

      default:
        throw_error(fn, 'parse_contents: You must specify a valid definition type');
    }

    // definition[k_DEFINITION_KEY_START].DEBUG = 'ON';

    let tree = {}
    parse_definition_key(tree, contents, definition, k_DEFINITION_KEY_START);
    result = tree;
  }
  while (false);

  return result;
}

// ******************************

function parse_definition_key (out_tree, in_contents, in_definition, in_definition_key, in_indent, in_debug) {
  let fn = 'parse_definition_key';
  let result = false;

  do {
    let contents = in_contents || '';
    let original_contents = contents;

    if (contents.trim().length === 0) {
      result = '';
      break;
    }

    let definition_key = (in_definition_key) ? in_definition_key : k_DEFINITION_KEY_START;
    let definition_value = in_definition[definition_key];

    if (!definition_value) {
      throw_error(fn, 'Couldn\'t find definition key!', definition_key);
    }

    let tree = out_tree || {};
    let indent = in_indent || '';
    let debug = (definition_value.DEBUG || in_debug || k_DEBUG_OFF);

    let is_start = (definition_key === k_DEFINITION_KEY_START);
    if (is_start) {
      contents = contents.replace(new RegExp(g_REGEX_NL, 'g'), t_NL);
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

    if (is_start && result !== '') {
      throw_error(fn, 'Unrecognised Content: ' + contents.substr(0, 100) + '...');
    }

    tree.DEFINITION_KEY = definition_key;
  }
  while (false);

  return result;
}

// ******************************

function _parse_definition_or (out_tree, in_contents, in_definition, in_definition_key, in_definition_value, in_indent, in_debug) {
  let fn = '_parse_definition_or';
  let result = false;

  do {
    let segments = in_definition_value.SEGMENTS || [];
    if (!segments) {
      throw_error(fn, 'Segments haven\'t been defined', in_definition_key);
    }

    let remaining = false;
    let matched = false;
    let sub_tree = {};
    let matched_sub_tree = {};
    let all_matched_sub_trees = [];

    segments.forEach((sub_definition_key) => {
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
  let fn = '_parse_definition_and';
  let result = false;

  do {
    let segments = in_definition_value.SEGMENTS || [];
    if (!segments) {
      throw_error(fn, 'Segments haven\'t been defined', in_definition_key);
    }

    let contents = in_contents;
    let original_contents = contents;

    let remaining = '';
    let matched = true;
    let sub_tree = {};
    let sub_tree_children = [];
    let all_matched_sub_trees = [];

    segments.forEach((sub_definition_key) => {
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
  let fn = '_parse_definition_multiple';
  let result = false;

  do {
    let segments = in_definition_value.SEGMENTS || [];
    if (!segments) {
      throw_error(fn, 'Segments haven\'t been defined', in_definition_key);
    }

    let contents = in_contents;
    let remaining = contents;
    let matched = true;
    let matched_any = false;
    let sub_tree = {};
    let sub_tree_children = [];
    let all_matched_sub_trees = [];

    while (matched) {
      if (remaining === '') {
        break;
      }

      segments.forEach((sub_definition_key) => {
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
  let fn = '_parse_definition_equals';
  let result = false;

  do {
    let contents = in_contents;
    let original_contents = contents;

    let regexp = in_definition_value.REGEXP || null;

    if (in_definition_key === k_DEFINITION_KEY_EMPTY) {
      if (in_debug === k_DEBUG_ON) {
        cprint.green(in_indent + in_definition_key + ' [MATCHED (EMPTY)]');
      }
      result = contents;
      break;
    }

    if (in_definition_value.VALUE) {
      try {
        let value = in_definition_value.VALUE || [];
        regexp = new RegExp('^' + '(' + r_W + value + ')' + r_v(r_AG) + '$');
      } catch (err) {
        throw_error(fn, 'Failed to create RegExp', in_definition_key);
      }
    }

    if (!regexp) {
      throw_error(fn, 'RegExp hasn\'t been defined', in_definition_key);
    }

    let matches = contents.match(regexp);
    if (!matches) {
      if (in_debug === k_DEBUG_ON) {
        cprint.red(in_indent + original_contents.substr(0, 100) + '...');
        cprint.red(in_indent + in_definition_key + ' [FAILED]');
      }
      break;
    }

    let remaining = matches[matches.length - 1];
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
  let state = in_state || {};
  let tree_output = in_tree_output || {};
  let indent = in_indent || '';

  let definition_key = in_tree.DEFINITION_KEY;
  let definition_value = (in_tree.VALUE || '').trim();

  let append = false;
  let color_append = false;

  let newline = false;
  let double_newline = false;
  let pre_html_indent = 0;
  let post_html_indent = 0;

  switch (definition_key) {
    case 'DOT':
      state.DOT_SELECTOR = true;
      break;

    case 'selector':
      state.SEEN_SELECTOR_PREFIX = false;
      state.TYPE = 'SELECTOR';
      break;

    case 'selectorPrefix':
      state.SEEN_SELECTOR_PREFIX = true;
      break;

    case 'property':
      state.TYPE = 'PROPERTY';
      state.SEEN_AND = false;
      break;

    case 'expression':
      state.TYPE = 'EXPRESSION';
      break;

    case 'includeDeclaration':
      state.TYPE = 'INCLUDE';
      break;

    case 'Identifier':
      newline = (state.TYPE === 'PROPERTY' || !state.SEEN_BLOCK_IDENTIFIER);

      if (state.TYPE === 'PROPERTY') {
        append = definition_value;
        color_append = cprint.toGreen(append);

      } else if (state.TYPE === 'INCLUDE') {
        append = definition_value;
        color_append = cprint.toCyan(append);

      } else if (state.TYPE === 'EXPRESSION') {
        append = (state.SEEN_DOLLAR ? '' : ' ') + definition_value;
        state.SEEN_DOLLAR = false;
        color_append = cprint.toYellow(append);

      } else if (state.TYPE === 'SELECTOR') {
        append = (state.DOT_SELECTOR ? '.' : '') + definition_value;
        color_append = cprint.toWhite(append);
        newline = (!state.SEEN_SELECTOR_PREFIX && !state.SEEN_AND && state.ADDITIONAL_SELECTORS) || newline
        double_newline = (!state.SEEN_SELECTOR_PREFIX && !state.SEEN_AND && !state.ADDITIONAL_SELECTORS && state.SEEN_BLOCK_IDENTIFIER);
        state.DOT_SELECTOR = false;

      } else {
        append = definition_value;
        color_append = cprint.toRed(append);

      }
      state.SEEN_BLOCK_IDENTIFIER = true;
      break;

    case 'Unit':
      append = definition_value;
      color_append = cprint.toYellow(append);
      break;

    case 'LPAREN':
      append = definition_value;
      state.PAREN_OPEN_COUNT = (state.PAREN_OPEN_COUNT || 0) + 1;
      color_append = cprint.toYellow(append);
      break;

    case 'RPAREN':
      append = definition_value;
      state.PAREN_OPEN_COUNT = (state.PAREN_OPEN_COUNT || 0) - 1;
      color_append = cprint.toYellow(append);
      break;

    case 'DOLLAR':
      if (state.TYPE === 'EXPRESSION') {
        if (state.PAREN_OPEN_COUNT > 0) {
          append = definition_value;
        } else {
          append = ' ' + definition_value;
        }
        state.SEEN_DOLLAR = true;
        color_append = cprint.toYellow(append);
      } else {
        append = definition_value;
        color_append = cprint.toYellow(append);
      }
      break;

    case 'Number':
    case 'Color':
    case 'RGB_VAL':
      append = ' ' + definition_value;
      color_append = cprint.toYellow(append);
      break;

    case 'COMMA':
      append = definition_value;

      if (state.TYPE === 'PROPERTY') {
        color_append = cprint.toGreen(append);
      } else if (state.TYPE === 'EXPRESSION') {
        color_append = cprint.toYellow(append);
      } else if (state.TYPE === 'SELECTOR') {
        color_append = cprint.toWhite(append);
        state.ADDITIONAL_SELECTORS = true;
      } else {
        color_append = cprint.toRed(append);
      }

      break;

    case 'GT':
      append = ' > ';
      color_append = cprint.toCyan(append);
      break;

    case 'AND':
      append = '&';
      newline = true;
      double_newline = (!state.SEEN_AND && state.SEEN_BLOCK_IDENTIFIER);
      state.SEEN_AND = true;
      color_append = cprint.toCyan(append);
      break;

    case 'COLON':
      append = ':';
      color_append = cprint.toCyan(append);
      break;

    case 'SEMI':
      state.TYPE = false;
      append = ';';
      color_append = cprint.toYellow(append);
      break;

    case 'SL_COMMENT':
      append = ' ' + definition_value;
      color_append = cprint.toMagenta(append);
      break;

    case 'INCLUDE':
      append = definition_value + ' ';
      double_newline = true;
      color_append = cprint.toCyan(append);
      break;

    case 'BlockStart':
      append = ' {';
      state.BLOCK_DEPTH = (state.BLOCK_DEPTH || 0) + 1;
      state.ADDITIONAL_SELECTORS = false;
      state.SEEN_BLOCK_IDENTIFIER = false;
      color_append = cprint.toWhite(append);
      post_html_indent = 1;
      break;

    case 'BlockEnd':
      append = '}';
      state.BLOCK_DEPTH = state.BLOCK_DEPTH - 1;
      color_append = cprint.toWhite(append);
      newline = true;
      pre_html_indent = -1;
      break;

    default:
      if (definition_value) {
        cprint.yellow('Should probably print: ' + definition_key + ' = ' + definition_value);
      }
      break;
  }

  if (pre_html_indent != 0) {
    inc_html_indent(pre_html_indent);
  }

  let html_indent = get_html_indent();

  if (post_html_indent != 0) {
    inc_html_indent(post_html_indent);
  }

  if (append) {
    let delim = '';
    if (double_newline) {
      delim = t_NL + t_NL + html_indent;
    } else if (newline) {
      delim = t_NL + html_indent;
    }

    tree_output.output = utils.str_append(tree_output.output, append, delim);
    tree_output.color_output = utils.str_append(tree_output.color_output, color_append || append, delim);
  }

  let definition_key_value = definition_key + (definition_value ? (' ===> ' + definition_value) : '');
  tree_output.values = utils.str_append(tree_output.values, definition_key_value, t_NL + indent);
  tree_output.structure = utils.str_append(tree_output.structure, definition_key, t_NL + indent);

  if (in_tree.CHILDREN) {
    in_tree.CHILDREN.forEach((child) => {
      output_tree(child, state, tree_output, indent + '  ');
    });
  }

  return tree_output;
}

// ******************************

function output_tree_failed (in_tree, in_tree_output, in_indent) {
  let tree_output = in_tree_output || {};
  let indent = in_indent || '';

  let definition_key = in_tree.DEFINITION_KEY;
  let definition_value = (in_tree.VALUE || '').trim();

  let definition_key_value = definition_key + (definition_value ? (' ===> ' + definition_value) : '');
  tree_output.values = utils.str_append(tree_output.values, definition_key_value, t_NL + indent);
  tree_output.structure = utils.str_append(tree_output.structure, definition_key, t_NL + indent);

  if (!tree_output.least_remaining || tree_output.least_remaining > in_tree.REMAINING_LENGTH) {
    tree_output.least_remaining = in_tree.REMAINING_LENGTH;
    tree_output.best_leaf = in_tree.DEFINITION_KEY;
  }

  if (in_tree.ALL_CHILDREN) {
    in_tree.ALL_CHILDREN.forEach((child) => {
      output_tree_failed(child, tree_output, indent + '  ');
    });
  }

  return tree_output;
}

// ******************************

function get_tree_value (in_tree, in_print, in_resolve_special_chars) {
  let fn = 'get_tree_value';
  let print = in_print || '';
  let values = in_tree.VALUES || {};
  let value_keys = Object.keys(values);
  value_keys.forEach((value_key) => {
    let value = (values[value_key] || '').trim();
    print = print.replace(new RegExp('%' + value_key + '%', 'i'), value);
  });

  if (in_tree.CHILDREN) {
    in_tree.CHILDREN.forEach((child) => {
      print = get_tree_value(child, print, in_resolve_special_chars);
    });
  }

  if (in_resolve_special_chars) {
    print = print.replace(new RegExp('\\[NL\\]', 'g'), t_NL);

    let matches;
    while (matches = print.match(new RegExp('\\[T(?:\:([0-9]))?\\]', 'i'))) {
      let indent_inc = parseInt(matches[1]) || 0;
      print = print.replace(new RegExp('\\[T(:[0-9])?\\]', 'i'), get_html_indent(indent_inc));
    }
  }

  return print;
}

// ******************************

function get_html_indent (in_inc) {
  let fn = 'get_html_indent';
  return utils.str_repeat(g_INDENT, g_HTML_INDENT_COUNT + (in_inc || 0));
}

// ******************************

function inc_html_indent (in_inc) {
  let fn = 'inc_html_indent';
  g_HTML_INDENT_COUNT = Math.max(0, g_HTML_INDENT_COUNT + in_inc);
}

// ******************************

function throw_error (in_function_name, in_message, in_definition_key) {
  let fn = 'throw_error';
  if (in_definition_key) {
    throw in_function_name + ': [' + in_definition_key + '] ' + in_message;
  }

  if (in_definition_key) {
    throw in_function_name + ': ' + in_message;
  }
}

// ******************************
