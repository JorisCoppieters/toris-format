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
  let color_func = false;

  let newline = false;
  let double_newline = false;
  let space_before = true;
  let pre_indent = 0;
  let post_indent = 0;
  let last_token = false;

  switch (definition_key) {

    // Declaration Types:
    case 'url':
      state.DECLARATION_TYPE = 'URL';
      state.VALUE_TYPE = false;
      break;
    case 'importDeclaration':
      state.DECLARATION_TYPE = 'IMPORT';
      state.VALUE_TYPE = false;
      break;
    case 'includeDeclaration':
      state.DECLARATION_TYPE = 'INCLUDE';
      state.VALUE_TYPE = false;
      break;
    case 'functionDeclaration':
      state.DECLARATION_TYPE = 'FUNCTION';
      state.VALUE_TYPE = false;
      break;
    case 'returnDeclaration':
      state.DECLARATION_TYPE = 'RETURN';
      state.VALUE_TYPE = false;
      break;
    case 'mixinDeclaration':
      state.DECLARATION_TYPE = 'MIXIN';
      state.VALUE_TYPE = false;
      break;
    case 'eachDeclaration':
      state.DECLARATION_TYPE = 'EACH';
      state.VALUE_TYPE = false;
      break;
    case 'mediaDeclaration':
      state.DECLARATION_TYPE = 'MEDIA';
      state.VALUE_TYPE = false;
      break;
    case 'keyframesDeclaration':
      state.DECLARATION_TYPE = 'KEYFRAMES';
      state.VALUE_TYPE = false;
      break;
    case 'keyframesEntry':
      state.DECLARATION_TYPE = 'KEYFRAMES_ENTRY';
      state.VALUE_TYPE = false;
      break;
    case 'keyframesEntryEnd':
      state.DECLARATION_TYPE = 'KEYFRAMES_ENTRY_END';
      state.VALUE_TYPE = false;
      break;
    case 'keyframesEntryBlockEnd':
      state.DECLARATION_TYPE = 'KEYFRAMES_END';
      state.VALUE_TYPE = false;
      break;
    case 'pageDeclaration':
      state.DECLARATION_TYPE = 'PAGE';
      state.VALUE_TYPE = false;
      break;
    case 'variableDeclaration':
      state.DECLARATION_TYPE = 'VARIABLE';
      state.VALUE_TYPE = false;
      break;
    case 'variableDeclarationValues':
      state.DECLARATION_TYPE = 'VARIABLE_VALUES';
      state.VALUE_TYPE = false;
      break;
    case 'functionCall':
      if (state.MULTI_LINE_FUNCTION && state.MULTI_LINE_FUNCTION_PAREN_DEPTH === 1) {
        state.DECLARATION_TYPE = 'MULTI_LINE_FUNCTION_CALL';
        state.VALUE_TYPE = 'MULTI_LINE_FUNCTION_CALL';
      } else {
        state.DECLARATION_TYPE = 'FUNCTION_CALL';
        state.VALUE_TYPE = 'FUNCTION_CALL';
      }
      break;
    case 'functionCallStart':
      if (state.MULTI_LINE_FUNCTION) {
        state.DECLARATION_TYPE = 'MULTI_LINE_FUNCTION_START';
      } else {
        state.DECLARATION_TYPE = 'FUNCTION_START';
      }
      break;
    case 'functionCallEnd':
      if (state.MULTI_LINE_FUNCTION) {
        state.DECLARATION_TYPE = 'MULTI_LINE_FUNCTION_END';
      } else {
        state.DECLARATION_TYPE = 'FUNCTION_END';
      }
      break;
    case 'functionCallArguments':
      if (state.MULTI_LINE_FUNCTION && state.MULTI_LINE_FUNCTION_PAREN_DEPTH === 1) {
        state.DECLARATION_TYPE = 'MULTI_LINE_FUNCTION_CALL_ARGUMENTS';
        state.VALUE_TYPE = false;
      } else {
        state.DECLARATION_TYPE = 'FUNCTION_CALL_ARGUMENTS';
        state.VALUE_TYPE = false;
      }
      break;
    case 'hashBlockStart':
      state.DECLARATION_TYPE = 'HASH_BLOCK_START';
      state.VALUE_TYPE = false;
      break;
    case 'hashBlockExpression':
      state.DECLARATION_TYPE = 'HASH_BLOCK_EXPRESSION';
      state.VALUE_TYPE = false;
      break;
    case 'hashBlockEnd':
      state.DECLARATION_TYPE = 'HASH_BLOCK_END';
      state.VALUE_TYPE = false;
      break;
    case 'mapExpressionStart':
      state.DECLARATION_TYPE = 'MAP_EXPRESSION_START';
      state.VALUE_TYPE = false;
      break;
    case 'mapExpressionEnd':
      state.DECLARATION_TYPE = 'MAP_EXPRESSION_END';
      state.VALUE_TYPE = false;
      break;
    case 'mapEntry':
      state.DECLARATION_TYPE = 'MAP_ENTRY';
      state.VALUE_TYPE = false;
      break;
    case 'mapEntryValues':
      state.DECLARATION_TYPE = 'MAP_ENTRY_VALUES';
      state.VALUE_TYPE = false;
      break;

    case 'expressions3Plus':
    case 'expressions3PlusInParens':
      switch (state.DECLARATION_TYPE) {
        case 'VARIABLE_VALUES':
          state.DECLARATION_TYPE = 'VARIABLE_VALUES_3PLUS';
          state.VARIABLE_VALUES_3PLUS = true;
          state.VARIABLE_VALUES_3PLUS_PAREN_DEPTH = 0;
          post_indent = 1;
          break;
      }
      break;

    // Value Types:
    case 'selector':
    case 'property':
      state.DECLARATION_TYPE = definition_key.toUpperCase();
      state.VALUE_TYPE = definition_key.toUpperCase();
      break;
    case 'mathCharacter':
      state.VALUE_TYPE = 'OPERATOR';
      break;
    case 'measurement':
      state.VALUE_TYPE = 'MEASUREMENT';
      break;
    case 'StringLiteral':
      state.VALUE_TYPE = 'STRING';
      break;
    case 'colonValues':
      state.VALUE_TYPE = 'PROPERTY_VALUE';
      break;
    case 'variableName':
      state.VALUE_TYPE = 'VARIABLE';
      break;
    case 'keyframesEntryProperty':
      state.VALUE_TYPE = 'KEYFRAMES_ENTRY_PROPERTY';
      break;

    // Value Output:

    case 'COLON':
    case 'COLONCOLON':
    case 'DASH':
    case 'DOT':
    case 'EQ':
    case 'HASH':
    case 'LBRACK':
    case 'RBRACK':
    case 'TIL':
      if (state.VALUE_TYPE === 'SELECTOR') {
        newline = (state.LAST_TOKEN === ',' || state.LAST_TOKEN === '{');
        double_newline = (state.LAST_TOKEN === ';' || state.LAST_TOKEN === '}' || state.LAST_TOKEN === 'MULTI_LINE_COMMENT' || state.LAST_TOKEN === 'SINGLE_LINE_COMMENT');
      }
      space_before = (whitespace_before && (definition_key === 'DOT' || definition_key === 'HASH' || definition_key === 'TIL'));
      color_func = cprint.toLightCyan;
      last_token = definition_value;
      break;

    case 'AT_EACH':
    case 'AT_FOR':
    case 'FUNCTION':
    case 'IMPORT':
    case 'INCLUDE':
    case 'KEYFRAMES':
    case 'MEDIA':
    case 'MIXIN':
    case 'PAGE':
    case 'RETURN':
      newline = true;
      double_newline = (state.LAST_TOKEN === ';' || state.LAST_TOKEN === '}' || state.LAST_TOKEN === 'MULTI_LINE_COMMENT' || state.LAST_TOKEN === 'SINGLE_LINE_COMMENT');
      color_func = cprint.toCyan;
      last_token = definition_value;
      break;

    case 'FROM':
    case 'THROUGH':
    case 'IN':
      color_func = cprint.toCyan;
      last_token = definition_value.toUpperCase();
      break;

    case 'BlockStart':
      last_token = '{';
      post_indent = 1;
      color_func = cprint.toWhite;

      switch (state.DECLARATION_TYPE) {

        case false:
        case 'SELECTOR':
        case 'FUNCTION_CALL_ARGUMENTS':
        case 'HASH_BLOCK_EXPRESSION':
        case 'PROPERTY':
        case 'KEYFRAMES':
        case 'FUNCTION':
        case 'MEDIA':
        case 'PAGE':
        case 'EACH':
        case 'INCLUDE':
        case 'MIXIN':
        case 'KEYFRAMES_ENTRY':
          break;

        case 'HASH_BLOCK_START':
          space_before = false;
          break;

        default:
          append = state.DECLARATION_TYPE + ':' + definition_key;
          color_func = cprint.toBackgroundYellow;
          break;

      }
      break;

    case 'BlockEnd':
      last_token = '}';
      pre_indent = -1;
      color_func = cprint.toWhite;

      switch (state.DECLARATION_TYPE) {

        case 'KEYFRAMES_ENTRY_END':
          break;

        case false:
        case 'SELECTOR':
        case 'VARIABLE':
        case 'VARIABLE_VALUES':
        case 'FUNCTION_END':
        case 'FUNCTION_CALL_ARGUMENTS':
        case 'PROPERTY':
        case 'KEYFRAMES_END':
        case 'URL':
          newline = true;
          break;

        case 'HASH_BLOCK_EXPRESSION':
          space_before = false;
          break;

        case 'HASH_BLOCK_END':
          space_before = false;
          state.DECLARATION_TYPE = false;
          break;

        default:
          append = state.DECLARATION_TYPE + ':' + definition_key;
          color_func = cprint.toBackgroundYellow;
          break;

      }
      break;

    case 'LPAREN':
      space_before = (['0', 'VALUE', 'VARIABLE', 'PROPERTY_VALUE', 'UNIT', ',', ':', 'OPERATOR'].indexOf(state.LAST_TOKEN) >= 0);
      if (state.DECLARATION_TYPE === 'MEDIA') {
        space_before = true;
      }

      if (state.DECLARATION_TYPE === 'MAP_EXPRESSION_START') {
        post_indent = 1;
      }

      if (state.MULTI_LINE_FUNCTION) {
        state.MULTI_LINE_FUNCTION_PAREN_DEPTH += 1;
      }

      if (state.VARIABLE_VALUES_3PLUS) {
        state.VARIABLE_VALUES_3PLUS_PAREN_DEPTH += 1;
      }

      color_func = cprint.toMagenta;
      last_token = '(';
      break;

    case 'RPAREN':
      space_before = false;

      if (state.DECLARATION_TYPE === 'MAP_EXPRESSION_END') {
        newline = true;
        pre_indent = -1;
      }

      if (state.MULTI_LINE_FUNCTION) {
        state.MULTI_LINE_FUNCTION_PAREN_DEPTH -= 1;
        if (state.MULTI_LINE_FUNCTION_PAREN_DEPTH === 0) {
          newline = true;
          state.MULTI_LINE_FUNCTION = false;
          pre_indent = -1;
        }
      }

      if (state.VARIABLE_VALUES_3PLUS) {
        state.VARIABLE_VALUES_3PLUS_PAREN_DEPTH -= 1;
        if (state.VARIABLE_VALUES_3PLUS_PAREN_DEPTH === 0) {
          newline = true;
          state.VARIABLE_VALUES_3PLUS = false;
          pre_indent = -1;
        }
      }

      color_func = cprint.toMagenta;
      last_token = ')';
      break;

    case 'SEMI':
      if (state.LAST_TOKEN === ';') {
        append = false;
      }

      if (state.VARIABLE_VALUES_3PLUS) {
        if (state.VARIABLE_VALUES_3PLUS_PAREN_DEPTH === 0) {
          state.VARIABLE_VALUES_3PLUS = false;
          pre_indent = -1;
        }
      }

      space_before = false;
      color_func = cprint.toRed;
      last_token = ';';
      break;

    case 'extraComma':
      state.LAST_TOKEN = 'IGNORE:,';
      break;

    case 'COMMA':
      if (state.LAST_TOKEN === 'IGNORE:,') {
        state.LAST_TOKEN = false;
        append = false;
        break;
      }

      space_before = false;
      color_func = cprint.toWhite;
      last_token = ',';
      break;

    case 'COMMENT':
      if (whitespace_before_includes_newline) {
        newline = (state.LAST_TOKEN === '{');
        double_newline = !newline;
      } else if (state.LAST_TOKEN === 'SINGLE_LINE_COMMENT' || state.LAST_TOKEN === 'MULTI_LINE_COMMENT') {
        double_newline = true;
      }
      color_func = cprint.toDarkGrey;
      last_token = 'MULTI_LINE_COMMENT';
      break;

    case 'SL_COMMENT':
      newline = (whitespace_before_includes_newline || state.LAST_TOKEN === 'SINGLE_LINE_COMMENT');
      color_func = cprint.toDarkGrey;
      last_token = 'SINGLE_LINE_COMMENT';
      break;

    case 'IMPORTANT':
      color_func = cprint.toLightRed;
      last_token = 'IMPORTANT';
      break;

    case 'Number':
    case 'Color':
    case 'RGB_VAL':
    case 'STRING_SINGLE_QUOTED':
    case 'STRING_DOUBLE_QUOTED':
    case 'UrlVal':
    case 'UrlStartVal':
      last_token = 'VALUE';

      switch (state.DECLARATION_TYPE) {

        case 'PROPERTY':
        case 'IMPORT':
        case 'FUNCTION_CALL_ARGUMENTS':
        case 'FUNCTION_END':
        case 'HASH_BLOCK_EXPRESSION':
        case 'MAP_ENTRY_VALUES':
        case 'SELECTOR':
        case 'VARIABLE_VALUES':
          if (state.LAST_TOKEN === '(' || state.LAST_TOKEN === '=') {
            space_before = false;
          } else if (state.LAST_TOKEN === '-' && (state.VALUE_TYPE === 'MEASUREMENT' || state.SECOND_TO_LAST_TOKEN === ':' || state.SECOND_TO_LAST_TOKEN === '(')) {
            space_before = false;
          }

          if (definition_value === '0') {
            last_token = '0'
          }
          color_func = cprint.toYellow;
          break;

        case 'URL':
          switch (definition_key) {
            case 'UrlStartVal':
              last_token = 'URL';
              space_before = true;
              color_func = cprint.toLightCyan;
              break;

            case 'UrlVal':
            case 'STRING_SINGLE_QUOTED':
            case 'STRING_DOUBLE_QUOTED':
              space_before = false;
              color_func = cprint.toYellow;
              break;
          }
          break;

        case 'VARIABLE_VALUES_3PLUS':
          newline = (['(', ':', ',', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
          space_before = true;
          color_func = cprint.toYellow;
          break;

        case 'MULTI_LINE_FUNCTION_END':
          newline = (state.LAST_TOKEN === ',');
          color_func = cprint.toYellow;
          break;

        case 'MAP_ENTRY':
        case 'KEYFRAMES_ENTRY':
          newline = true;
          color_func = cprint.toGreen;
          last_token = 'KEYFRAMES_ENTRY';
          break;

        default:
          append = state.DECLARATION_TYPE + ':' + definition_key;
          color_func = cprint.toBackgroundYellow;
          break;

      }
      break;

    case 'PLUS':
    case 'MINUS':
    case 'DIV':
    case 'TIMES':
    case 'GT':
    case 'AND':
    case 'DOLLAR':
    case 'Identifier':
      last_token = state.VALUE_TYPE;
      switch (state.VALUE_TYPE) {

        case 'SELECTOR':
          newline = (['', '{', ','].indexOf(state.LAST_TOKEN) >= 0);
          double_newline = ([';', '}', 'MULTI_LINE_COMMENT', 'SINGLE_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
          color_func = cprint.toLightCyan;

          if (definition_key === 'GT') {
            last_token = '>';
          } else if (definition_key === 'AND') {
            last_token = '&';
          } else {
            space_before = (state.LAST_TOKEN !== '.' && state.LAST_TOKEN !== '#' && state.LAST_TOKEN !== ':' && state.LAST_TOKEN !== '::' && state.LAST_TOKEN !== '(' && state.LAST_TOKEN !== '[');
            color_func = cprint.toWhite;
          }
          break;

        case 'PROPERTY':
          newline = (state.LAST_TOKEN !== '(');
          space_before = false;
          color_func = cprint.toGreen;
          break;

        case 'PROPERTY_VALUE':
          space_before = (['0', 'PROPERTY_VALUE', ':'].indexOf(state.LAST_TOKEN) >= 0);
          color_func = cprint.toYellow;
          break;

        case 'VARIABLE':
          color_func = cprint.toLightBlue;

          switch (state.DECLARATION_TYPE) {

            case 'MIXIN':
            case 'FUNCTION':
            case 'VARIABLE':
            case 'VARIABLE_VALUES':
            case 'FUNCTION_CALL_ARGUMENTS':
            case 'INCLUDE':
              if (definition_key === 'DOLLAR') {
                newline = (['', '{', ','].indexOf(state.LAST_TOKEN) >= 0);
                double_newline = ([';', '}', 'MULTI_LINE_COMMENT', 'SINGLE_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
                if (state.LAST_TOKEN === '-' || state.LAST_TOKEN === '(') {
                  space_before = false;
                }
                last_token = '$';
              } else {
                space_before = false;
              }
              break;

            case 'VARIABLE_VALUES_3PLUS':
              if (definition_key === 'DOLLAR') {
                newline = (['(', ':', ',', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
                last_token = '$';
              } else {
                space_before = false;
              }
              break;

            case 'PROPERTY':
            case 'EACH':
              if (definition_key === 'DOLLAR') {
                if (state.LAST_TOKEN === '-' || state.LAST_TOKEN === '(') {
                  space_before = false;
                }
                last_token = '$';
              } else {
                space_before = false;
              }
              break;

            case 'HASH_BLOCK_EXPRESSION':
              space_before = false;
              break;

            default:
              append = state.DECLARATION_TYPE + ':' + definition_key;
              color_func = cprint.toBackgroundYellow;
              break;
          }
          break;

        case 'OPERATOR':
          color_func = cprint.toMagenta;

          if (definition_key === 'MINUS') {
            space_before = (state.LAST_TOKEN !== '(');
            last_token = '-';
          }
          break;

        case 'FUNCTION_CALL':
          space_before = ([':', ',', '@return'].indexOf(state.LAST_TOKEN) >= 0);
          color_func = cprint.toLightCyan;

          if (g_FORMAT_PROPERTY_VALUES_ON_NEWLINES.indexOf(definition_value) >= 0) {
            state.MULTI_LINE_FUNCTION = true;
            state.MULTI_LINE_FUNCTION_PAREN_DEPTH = 0;
            post_indent = 1;
          }
          break;

        case 'MULTI_LINE_FUNCTION_CALL':
          newline = (['', '(', ','].indexOf(state.LAST_TOKEN) >= 0);
          color_func = cprint.toLightCyan;
          break;

        case 'KEYFRAMES_ENTRY_PROPERTY':
          space_before = true;
          color_func = cprint.toGreen;
          break;

        case 'STRING':
          space_before = false;
          color_func = cprint.toYellow;
          break;

        default:
          if (state.VALUE_TYPE) {
            append = state.VALUE_TYPE + ':' + definition_key;
            color_func = cprint.toBackgroundRed;
            break;
          }

          last_token = state.DECLARATION_TYPE + '_VALUE';
          switch (state.DECLARATION_TYPE) {

            case 'FUNCTION':
            case 'INCLUDE':
            case 'KEYFRAMES':
            case 'MEDIA':
            case 'MIXIN':
            case 'RETURN':
              color_func = cprint.toCyan;
              break;

            case 'URL':
              space_before = true;
              color_func = cprint.toYellow;
              break;

            case 'HASH_BLOCK_EXPRESSION':
              space_before = false;
              color_func = cprint.toYellow;
              break;

            case 'FUNCTION_CALL_ARGUMENTS':
              space_before = (state.LAST_TOKEN === 'FUNCTION_CALL_ARGUMENTS_VALUE');
              color_func = cprint.toYellow;
              break;

            case 'MULTI_LINE_FUNCTION_CALL_ARGUMENTS':
              newline = (['', '(', ','].indexOf(state.LAST_TOKEN) >= 0);
              space_before = (state.LAST_TOKEN === 'MULTI_LINE_FUNCTION_CALL_ARGUMENTS_VALUE');
              color_func = cprint.toYellow;
              break;

            case 'KEYFRAMES_ENTRY':
              color_func = cprint.toGreen;
              break;

            default:
              append = state.DECLARATION_TYPE + ':' + definition_key;
              color_func = cprint.toBackgroundRed;
              break;
          }
          break;
      }
      break;

    case 'Unit':
      switch (state.DECLARATION_TYPE) {

        case 'PROPERTY':
        case 'IMPORT':
        case 'FUNCTION_END':
        case 'FUNCTION_CALL_ARGUMENTS':
        case 'MULTI_LINE_FUNCTION_END':
        case 'MAP_ENTRY_VALUES':
        case 'VARIABLE':
        case 'VARIABLE_VALUES':
          space_before = false;
          color_func = cprint.toYellow;
          last_token = 'UNIT';
          break;

        case 'KEYFRAMES_ENTRY':
          space_before = false;
          color_func = cprint.toGreen;
          last_token = 'UNIT';
          break;

        default:
          append = state.DECLARATION_TYPE + ':' + definition_key;
          color_func = cprint.toBackgroundYellow;
          break;

      }
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
    if (!color_func) {
      append = definition_key;
      color_func = cprint.toBackgroundRed;
    }

    let delim = '';
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
