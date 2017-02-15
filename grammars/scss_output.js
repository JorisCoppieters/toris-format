'use strict'; // JS: ES5

// ******************************
//
//
// SCSS OUTPUT FILE
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var utils = require('./utils');
var cprint = require('color-print');

// ******************************
// Exposing Functions:
// ******************************

var r_A = utils.r_A;
var r_AG = utils.r_AG;
var r_W = utils.r_W;
var r_S = utils.r_S;
var r_w = utils.r_w;
var r_g = utils.r_g;
var r_v = utils.r_v;
var r_dq = utils.r_dq;
var r_sq = utils.r_sq;

// ******************************
// Output:
// ******************************

function get_output (in_definition_key, in_definition_value, in_state, in_options) {
  var state = in_state || { LAST_TOKEN: '' };
  var options = in_options || { FORMAT_PROPERTY_VALUES_ON_NEWLINES: [], DEBUG: false };

  var definition_key = in_definition_key;
  var definition_value = (in_definition_value || '').trim();
  var whitespace_matches = (in_definition_value || '').match(new RegExp('^' + r_v(r_W), 'i'));
  var whitespace_before = '';
  var whitespace_before_includes_newline = false;
  var whitespace_before_includes_double_newline = false;
  if (whitespace_matches) {
    whitespace_before = whitespace_matches[1];
    whitespace_before_includes_newline = whitespace_before.match(/^[\s]*?(\n|\r\n?)[\s]*?$/);
    whitespace_before_includes_double_newline = whitespace_before.match(/^[\s]*?(\n|\r\n?)[\s]*?(\n|\r\n?)[\s]*?$/);
  }

  var append = definition_value;
  var color_func = false;
  var newline = false;
  var double_newline = false;
  var space_before = true;
  var pre_indent = 0;
  var post_indent = 0;
  var last_token = false;

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
    case 'fontFaceDeclaration':
      state.DECLARATION_TYPE = 'FONT_FACE';
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
    case 'hashBlock':
      state.DECLARATION_TYPE = 'HASH_BLOCK';
      state.VALUE_TYPE = false;
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
    case 'keyframesEntryProperty':
      state.DECLARATION_TYPE = 'KEYFRAMES_ENTRY_PROPERTY';
      state.VALUE_TYPE = 'KEYFRAMES_ENTRY_PROPERTY';
      break;
    case 'keyframesEntryPropertyValues':
      state.DECLARATION_TYPE = 'KEYFRAMES_ENTRY_PROPERTY_VALUE';
      state.VALUE_TYPE = 'KEYFRAMES_ENTRY_PROPERTY_VALUE';
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

      if (['PROPERTY'].indexOf(state.LAST_TOKEN) >= 0) {
        space_before = false;
      } else if (['DASH'].indexOf(definition_key) >= 0) {
        space_before = false;
      } else if (['VARIABLE', 'MAP_ENTRY'].indexOf(state.DECLARATION_TYPE) >= 0) {
        space_before = false;
      } else if (['HASH_BLOCK'].indexOf(state.DECLARATION_TYPE) >= 0 && [':', 'MINUS'].indexOf(state.LAST_TOKEN) < 0) {
        space_before = false;
      } else if (['HASH_BLOCK'].indexOf(state.DECLARATION_TYPE) >= 0 && ['-'].indexOf(state.LAST_TOKEN) >= 0) {
        space_before = false;
      } else if (['SELECTOR'].indexOf(state.DECLARATION_TYPE) >= 0 && ['COLON', 'LBRACK', 'EQ', 'RBRACK'].indexOf(definition_key) >= 0) {
        space_before = false;
      } else if (['SELECTOR'].indexOf(state.DECLARATION_TYPE) >= 0 && !whitespace_before) {
        space_before = false;
      } else if (['KEYFRAMES_ENTRY', 'KEYFRAMES_ENTRY_PROPERTY_VALUE', 'MIXIN'].indexOf(state.DECLARATION_TYPE) >= 0 && ['COLON'].indexOf(definition_key) >= 0) {
        space_before = false;
      }

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
    case 'FONT_FACE':
    case 'MIXIN':
    case 'PAGE':
    case 'RETURN':
      double_newline = (whitespace_before_includes_double_newline);
      newline = (whitespace_before_includes_newline || [';', '{', ',', '}', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
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
        case 'FUNCTION_END':
        case 'HASH_BLOCK_EXPRESSION':
        case 'PROPERTY':
        case 'KEYFRAMES':
        case 'FONT_FACE':
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
          if (options.DEBUG) {
            append = state.DECLARATION_TYPE + ':' + definition_key;
            color_func = cprint.toBackgroundYellow;
          }
          break;

      }
      break;
    case 'BlockEnd':
      last_token = '}';
      pre_indent = -1;
      newline = true;
      color_func = cprint.toWhite;

      switch (state.DECLARATION_TYPE) {

        case false:
        case 'SELECTOR':
        case 'INCLUDE':
        case 'MIXIN':
        case 'VARIABLE':
        case 'VARIABLE_VALUES':
        case 'FUNCTION_END':
        case 'FUNCTION_CALL_ARGUMENTS':
        case 'PROPERTY':
        case 'KEYFRAMES_END':
        case 'URL':
          break;

        case 'KEYFRAMES_ENTRY_END':
          newline = false;
          break;

        case 'HASH_BLOCK_EXPRESSION':
          newline = false;
          space_before = false;
          break;

        case 'HASH_BLOCK_END':
          newline = false;
          space_before = false;
          state.DECLARATION_TYPE = false;
          break;

        default:
          if (options.DEBUG) {
            append = state.DECLARATION_TYPE + ':' + definition_key;
            color_func = cprint.toBackgroundYellow;
          }
          break;

      }
      break;

    case 'LPAREN':
      if (['FUNCTION_CALL', 'MULTI_LINE_FUNCTION_CALL', 'SELECTOR', 'MINUS', 'URL'].indexOf(state.LAST_TOKEN) >= 0) {
        space_before = false;
      }

      if (['INCLUDE', 'MEDIA', 'MIXIN', 'PAGE', 'FUNCTION', 'RETURN'].indexOf(state.DECLARATION_TYPE) >= 0) {
        space_before = false;
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

    case 'NOSEMI':
    case 'SEMI':
      append = ';';
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
      double_newline = (whitespace_before_includes_double_newline || ['SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
      newline = (whitespace_before_includes_newline);
      color_func = cprint.toDarkGrey;
      last_token = 'MULTI_LINE_COMMENT';
      break;

    case 'SL_COMMENT':
      double_newline = (whitespace_before_includes_double_newline || ['MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
      newline = (whitespace_before_includes_newline || ['SINGLE_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
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
        case 'MIXIN':
        case 'FUNCTION_CALL_ARGUMENTS':
        case 'FUNCTION_END':
        case 'HASH_BLOCK_EXPRESSION':
        case 'MAP_ENTRY_VALUES':
        case 'SELECTOR':
        case 'VARIABLE_VALUES':
          if (state.LAST_TOKEN === '(' || state.LAST_TOKEN === '=') {
            space_before = false;
          } else if (state.LAST_TOKEN === 'MINUS' && state.VALUE_TYPE === 'MEASUREMENT' && state.DECLARATION_TYPE !== 'FUNCTION_CALL_ARGUMENTS') {
            space_before = false;
          } else if (state.LAST_TOKEN === 'MINUS' && ['OPERATOR', ':', '('].indexOf(state.SECOND_TO_LAST_TOKEN) >= 0) {
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

        case 'IMPORT':
          newline = (state.LAST_TOKEN !== '@import');
          color_func = cprint.toYellow;
          last_token = 'IMPORT';
          break;

        case 'MAP_ENTRY':
          newline = true;
          color_func = cprint.toGreen;
          last_token = 'MAP_ENTRY';
          break;

        case 'KEYFRAMES_ENTRY':
          newline = true;
          color_func = cprint.toGreen;
          last_token = 'KEYFRAMES_ENTRY';
          break;

        case 'KEYFRAMES_ENTRY_PROPERTY_VALUE':
          color_func = cprint.toYellow;
          last_token = 'KEYFRAMES_ENTRY_PROPERTY_VALUE';
          break;

        default:
          if (options.DEBUG) {
            append = state.DECLARATION_TYPE + ':' + state.VALUE_TYPE + ':' + definition_key;
            color_func = cprint.toBackgroundYellow;
          }
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
          double_newline = (whitespace_before_includes_double_newline || [';', '}', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
          newline = (whitespace_before_includes_newline || ['', ';', '{', ',', 'SINGLE_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
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

        case 'MEASUREMENT':
          color_func = cprint.toYellow;
          break;

        case 'VARIABLE':
          color_func = cprint.toLightBlue;
          last_token = definition_value;

          switch (state.DECLARATION_TYPE) {

            case 'FUNCTION':
            case 'VARIABLE':
            case 'VARIABLE_VALUES':
            case 'MAP_ENTRY_VALUES':
            case 'INCLUDE':
              if (definition_key === 'DOLLAR') {
                double_newline = (whitespace_before_includes_double_newline || ['}', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
                newline = (whitespace_before_includes_newline || [';', '{', ','].indexOf(state.LAST_TOKEN) >= 0);
                if (state.LAST_TOKEN === 'MINUS' || state.LAST_TOKEN === '(') {
                  space_before = false;
                }
                last_token = '$';
              } else {
                if (state.LAST_TOKEN === '$') {
                  space_before = false;
                }
              }
              break;

            case 'VARIABLE_VALUES_3PLUS':
              if (definition_key === 'DOLLAR') {
                newline = (['(', ':', ',', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
                last_token = '$';
              } else {
                if (state.LAST_TOKEN === '$') {
                  space_before = false;
                }
              }
              break;

            case 'MIXIN':
            case 'PROPERTY':
            case 'FUNCTION_CALL_ARGUMENTS':
            case 'EACH':
              if (definition_key === 'DOLLAR') {
                if (state.LAST_TOKEN === 'MINUS' || state.LAST_TOKEN === '(') {
                  space_before = false;
                }
                last_token = '$';
              } else {
                if (state.LAST_TOKEN === '$') {
                  space_before = false;
                }
              }
              break;

            case 'HASH_BLOCK_EXPRESSION':
              space_before = false;
              break;

            default:
              if (options.DEBUG) {
                append = state.DECLARATION_TYPE + ':' + state.VALUE_TYPE + ':' + definition_key;
                color_func = cprint.toBackgroundYellow;
              }
              break;
          }
          break;

        case 'OPERATOR':
          color_func = cprint.toMagenta;

          if (definition_key === 'MINUS') {
            space_before = (state.LAST_TOKEN !== '(');
            last_token = 'MINUS';
          }
          break;

        case 'FUNCTION_CALL':
          color_func = cprint.toLightCyan;

          if (['{'].indexOf(state.LAST_TOKEN) >= 0) {
            space_before = false;
          }

          if (options.FORMAT_PROPERTY_VALUES_ON_NEWLINES.indexOf(definition_value) >= 0) {
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
            if (options.DEBUG) {
              append = '[NO DECLARATION_TYPE]:' + state.VALUE_TYPE + ':' + definition_key;
              color_func = cprint.toBackgroundRed;
            }
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

            case 'MAP_ENTRY':
              newline = (['', '(', ','].indexOf(state.LAST_TOKEN) >= 0);
              color_func = cprint.toYellow;
              break;

            default:
              if (options.DEBUG) {
                append = state.DECLARATION_TYPE + ':' + definition_key;
                color_func = cprint.toBackgroundRed;
              }
              break;
          }
          break;
      }
      break;

    case 'Unit':
      switch (state.DECLARATION_TYPE) {

        case 'PROPERTY':
        case 'IMPORT':
        case 'MIXIN':
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
          if (options.DEBUG) {
            append = state.DECLARATION_TYPE + ':' + state.VALUE_TYPE + ':' + definition_key;
            color_func = cprint.toBackgroundYellow;
          }
          break;

      }
      break;
  }

  return {
    append,
    color_func,
    newline,
    double_newline,
    space_before,
    pre_indent,
    post_indent,
    last_token
  };
}

// ******************************
// Exports:
// ******************************

module.exports['get_output'] = get_output;

// ******************************