'use strict'; // JS: ES5

// ******************************
//
//
// CORE GRAMMAR FUNCTIONS
//
//
// ******************************

// ******************************
// Requires:
// ******************************

// ******************************
// Constants:
// ******************************

const k_DEBUG_ALL = 'ALL';
const k_DEBUG_MATCH = 'MATCH';
const k_DEBUG_MATCH_VAL = 'MATCH_VAL';
const k_DEBUG_OFF = 'OFF';

const k_DEFINITION_KEY_EMPTY = 'VAL__EMPTY';
const k_DEFINITION_KEY_START = 'START';

// ******************************
// Functions:
// ******************************

function export_grammar(in_grammar, in_dependant_grammars) {
  var exports = [];

  if (in_dependant_grammars && in_dependant_grammars.length) {
    exports = export_dependant_grammars(in_dependant_grammars);
  }

  Object.keys(in_grammar).forEach(function (key) {
    var definition = in_grammar[key];
    definition.key = key;
    exports[key] = definition;
    exports[key+'*'] = { // Multiple Defintion
      OPERATOR: '*',
      SEGMENTS: [key],
      DEBUG: definition.DEBUG
    };
    exports[key+'+'] = { // Multiple Compulsary Defintion
      OPERATOR: '+',
      SEGMENTS: [key],
      DEBUG: definition.DEBUG
    };
    exports[key+'?'] = { // Optional Defintion
      OPERATOR: '||',
      SEGMENTS: [key, k_DEFINITION_KEY_EMPTY],
      DEBUG: definition.DEBUG
    };
  });

  return exports;
}

// ******************************

function export_dependant_grammars(in_dependant_grammars) {
  var exports = [];
  in_dependant_grammars.forEach(function (dependant_grammars) {
    Object.keys(dependant_grammars).forEach(function (key) {
      exports[key] = dependant_grammars[key];
    })
  });
  return exports;
}

// ******************************
// Exports:
// ******************************

module.exports['export_grammar'] = export_grammar;
module.exports['k_DEBUG_ALL'] = k_DEBUG_ALL;
module.exports['k_DEBUG_MATCH'] = k_DEBUG_MATCH;
module.exports['k_DEBUG_MATCH_VAL'] = k_DEBUG_MATCH_VAL;
module.exports['k_DEBUG_OFF'] = k_DEBUG_OFF;
module.exports['k_DEFINITION_KEY_EMPTY'] = k_DEFINITION_KEY_EMPTY;
module.exports['k_DEFINITION_KEY_START'] = k_DEFINITION_KEY_START;

// ******************************