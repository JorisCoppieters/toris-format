'use strict'; // JS: ES5

// ******************************
//
//
// CORE DEFINITION FILE
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var utils = require('./utils');

// ******************************
// Definition:
// ******************************

var DEFINITION = {
  EMPTY: {
    OPERATOR: '==',
    VALUE: ''
  },
  LETTERS_LOWERCASE: {
    OPERATOR: '==',
    VALUE: '[a-z]+'
  },
  LETTERS_UPPERCASE: {
    OPERATOR: '==',
    VALUE: '[A-Z]+'
  },
  NUMBERS: {
    OPERATOR: '==',
    VALUE: '[0-9]+'
  },
  LETTER: {
    OPERATOR: '||',
    SEGMENTS: ['LETTER_LOWERCASE', 'LETTER_UPPERCASE']
  },
  LETTER_LOWERCASE: {
    OPERATOR: '==',
    VALUE: '[a-z]'
  },
  LETTER_UPPERCASE: {
    OPERATOR: '==',
    VALUE: '[A-Z]'
  },
  NUMBER: {
    OPERATOR: '==',
    VALUE: '[0-9]'
  },
  UNDERSCORE: {
    OPERATOR: '==',
    VALUE: '[_]'
  },
  DASH: {
    OPERATOR: '==',
    VALUE: '[-]'
  },
  OPEN_ANGLED_BRACKET: {
    OPERATOR: '==',
    VALUE: '[<]'
  },
  CLOSE_ANGLED_BRACKET: {
    OPERATOR: '==',
    VALUE: '[>]'
  },
  SLASH: {
    OPERATOR: '==',
    VALUE: '[/]'
  },
  BACKSLASH: {
    OPERATOR: '==',
    VALUE: '[\\]'
  },
  SINGLE_QUOTE: {
    OPERATOR: '==',
    VALUE: '[\']'
  },
  DOUBLE_QUOTE: {
    OPERATOR: '==',
    VALUE: '["]'
  },
  EQUALS: {
    OPERATOR: '==',
    VALUE: '[=]'
  },
  WHITESPACE: {
    OPERATOR: '==',
    VALUE: utils.r_W
  }
};

// ******************************
// Exports:
// ******************************

Object.keys(DEFINITION).forEach(function (key) {
  var definition = DEFINITION[key];
  definition.key = key;
  module.exports[key] = definition;
});

// ******************************