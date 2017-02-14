'use strict'; // JS: ES5

// ******************************
//
//
// HTML DEFINITION FILE
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var utils = require('./utils');
var GRAMMAR_CORE = require('./core');
var GRAMMAR_SCSS = require('./scss');

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
// Definition:
// ******************************

var DEFINITION = {
  START: {
    OPERATOR: '||',
    SEGMENTS: ['HTML_SEGMENTS', 'SCSS_SEGMENTS']
  },
  HTML_SEGMENTS: {
    OPERATOR: '*',
    SEGMENTS: ['HTML_SEGMENT']
  },
  HTML_SEGMENT: {
    OPERATOR: '||',
    SEGMENTS: ['HTML_STYLE', 'HTML_ELEMENT', 'HTML_COMMENT', 'HTML_CONTENT']
  },
  HTML_ELEMENT: {
    OPERATOR: '||',
    SEGMENTS: ['HTML_ELEMENT_EMPTY', 'HTML_ELEMENT_NON_EMPTY']
  },
  HTML_ELEMENT_EMPTY: {
    OPERATOR: '&&',
    SEGMENTS: ['HTML_OPEN_ELEMENT', 'HTML_CLOSE_ELEMENT']
  },
  HTML_ELEMENT_NON_EMPTY: {
    OPERATOR: '&&',
    SEGMENTS: ['HTML_OPEN_ELEMENT', 'HTML_SEGMENTS', 'HTML_CLOSE_ELEMENT']
  },
  HTML_OPEN_ELEMENT: {
    OPERATOR: '||',
    SEGMENTS: ['HTML_OPEN_ELEMENT_EMPTY', 'HTML_OPEN_ELEMENT_NON_EMPTY']
  },
  HTML_OPEN_ELEMENT_EMPTY: {
    OPERATOR: '&&',
    SEGMENTS: ['HTML_OPEN_ELEMENT_START', 'HTML_OPEN_ELEMENT_END']
  },
  HTML_OPEN_ELEMENT_NON_EMPTY: {
    OPERATOR: '&&',
    SEGMENTS: ['HTML_OPEN_ELEMENT_START', 'HTML_OPEN_ELEMENT_ATTRIBUTES', 'HTML_OPEN_ELEMENT_END']
  },
  HTML_OPEN_ELEMENT_START: {
    OPERATOR: '&&',
    SEGMENTS: ['OPEN_ANGLED_BRACKET', 'HTML_ELEMENT_NAME']
  },
  HTML_ELEMENT_NAME: {
    OPERATOR: '==',
    VALUE: '[a-zA-Z0-9_-]+'
  },
  HTML_OPEN_ELEMENT_ATTRIBUTES: {
    OPERATOR: '*',
    SEGMENTS: ['HTML_OPEN_ELEMENT_ATTRIBUTE_WITH_WHITESPACE']
  },
  HTML_OPEN_ELEMENT_ATTRIBUTE_WITH_WHITESPACE: {
    OPERATOR: '&&',
    SEGMENTS: ['WHITESPACE', 'HTML_OPEN_ELEMENT_ATTRIBUTE']
  },
  HTML_OPEN_ELEMENT_ATTRIBUTE: {
    OPERATOR: '||',
    SEGMENTS: [
      'HTML_ELEMENT_ATTRIBUTE_DOUBLE_QUOTED_VALUE',
      'HTML_ELEMENT_ATTRIBUTE_SINGLE_QUOTED_VALUE',
      'HTML_ELEMENT_ATTRIBUTE_EMPTY_VALUE',
      'HTML_ELEMENT_ATTRIBUTE_NO_VALUE'
    ]
  },
  HTML_ELEMENT_ATTRIBUTE_NO_VALUE: {
    OPERATOR: '&&',
    SEGMENTS: ['HTML_ELEMENT_ATTRIBUTE_KEY']
  },
  HTML_ELEMENT_ATTRIBUTE_EMPTY_VALUE: {
    OPERATOR: '&&',
    SEGMENTS: ['HTML_ELEMENT_ATTRIBUTE_KEY', 'WHITESPACE', 'EQUALS', 'WHITESPACE', 'HTML_ELEMENT_ATTRIBUTE_VALUE_EMPTY']
  },
  HTML_ELEMENT_ATTRIBUTE_SINGLE_QUOTED_VALUE: {
    OPERATOR: '&&',
    SEGMENTS: ['HTML_ELEMENT_ATTRIBUTE_KEY', 'WHITESPACE', 'EQUALS', 'WHITESPACE', 'SINGLE_QUOTE', 'HTML_ELEMENT_ATTRIBUTE_VALUE_QUOTED', 'SINGLE_QUOTE']
  },
  HTML_ELEMENT_ATTRIBUTE_DOUBLE_QUOTED_VALUE: {
    OPERATOR: '&&',
    SEGMENTS: ['HTML_ELEMENT_ATTRIBUTE_KEY', 'WHITESPACE', 'EQUALS', 'WHITESPACE', 'DOUBLE_QUOTE', 'HTML_ELEMENT_ATTRIBUTE_VALUE_QUOTED', 'DOUBLE_QUOTE']
  },
  HTML_ELEMENT_ATTRIBUTE_KEY: {
    OPERATOR: '==',
    VALUE: '[:a-z0-9_-]+'
  },
  HTML_ELEMENT_ATTRIBUTE_VALUE_EMPTY: {
    OPERATOR: '==',
    VALUE: r_dq('')
  },
  HTML_ELEMENT_ATTRIBUTE_VALUE_QUOTED: {
    OPERATOR: '||',
    SEGMENTS: ['HTML_ELEMENT_ATTRIBUTE_VALUE_ONE_WAY_BOUND_QUOTED', 'HTML_ELEMENT_ATTRIBUTE_VALUE_NOT_ONE_WAY_BOUND_QUOTED']
  },
  HTML_ELEMENT_ATTRIBUTE_VALUE_ONE_WAY_BOUND_QUOTED: {
    OPERATOR: '&&',
    SEGMENTS: ['HTML_ELEMENT_ATTRIBUTE_ONE_WAY_BINDING', 'WHITESPACE', 'HTML_ELEMENT_ATTRIBUTE_VALUE_STRING']
  },
  HTML_ELEMENT_ATTRIBUTE_VALUE_NOT_ONE_WAY_BOUND_QUOTED: {
    OPERATOR: '&&',
    SEGMENTS: ['HTML_ELEMENT_ATTRIBUTE_VALUE_STRING']
  },
  HTML_ELEMENT_ATTRIBUTE_ONE_WAY_BINDING: {
    OPERATOR: '==',
    VALUE: '\:\:'
  },
  HTML_ELEMENT_ATTRIBUTE_VALUE_STRING: {
    OPERATOR: '==',
    VALUE: '[:a-zA-Z0-9 /\\._-]+'
  },
  HTML_OPEN_ELEMENT_END: {
    OPERATOR: '||',
    SEGMENTS: ['HTML_OPEN_ELEMENT_END_CLOSED', 'HTML_OPEN_ELEMENT_END_SELF_CLOSED']
  },
  HTML_OPEN_ELEMENT_END_CLOSED: {
    OPERATOR: '&&',
    SEGMENTS: ['WHITESPACE', 'CLOSE_ANGLED_BRACKET']
  },
  HTML_OPEN_ELEMENT_END_SELF_CLOSED: {
    OPERATOR: '&&',
    SEGMENTS: ['WHITESPACE', 'SLASH', 'WHITESPACE', 'CLOSE_ANGLED_BRACKET']
  },
  HTML_CLOSE_ELEMENT: {
    OPERATOR: '&&',
    SEGMENTS: ['WHITESPACE', 'OPEN_ANGLED_BRACKET', 'WHITESPACE', 'SLASH', 'WHITESPACE', 'HTML_ELEMENT_NAME', 'WHITESPACE', 'CLOSE_ANGLED_BRACKET']
  },
  HTML_STYLE: {
    OPERATOR: '||',
    SEGMENTS: ['HTML_STYLE_EMPTY', 'HTML_STYLE_NON_EMPTY']
  },
  HTML_STYLE_EMPTY: {
    OPERATOR: '&&',
    SEGMENTS: ['HTML_STYLE_OPEN_ELEMENT', 'HTML_STYLE_CLOSE_ELEMENT']
  },
  HTML_STYLE_NON_EMPTY: {
    OPERATOR: '&&',
    SEGMENTS: ['HTML_STYLE_OPEN_ELEMENT', 'SCSS_SEGMENTS', 'HTML_STYLE_CLOSE_ELEMENT']
  },
  HTML_STYLE_OPEN_ELEMENT: {
    OPERATOR: '==',
    REGEXP: new RegExp('^' + r_v(r_W) + '<style[^>]*>' + r_v(r_AG) + '$', 'i')
  },
  HTML_STYLE_CLOSE_ELEMENT: {
    OPERATOR: '==',
    REGEXP: new RegExp('^' + r_v(r_W) + '<\/style>' + r_v(r_AG) + '$', 'i')
  },
  HTML_CONTENT: {
    OPERATOR: '==',
    REGEXP: new RegExp('^' + r_v(r_W) + r_v('[^<]+?') + r_v(r_W + '<' + r_AG) + '$', 'i')
  },
  HTML_COMMENT: {
    OPERATOR: '==',
    REGEXP: new RegExp('^' + r_v(r_W) + '<!--' + r_W + r_v(r_A) + r_W + '-->' + r_v(r_AG), 'i')
  },
};

// ******************************
// Exports:
// ******************************

[GRAMMAR_CORE, GRAMMAR_SCSS].forEach(function (objectToExpose) {
  Object.keys(objectToExpose).forEach(function (key) {
    module.exports[key] = objectToExpose[key];
  })
});

Object.keys(DEFINITION).forEach(function (key) {
  var definition = DEFINITION[key];
  definition.key = key;
  module.exports[key] = definition;
});

// ******************************