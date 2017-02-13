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

let r_A = GRAMMAR_CORE.r_A;
let r_AG = GRAMMAR_CORE.r_AG;
let r_W = GRAMMAR_CORE.r_W;
let r_S = GRAMMAR_CORE.r_S;
let r_w = GRAMMAR_CORE.r_w;
let r_g = GRAMMAR_CORE.r_g;
let r_v = GRAMMAR_CORE.r_v;
let r_dq = GRAMMAR_CORE.r_dq;
let r_sq = GRAMMAR_CORE.r_sq;

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
module.exports['setup'] = setup;
module.exports['parse_contents'] = parse_contents;
module.exports['output_tree'] = output_tree;
module.exports['output_tree_failed'] = output_tree_failed;

// ******************************
// Globals:
// ******************************

let g_NL = '\n';

// Config - General:
let g_ALLOW_EMPTY_CONTENT = false;
let g_DEFINITION_TYPE = k_DEFINITION_TYPE_HTML;

// Config - Indenting:
let g_INDENT_COUNT = 0;
let g_INDENT = '    ';

// Config - SASS:
let g_FORMAT_PROPERTY_VALUES_ON_NEWLINES = [];

// ******************************
// Setup Functions:
// ******************************

function setup (in_config) {
  if (!in_config) {
    return;
  }

  // General:
  g_ALLOW_EMPTY_CONTENT = utils.get_setup_property(in_config, "allow_empty", g_ALLOW_EMPTY_CONTENT);
  g_DEFINITION_TYPE = utils.get_setup_property(in_config, "definition_type", g_DEFINITION_TYPE);
  g_INDENT = utils.get_setup_property(in_config, "indent", g_INDENT);
  g_INDENT_COUNT = utils.get_setup_property(in_config, "indent_count", g_INDENT);

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
  let fn = 'parse_contents';
  let result = false;

  do {
    let contents = in_contents || '';
    if (contents.trim().length === 0) {
      if (g_ALLOW_EMPTY_CONTENT) {
        return '';
      }
      throw_error(fn, 'No content to parse!');
    }

    let definition;

    switch(g_DEFINITION_TYPE) {
      case k_DEFINITION_TYPE_HTML:
        throw_error(fn, 'HTML parsing not supported yet...');
        // definition = GRAMMAR_HTML;
        break;

      case k_DEFINITION_TYPE_SCSS:
        definition = GRAMMAR_SCSS;
        break;

      default:
        throw_error(fn, 'You must specify a valid definition type');
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
  let state = in_state || { LAST_TOKEN: '' };
  let tree_output = in_tree_output || {};
  let indent = in_indent || '';

  if (in_tree.FAILED) {
    return tree_output;
  }

  let definition_key = in_tree.DEFINITION_KEY;
  let definition_value = (in_tree.VALUE || '').trim();
  let whitespace_matches = (in_tree.VALUE || '').match(new RegExp('^' + r_v(r_W), 'i'));
  let whitespace_before = '';
  let whitespace_before_includes_newline = false;
  if (whitespace_matches) {
    whitespace_before = whitespace_matches[1];
    whitespace_before_includes_newline = !whitespace_before.match(/^ +$/);
  }

  let append = definition_value;
  let color_func = cprint.toBackgroundRed;

  let newline = false;
  let double_newline = false;
  let space_before = false;
  let pre_indent = 0;
  let post_indent = 0;
  let last_token = false;

  switch (definition_key) {
    case 'selector':
    case 'property':
      state.IDENTIFIER_TYPE = definition_key.toUpperCase();
      break;

    case 'mapExpression':
      post_indent = 1;
      state.RECORD_MAP_EXPRESSION_PAREN_DEPTH = true;
      state.MAP_EXPRESSION_PAREN_DEPTH = 0;
      state.IDENTIFIER_TYPE = 'EXPRESSION';
      break;

    case 'expression':
      if (state.IDENTIFIER_TYPE === 'HASH_BLOCK') {
        break;
      }

      if (state.RECORD_MULTI_LINE_EXPRESSION_PAREN_DEPTH) {
        state.IDENTIFIER_TYPE = 'MULTI_LINE_EXPRESSION';
        break;
      }

      state.IDENTIFIER_TYPE = 'EXPRESSION';
      break;

    case 'variableName':
      if (state.IDENTIFIER_TYPE === 'HASH_BLOCK') {
        break;
      }
      state.IDENTIFIER_TYPE = 'VARIABLE';
      break;

    case 'functionCall':
      if (state.IDENTIFIER_TYPE === 'HASH_BLOCK') {
        state.IDENTIFIER_TYPE = 'HASH_BLOCK_FUNCTION';
        break;
      }

      if (state.RECORD_MULTI_LINE_EXPRESSION_PAREN_DEPTH) {
        state.IDENTIFIER_TYPE = 'MULTI_LINE_FUNCTION';
        break;
      }

      state.IDENTIFIER_TYPE = 'FUNCTION';
      break;

    case 'mapEntry':
      state.IDENTIFIER_TYPE = 'MAP_ENTRY';
      break;

    case 'importDeclaration':
      state.IDENTIFIER_TYPE = 'IMPORT';
      break;

    case 'includeDeclaration':
      state.IDENTIFIER_TYPE = 'INCLUDE';
      break;

    case 'eachDeclaration':
      state.IDENTIFIER_TYPE = 'EACH';
      break;

    case 'mediaDeclaration':
      state.IDENTIFIER_TYPE = 'MEDIA';
      break;

    case 'keyframesDeclaration':
      state.IDENTIFIER_TYPE = 'KEYFRAMES';
      break;

    case 'keyframesEntryProperty':
    case 'keyframesEntryBlockEnd':
      state.IDENTIFIER_TYPE = 'KEYFRAMES_PROPERTY';
      break;

    case 'pageDeclaration':
      state.IDENTIFIER_TYPE = 'PAGE';
      break;

    case 'hashBlock':
      state.RECORD_HASH_BLOCK_EXPRESSION_BLOCK_DEPTH = true;
      state.HASH_BLOCK_EXPRESSION_BLOCK_DEPTH = 0;
      state.IDENTIFIER_TYPE = 'HASH_BLOCK';
      break;

    case 'Identifier':
      if (state.IDENTIFIER_TYPE === 'PROPERTY') {
        newline = (state.LAST_TOKEN !== '(');
        color_func = cprint.toGreen;
        last_token = 'PROPERTY';

      } else if (state.IDENTIFIER_TYPE === 'KEYFRAMES_PROPERTY') {
        space_before = true;
        color_func = cprint.toGreen;
        last_token = state.IDENTIFIER_TYPE;

      } else if (['INCLUDE', 'EACH', 'MEDIA', 'KEYFRAMES'].indexOf(state.IDENTIFIER_TYPE) >= 0) {
        space_before = true;
        color_func = cprint.toCyan;
        last_token = state.IDENTIFIER_TYPE;

      } else if (['VARIABLE', 'HASH_BLOCK'].indexOf(state.IDENTIFIER_TYPE) >= 0) {
        if (state.LAST_TOKEN === 'OPERATOR') {
          space_before = true;
        }
        color_func = cprint.toLightBlue;
        last_token = state.IDENTIFIER_TYPE;

      } else if (state.IDENTIFIER_TYPE === 'HASH_BLOCK_FUNCTION') {
        color_func = cprint.toCyan;
        last_token = 'FUNCTION';

      } else if (state.IDENTIFIER_TYPE === 'FUNCTION') {
        space_before = (state.LAST_TOKEN !== '$' && state.LAST_TOKEN !== '(');
        color_func = cprint.toCyan;
        if (g_FORMAT_PROPERTY_VALUES_ON_NEWLINES.indexOf(definition_value) >= 0) {
            post_indent = 1;
            state.RECORD_MULTI_LINE_EXPRESSION_PAREN_DEPTH = true;
            state.MULTI_LINE_EXPRESSION_PAREN_DEPTH = 0;
        }
        last_token = 'FUNCTION';

      } else if (state.IDENTIFIER_TYPE === 'MULTI_LINE_FUNCTION') {
        newline = true;
        color_func = cprint.toCyan;
        last_token = 'FUNCTION';

      } else if (state.IDENTIFIER_TYPE === 'EXPRESSION') {
        space_before = (state.LAST_TOKEN !== '$' && state.LAST_TOKEN !== '(' && (state.LAST_TOKEN !== 'VALUE' || state.LAST_TOKEN === '0'));
        color_func = cprint.toYellow;
        last_token = 'EXPRESSION';

      } else if (state.IDENTIFIER_TYPE === 'MULTI_LINE_EXPRESSION') {
        newline = (state.LAST_TOKEN !== 'EXPRESSION');
        space_before = true;
        color_func = cprint.toYellow;
        last_token = 'EXPRESSION';

      } else if (state.IDENTIFIER_TYPE === 'SELECTOR') {
        newline = (state.LAST_TOKEN === '' || state.LAST_TOKEN === '{' || state.LAST_TOKEN === ',');
        double_newline = (state.LAST_TOKEN === ';' || state.LAST_TOKEN === '}' || state.LAST_TOKEN === 'MULTI_LINE_COMMENT' || state.LAST_TOKEN === 'SINGLE_LINE_COMMENT');
        space_before = (state.LAST_TOKEN !== '.' && state.LAST_TOKEN !== '#' && state.LAST_TOKEN !== ':' && state.LAST_TOKEN !== '::' && state.LAST_TOKEN !== '(' && state.LAST_TOKEN !== '[');

        color_func = cprint.toWhite;
        last_token = 'SELECTOR';
      }
      break;

    case 'Unit':
      color_func = cprint.toYellow;
      last_token = 'UNIT';
      break;

    case 'TIMES':
      if (state.IDENTIFIER_TYPE === 'EXPRESSION' || state.IDENTIFIER_TYPE === 'VARIABLE') {
        space_before = true;
        color_func = cprint.toMagenta;
        last_token = 'OPERATOR';
      } else if (state.IDENTIFIER_TYPE === 'SELECTOR') {
        newline = (state.LAST_TOKEN === '' || state.LAST_TOKEN === '{');
        double_newline = (state.LAST_TOKEN === ';' || state.LAST_TOKEN === '}' || state.LAST_TOKEN === 'MULTI_LINE_COMMENT' || state.LAST_TOKEN === 'SINGLE_LINE_COMMENT');
        color_func = cprint.toWhite;
        last_token = '*';
      }
      break;

    case 'MINUS':
      if (state.IDENTIFIER_TYPE === 'EXPRESSION' || state.IDENTIFIER_TYPE === 'VARIABLE') {
        space_before = (state.LAST_TOKEN !== '(');
        color_func = cprint.toMagenta;
        if (state.LAST_TOKEN === ':') {
          last_token = ':MINUS';
        } else {
          last_token = 'MINUS';
        }
      }
      break;

    case 'DIV':
      if (state.IDENTIFIER_TYPE === 'EXPRESSION' || state.IDENTIFIER_TYPE === 'VARIABLE' || state.IDENTIFIER_TYPE === 'HASH_BLOCK') {
        space_before = true;
        color_func = cprint.toMagenta;
        last_token = 'OPERATOR';
      }
      break;

    case 'PLUS':
      if (state.IDENTIFIER_TYPE === 'EXPRESSION' || state.IDENTIFIER_TYPE === 'VARIABLE') {
        space_before = true;
        color_func = cprint.toMagenta;
        last_token = 'OPERATOR';
      } else if (state.IDENTIFIER_TYPE === 'SELECTOR') {
        space_before = true;
        color_func = cprint.toLightCyan;
        last_token = '+';
      }
      break;

    case 'LPAREN':
      space_before = (state.LAST_TOKEN === '@media' || ((state.IDENTIFIER_TYPE === 'EXPRESSION' || state.IDENTIFIER_TYPE === 'VARIABLE') && state.LAST_TOKEN !== 'MINUS' && state.LAST_TOKEN !== ':MINUS' && state.LAST_TOKEN !== 'URL'));
      if (state.RECORD_MAP_EXPRESSION_PAREN_DEPTH) {
        state.MAP_EXPRESSION_PAREN_DEPTH = state.MAP_EXPRESSION_PAREN_DEPTH + 1;
      }

      if (state.RECORD_MULTI_LINE_EXPRESSION_PAREN_DEPTH) {
        state.MULTI_LINE_EXPRESSION_PAREN_DEPTH = state.MULTI_LINE_EXPRESSION_PAREN_DEPTH + 1;
      }

      color_func = cprint.toMagenta;
      last_token = '(';
      break;

    case 'RPAREN':
      if (state.RECORD_MAP_EXPRESSION_PAREN_DEPTH) {
        state.MAP_EXPRESSION_PAREN_DEPTH = state.MAP_EXPRESSION_PAREN_DEPTH - 1;
        if (state.MAP_EXPRESSION_PAREN_DEPTH === 0) {
          state.RECORD_MAP_EXPRESSION_PAREN_DEPTH = false;
          newline = true;
          pre_indent = -1;
        }
      }

      if (state.RECORD_MULTI_LINE_EXPRESSION_PAREN_DEPTH) {
        state.MULTI_LINE_EXPRESSION_PAREN_DEPTH = state.MULTI_LINE_EXPRESSION_PAREN_DEPTH - 1;
        if (state.MULTI_LINE_EXPRESSION_PAREN_DEPTH === 0) {
          state.RECORD_MULTI_LINE_EXPRESSION_PAREN_DEPTH = false;
          newline = true;
          pre_indent = -1;
        }
      }

      color_func = cprint.toMagenta;
      last_token = ')';
      break;

    case 'DOLLAR':
      if (state.IDENTIFIER_TYPE === 'HASH_BLOCK') {
        color_func = cprint.toLightBlue;
      } else if (state.IDENTIFIER_TYPE === 'VARIABLE') {
        newline = (state.LAST_TOKEN === '' || state.LAST_TOKEN === '{');
        double_newline = (state.LAST_TOKEN === ';' || state.LAST_TOKEN === '}' || state.LAST_TOKEN === 'MULTI_LINE_COMMENT' || state.LAST_TOKEN === 'SINGLE_LINE_COMMENT');
        space_before = (state.LAST_TOKEN !== 'MINUS' && state.LAST_TOKEN !== ':MINUS' && state.LAST_TOKEN !== '(');
        color_func = cprint.toLightBlue;
      }
      last_token = '$';
      break;

    case 'measurement':
      if (state.LAST_TOKEN === 'MINUS') {
        last_token = '-MEASUREMENT';
      }
      break;

    case 'Number':
    case 'Color':
    case 'RGB_VAL':
      if (state.IDENTIFIER_TYPE === 'EXPRESSION' || state.IDENTIFIER_TYPE === 'MULTI_LINE_EXPRESSION' || state.IDENTIFIER_TYPE === 'VARIABLE') {
        space_before = (state.LAST_TOKEN !== '(' && state.LAST_TOKEN !== ':MINUS' && state.LAST_TOKEN !== '-MEASUREMENT');
      } else if (state.IDENTIFIER_TYPE === 'MAP_ENTRY') {
        newline = true;
      } else if (state.IDENTIFIER_TYPE === 'KEYFRAMES' || state.IDENTIFIER_TYPE === 'KEYFRAMES_PROPERTY') {
        newline = true;
      } else if (state.IDENTIFIER_TYPE === 'FUNCTION' || state.IDENTIFIER_TYPE === 'HASH_BLOCK') {
        space_before = true;
      }
      color_func = cprint.toYellow;
      if (definition_value === '0') {
        last_token = '0';
      } else {
        last_token = 'VALUE';
      }
      break;

    case 'STRING_SINGLE_QUOTED':
    case 'STRING_DOUBLE_QUOTED':
    case 'UrlVal':
      space_before = (state.IDENTIFIER_TYPE === 'IMPORT' || state.LAST_TOKEN === ':');
      color_func = cprint.toYellow;
      last_token = 'VALUE';
      break;

    case 'UrlStartVal':
      space_before = true;
      color_func = cprint.toCyan;
      last_token = 'URL';
      break;

    case 'commaExpression':
      state.IDENTIFIER_TYPE = 'EXPRESSION';
      break;

    case 'extraComma':
      state.LAST_TOKEN = 'IGNORE:,';
      break;

    case 'COMMA':
      if (state.LAST_TOKEN === 'IGNORE:,') {
        append = false;
        break;
      }

      if (state.IDENTIFIER_TYPE === 'PROPERTY') {
        color_func = cprint.toGreen;
      } else if (state.IDENTIFIER_TYPE === 'EXPRESSION') {
        color_func = cprint.toYellow;
      } else if (state.IDENTIFIER_TYPE === 'VARIABLE') {
        color_func = cprint.toLightBlue;
      } else if (state.IDENTIFIER_TYPE === 'SELECTOR') {
        color_func = cprint.toWhite;
      }

      last_token = ',';
      break;

    case 'GT':
      newline = (state.LAST_TOKEN === ',' || state.LAST_TOKEN === '{');
      double_newline = (state.LAST_TOKEN === ';' || state.LAST_TOKEN === '}' || state.LAST_TOKEN === 'MULTI_LINE_COMMENT' || state.LAST_TOKEN === 'SINGLE_LINE_COMMENT');
      space_before = true;
      color_func = cprint.toLightCyan;
      last_token = '>';
      break;

    case 'AND':
      newline = (state.LAST_TOKEN === ',' || state.LAST_TOKEN === '{');
      double_newline = (state.LAST_TOKEN === ';' || state.LAST_TOKEN === '}' || state.LAST_TOKEN === 'MULTI_LINE_COMMENT' || state.LAST_TOKEN === 'SINGLE_LINE_COMMENT');
      space_before = true;
      color_func = cprint.toLightCyan;
      last_token = '&';
      break;

    case 'DOT':
    case 'LBRACK':
    case 'RBRACK':
    case 'TILD':
    case 'EQ':
    case 'HASH':
    case 'DASH':
    case 'COLON':
    case 'COLONCOLON':
      if (state.IDENTIFIER_TYPE === 'SELECTOR' ) {
        newline = (state.LAST_TOKEN === ',' || state.LAST_TOKEN === '{');
        double_newline = (state.LAST_TOKEN === ';' || state.LAST_TOKEN === '}' || state.LAST_TOKEN === 'MULTI_LINE_COMMENT' || state.LAST_TOKEN === 'SINGLE_LINE_COMMENT');
      }
      space_before = (whitespace_before && (definition_key === 'DOT' || definition_key === 'HASH'));

      color_func = cprint.toLightCyan;
      last_token = definition_value;
      break;

    case 'SEMI':
      if (state.LAST_TOKEN === ';') {
        append = false;
      }
      color_func = cprint.toRed;
      last_token = ';';
      break;

    case 'COMMENT':
      if (whitespace_before_includes_newline) {
        newline = (state.LAST_TOKEN === '{');
        double_newline = !newline;
      } else {
        space_before = true;
      }
      color_func = cprint.toDarkGrey;
      last_token = 'MULTI_LINE_COMMENT';
      break;

    case 'SL_COMMENT':
      newline = (whitespace_before_includes_newline || state.LAST_TOKEN === 'SINGLE_LINE_COMMENT');
      space_before = true;
      color_func = cprint.toDarkGrey;
      last_token = 'SINGLE_LINE_COMMENT';
      break;

    case 'IMPORTANT':
      space_before = true;
      color_func = cprint.toLightRed;
      last_token = 'IMPORTANT';
      break;

    case 'IMPORT':
    case 'INCLUDE':
    case 'MEDIA':
    case 'KEYFRAMES':
    case 'PAGE':
    case 'AT_EACH':
    case 'AT_FOR':
      newline = true;
      double_newline = (state.LAST_TOKEN === ';' || state.LAST_TOKEN === '}' || state.LAST_TOKEN === 'MULTI_LINE_COMMENT' || state.LAST_TOKEN === 'SINGLE_LINE_COMMENT');
      color_func = cprint.toCyan;
      last_token = definition_value;
      break;

    case 'FROM':
    case 'THROUGH':
    case 'IN':
      space_before = true;
      color_func = cprint.toCyan;
      last_token = definition_value.toUpperCase();
      break;

    case 'BlockStart':
      if (state.IDENTIFIER_TYPE === 'HASH_BLOCK') {
        color_func = cprint.toLightMagenta;
        state.HASH_BLOCK_EXPRESSION_BLOCK_DEPTH += 1;
        last_token = '{';
      } else {
        space_before = (state.LAST_TOKEN !== '#');
        color_func = cprint.toWhite;
        last_token = '{';
      }
      post_indent = 1;
      break;

    case 'BlockEnd':
      if (state.RECORD_HASH_BLOCK_EXPRESSION_BLOCK_DEPTH) {
        color_func = cprint.toLightMagenta;
        state.HASH_BLOCK_EXPRESSION_BLOCK_DEPTH -= 1;
        if (state.HASH_BLOCK_EXPRESSION_BLOCK_DEPTH === 0) {
          state.IDENTIFIER_TYPE = false;
          state.RECORD_HASH_BLOCK_EXPRESSION_BLOCK_DEPTH = false;
        }
        last_token = '}';
      } else {
        newline = ((state.IDENTIFIER_TYPE !== 'KEYFRAMES_PROPERTY' || state.LAST_TOKEN === '}'));
        space_before = (state.IDENTIFIER_TYPE === 'KEYFRAMES_PROPERTY');
        color_func = cprint.toWhite;
        last_token = '}';
      }
      pre_indent = -1;
      break;
  }

  if (last_token) {
    state.SECOND_TO_LAST_TOKEN = state.LAST_TOKEN;
    state.LAST_TOKEN = last_token;
  }

  if (pre_indent != 0) {
    inc_indent(pre_indent);
  }

  let output_indent = get_indent();

  if (post_indent != 0) {
    inc_indent(post_indent);
  }

  if (append) {
    let delim = '';
    if (double_newline) {
      delim = g_NL + g_NL + output_indent;
    } else if (newline) {
      delim = g_NL + output_indent;
    } else if (space_before) {
      delim = ' ';
    }

    color_func = color_func;

    tree_output.output = utils.str_append(tree_output.output, append, delim);
    tree_output.color_output = utils.str_append(tree_output.color_output, color_func(append), delim);
  }

  let definition_key_value = definition_key + (definition_value ? (' ===> ' + definition_value) : '');
  tree_output.values = utils.str_append(tree_output.values, definition_key_value, g_NL + indent);
  tree_output.structure = utils.str_append(tree_output.structure, definition_key, g_NL + indent);

  if (in_tree.CHILDREN) {
    in_tree.CHILDREN.forEach((child) => {
      output_tree(child, state, tree_output, indent + '  ');
    });
  }

  return tree_output;
}

// ******************************

function output_tree_failed (in_tree, in_tree_output, in_tree_path, in_indent) {
  let tree_output = in_tree_output || {};
  let tree_path = in_tree_path || '';
  let indent = in_indent || '';

  let definition_key = in_tree.DEFINITION_KEY || 'Root';
  if (definition_key === k_DEFINITION_KEY_START) {
      // populate_failed_tree_values(in_tree);
  }

  let definition_value = (in_tree.VALUE || '').trim();

  let definition_key_value = definition_key + (definition_value ? (' ===> ' + definition_value) : '');
  tree_output.values = utils.str_append(tree_output.values, definition_key_value, g_NL + indent);
  tree_output.structure = utils.str_append(tree_output.structure, definition_key, g_NL + indent);

  if (!tree_output.least_remaining || tree_output.least_remaining > in_tree.REMAINING_LENGTH) {
    tree_output.least_remaining = in_tree.REMAINING_LENGTH;
    tree_output.best_path = tree_path;
  }

  if (in_tree.ALL_CHILDREN) {
    in_tree.ALL_CHILDREN.forEach((child) => {
      output_tree_failed(child, tree_output, tree_path + g_NL + indent + definition_key_value, indent + '  ');
    });
  }

  return tree_output;
}

// ******************************

function populate_failed_tree_values (in_tree) {
  if (!in_tree.ALL_CHILDREN) {
    return;
  }

  let amalgamated_value = '';

  in_tree.ALL_CHILDREN.forEach((child) => {
    populate_failed_tree_values(child);
    if (child.VALUE && !child.ALL_CHILDREN) {
      amalgamated_value += child.VALUE;
    }
  });

  if (amalgamated_value) {
    in_tree.VALUE = amalgamated_value;
  }
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
