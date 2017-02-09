// ******************************
//
//
// COPE DEFINITION FILE
//
//
// ******************************

// ******************************
// Functions:
// ******************************

var r_A = '[\\s\\S]*?'; // RegEx: Any (Not Greedy)
var r_AG = '[\\s\\S]*'; // RegEx: Any (Greedy)
var r_W = '[\\s]*'; // RegEx: Optional Whitepsace
var r_S = '[\\s]+'; // RegEx: Whitepsace

// ******************************

function r_w (in_re) { // RegEx: Whitespace around
  return r_W + in_re + r_W;
}

// ******************************

function r_g (in_re) { // RegEx: Group
  return '(?:' + in_re + ')';
}

// ******************************

function r_v (in_re) { // RegEx: Variable
  return '(' + in_re + ')';
}

// ******************************

function r_dq (in_re) { // RegEx: Double Quote
  return r_W + '"' + r_W + in_re + r_W + '"';
}

// ******************************

function r_sq (in_re) { // RegEx: Single Quote
  return r_W + '\'' + r_W + in_re + r_W + '\'';
}

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
    VALUE: r_W
  }
};

// ******************************
// Exports:
// ******************************

Object.keys(DEFINITION).forEach((key) => {
  var definition = DEFINITION[key];
  definition.key = key;
  module.exports[key] = definition;
});

module.exports['r_A'] = r_A;
module.exports['r_AG'] = r_AG;
module.exports['r_W'] = r_W;
module.exports['r_S'] = r_S;
module.exports['r_w'] = r_w;
module.exports['r_g'] = r_g;
module.exports['r_v'] = r_v;
module.exports['r_dq'] = r_dq;
module.exports['r_sq'] = r_sq;

// ******************************