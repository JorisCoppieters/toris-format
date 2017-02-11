'use strict';

// ******************************
//
//
// SCSS LEXER DEFINITION FILE
//
//
// ******************************

// ******************************
// Definition:
// ******************************

var DEFINITION = {
  EMPTY: {
    OPERATOR: '==',
    VALUE: ''
  },
  NULL: {
    OPERATOR: '==',
    VALUE: 'null'
  },
  IN: {
    OPERATOR: '==',
    VALUE: 'in'
  },
  Unit: {
    OPERATOR: '==',
    VALUE: '(%|px|cm|mm|in|pt|pc|em|ex|deg|rad|grad|ms|s|hz|khz)'
  },
  COMBINE_COMPARE: {
    OPERATOR: '||',
    SEGMENTS: ['COMBINE_COMPARE_AND', 'COMBINE_COMPARE_OR']
  },
  COMBINE_COMPARE_AND: {
    OPERATOR: '==',
    VALUE: '&&'
  },
  COMBINE_COMPARE_OR: {
    OPERATOR: '==',
    VALUE: '||'
  },
  Ellipsis: {
    OPERATOR: '==',
    VALUE: '\\.\\.\\.'
  },
  LPAREN: {
    OPERATOR: '==',
    VALUE: '\\('
  },
  RPAREN: {
    OPERATOR: '==',
    VALUE: '\\)'
  },
  BlockStart: {
    OPERATOR: '==',
    VALUE: '\\{'
  },
  BlockEnd: {
    OPERATOR: '==',
    VALUE: '\\}'
  },
  LBRACK: {
    OPERATOR: '==',
    VALUE: '\\['
  },
  RBRACK: {
    OPERATOR: '==',
    VALUE: '\\]'
  },
  GT: {
    OPERATOR: '==',
    VALUE: '>'
  },
  TIL: {
    OPERATOR: '==',
    VALUE: '~'
  },
  LT: {
    OPERATOR: '==',
    VALUE: '<'
  },
  COLON: {
    OPERATOR: '==',
    VALUE: ':'
  },
  SEMI: {
    OPERATOR: '==',
    VALUE: ';'
  },
  COMMA: {
    OPERATOR: '==',
    VALUE: ','
  },
  DOT: {
    OPERATOR: '==',
    VALUE: '\\.'
  },
  DOLLAR: {
    OPERATOR: '==',
    VALUE: '\\$'
  },
  AT: {
    OPERATOR: '==',
    VALUE: '@'
  },
  AND: {
    OPERATOR: '==',
    VALUE: '&'
  },
  HASH: {
    OPERATOR: '==',
    VALUE: '#'
  },
  COLONCOLON: {
    OPERATOR: '==',
    VALUE: '\:\:'
  },
  PLUS: {
    OPERATOR: '==',
    VALUE: '\\+'
  },
  TIMES: {
    OPERATOR: '==',
    VALUE: '\\*'
  },
  DIV: {
    OPERATOR: '==',
    VALUE: '\\/'
  },
  MINUS: {
    OPERATOR: '==',
    VALUE: '\\-'
  },
  PERC: {
    OPERATOR: '==',
    VALUE: '%'
  },
  UrlStart: {
    OPERATOR: '&&',
    SEGMENTS: ['UrlStartVal', 'LPAREN']
  },
  UrlStartVal: {
    OPERATOR: '==',
    VALUE: 'url'
  },
  EQEQ: {
    OPERATOR: '==',
    VALUE: '=='
  },
  NOTEQ: {
    OPERATOR: '==',
    VALUE: '!='
  },
  EQ: {
    OPERATOR: '==',
    VALUE: '='
  },
  PIPE_EQ: {
    OPERATOR: '==',
    VALUE: '|='
  },
  TILD_EQ: {
    OPERATOR: '==',
    VALUE: '~='
  },
  MIXIN: {
    OPERATOR: '==',
    VALUE: '@mixin'
  },
  FUNCTION: {
    OPERATOR: '==',
    VALUE: '@function'
  },
  AT_ELSE: {
    OPERATOR: '==',
    VALUE: '@else'
  },
  IF: {
    OPERATOR: '==',
    VALUE: 'if'
  },
  AT_IF: {
    OPERATOR: '==',
    VALUE: '@if'
  },
  AT_FOR: {
    OPERATOR: '==',
    VALUE: '@for'
  },
  AT_WHILE: {
    OPERATOR: '==',
    VALUE: '@while'
  },
  AT_EACH: {
    OPERATOR: '==',
    VALUE: '@each'
  },
  INCLUDE: {
    OPERATOR: '==',
    VALUE: '@include'
  },
  IMPORT: {
    OPERATOR: '==',
    VALUE: '@import'
  },
  IMPORTANT: {
    OPERATOR: '==',
    VALUE: '\\!important'
  },
  RETURN: {
    OPERATOR: '==',
    VALUE: '@return'
  },
  MEDIA: {
    OPERATOR: '==',
    VALUE: '@media'
  },
  PAGE: {
    OPERATOR: '==',
    VALUE: '@page'
  },
  FROM: {
    OPERATOR: '==',
    VALUE: 'from'
  },
  THROUGH: {
    OPERATOR: '==',
    VALUE: 'through'
  },
  POUND_DEFAULT: {
    OPERATOR: '==',
    VALUE: '!default'
  },
  Identifier: {
    OPERATOR: '==',
    VALUE: '\\-?[a-zA-Z\\u0100-\\ufffe_][a-zA-Z\\u0100-\\ufffe0-9_-]*'
  },
  STRING: {
    OPERATOR: '||',
    SEGMENTS: ['STRING_SINGLE_QUOTED', 'STRING_DOUBLE_QUOTED']
  },
  STRING_SINGLE_QUOTED: {
    OPERATOR: '==',
    VALUE: '\'[^\'\\n\\r]*\''
  },
  STRING_DOUBLE_QUOTED: {
    OPERATOR: '==',
    VALUE: '"[^"\\n\\r]*"'
  },
  StringLiteral: {
    OPERATOR: '&&',
    SEGMENTS: ['STRING']
  },
  Number: {
    OPERATOR: '==',
    VALUE: '\\-?(?:[0-9]*\\.)?[0-9]+'
  },
  Color: {
    OPERATOR: '==',
    VALUE: '#[0-9a-fA-F]+'
  },
  RGB_NUMERIC_VAL: {
    OPERATOR: '==',
    VALUE: '(?:[0-9]{0,3}\\.)?[0-9]+'
  },
  WS: {
    OPERATOR: '==',
    VALUE: '[ \\t\\n\\r]+'
  },
  SL_COMMENT: {
    OPERATOR: '==',
    VALUE: '\\/\\/[^\\n\\r]*(?:[\\n]|[\\r](?:[\\n])?)'
  },
  COMMENT: {
    OPERATOR: '==',
    VALUE: '\\/\\*.*?\\*\\/'
  },
  UrlEnd: {
    OPERATOR: '&&',
    SEGMENTS: ['RPAREN']
  },
  Url: {
    OPERATOR: '||',
    SEGMENTS: ['STRING', 'UrlVal']
  },
  UrlVal: {
    OPERATOR: '==',
    VALUE: '[^\)]+'
  }
};

// ******************************
// Exports:
// ******************************

Object.keys(DEFINITION).forEach((key) => {
  var definition = DEFINITION[key];
  definition.key = key;
  module.exports[key] = definition;
  module.exports[key+'*'] = { // Multiple Defintion
    OPERATOR: '*',
    SEGMENTS: [key]
  };
  module.exports[key+'+'] = { // Multiple Compulsary Defintion
    OPERATOR: '+',
    SEGMENTS: [key]
  };
  module.exports[key+'?'] = { // Optional Defintion
    OPERATOR: '||',
    SEGMENTS: [key, 'EMPTY']
  };
});

// ******************************