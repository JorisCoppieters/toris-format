'use strict'; // JS: ES5

// ******************************
//
//
// BASE DEFINITION FILE
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var grammar = require('./_core');
var re = require('../regexp/shorthand');

// ******************************
// Definition:
// ******************************

module.exports = grammar.export_grammar({
  VAL__ANBRAC_L: { OPERATOR: '==', VALUE: '[<]' },
  VAL__ANBRAC_R: { OPERATOR: '==', VALUE: '[>]' },
  VAL__AND: { OPERATOR: '==', VALUE: '[&][&]' },
  VAL__BACKSLASH: { OPERATOR: '==', VALUE: '[\\]' },
  VAL__COLON: { OPERATOR: '==', VALUE: ':' },
  VAL__COMMA: { OPERATOR: '==', VALUE: ',' },
  VAL__CURLY_L: { OPERATOR: '==', VALUE: '[{]' },
  VAL__CURLY_R: { OPERATOR: '==', VALUE: '[}]' },
  VAL__DASH: { OPERATOR: '==', VALUE: '[-]' },
  VAL__DIVIDE: { OPERATOR: '==', VALUE: '[/]' },
  VAL__DOLLAR: { OPERATOR: '==', VALUE: '[$]' },
  VAL__DOT: { OPERATOR: '==', VALUE: '\\.' },
  VAL__DQUOTE: { OPERATOR: '==', VALUE: '["]' },
  VAL__EMPTY: { OPERATOR: '==', VALUE: '' },
  VAL__EQ: { OPERATOR: '==', VALUE: '[=]' },
  VAL__EQEQ: { OPERATOR: '==', VALUE: '==' },
  VAL__EXCLAM: { OPERATOR: '==', VALUE: '[!]' },
  VAL__FALSE: { OPERATOR: '==', VALUE: 'false' },
  VAL__GT: { OPERATOR: '==', VALUE: '>' },
  VAL__GTEQ: { OPERATOR: '==', VALUE: '>=' },
  VAL__LAND: { OPERATOR: '==', VALUE: '[&]' },
  VAL__LETTER_LOWERCASE: { OPERATOR: '==', VALUE: '[a-z]' },
  VAL__LETTER_UPPERCASE: { OPERATOR: '==', VALUE: '[A-Z]' },
  VAL__LETTERS_LOWERCASE: { OPERATOR: '==', VALUE: '[a-z]+' },
  VAL__LETTERS_UPPERCASE: { OPERATOR: '==', VALUE: '[A-Z]+' },
  VAL__LOR: { OPERATOR: '==', VALUE: '[|]' },
  VAL__LT: { OPERATOR: '==', VALUE: '<' },
  VAL__LTEQ: { OPERATOR: '==', VALUE: '<=' },
  VAL__MINUS: { OPERATOR: '==', VALUE: '[-]' },
  VAL__NOTEQ: { OPERATOR: '==', VALUE: '!=' },
  VAL__NUMBER: { OPERATOR: '==', VALUE: '[0-9]' },
  VAL__NUMBERS: { OPERATOR: '==', VALUE: '[0-9]+' },
  VAL__OR: { OPERATOR: '==', VALUE: '[|][|]' },
  VAL__PAREN_L: { OPERATOR: '==', VALUE: '[(]' },
  VAL__PAREN_R: { OPERATOR: '==', VALUE: '[)]' },
  VAL__PLUS: { OPERATOR: '==', VALUE: '[+]' },
  VAL__SEMI: { OPERATOR: '==', VALUE: ';' },
  VAL__SLASH: { OPERATOR: '==', VALUE: '[/]' },
  VAL__SQBRAC_L: { OPERATOR: '==', VALUE: '\\[' },
  VAL__SQBRAC_R: { OPERATOR: '==', VALUE: '\\]' },
  VAL__SQUOTE: { OPERATOR: '==', VALUE: '[\']' },
  VAL__TIMES: { OPERATOR: '==', VALUE: '[*]' },
  VAL__TRUE: { OPERATOR: '==', VALUE: 'true' },
  VAL__UNDERSCORE: { OPERATOR: '==', VALUE: '[_]' },
  VAL__WHITESPACE: { OPERATOR: '==', VALUE: re.r_W },
});

// ******************************