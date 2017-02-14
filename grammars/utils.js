'use strict'; // JS: ES5

// ******************************
//
//
// GRAMMAR UTILITIES
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
// Exports:
// ******************************

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