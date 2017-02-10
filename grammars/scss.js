'use strict';

// ******************************
//
//
// SCSS DEFINITION FILE
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var GRAMMAR_SCSS_LEX = require('./scss_lex');

// ******************************
// Exposing Functions:
// ******************************

// ******************************
// Definition:
// ******************************

var DEFINITION = {
  START: {
    OPERATOR: '||',
    SEGMENTS: ['stylesheet']
  },
  SCSS_SEGMENTS: {
    OPERATOR: '||',
    SEGMENTS: ['stylesheet']
  },
  stylesheet: {
    OPERATOR: '&&',
    SEGMENTS: ['statement*']
  },
  statement: {
    OPERATOR: '||',
    SEGMENTS: ['COMMENT', 'SL_COMMENT', 'importDeclaration', 'nested', 'ruleset', 'mixinDeclaration', 'functionDeclaration', 'variableDeclaration', 'includeDeclaration', 'pageDeclaration', 'ifDeclaration', 'forDeclaration', 'whileDeclaration', 'eachDeclaration']
  },
  params: {
    OPERATOR: '&&',
    SEGMENTS: ['param', 'paramMore*', 'Ellipsis?']
  },
  paramMore: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'param*', 'Ellipsis?']
  },
  param: {
    OPERATOR: '&&',
    SEGMENTS: ['variableName', 'paramOptionalValue?']
  },
  variableName: {
    OPERATOR: '&&',
    SEGMENTS: ['DOLLAR', 'Identifier?']
  },
  paramOptionalValue: {
    OPERATOR: '&&',
    SEGMENTS: ['COLON', 'expression+']
  },
  paramsInParen: {
    OPERATOR: '&&',
    SEGMENTS: ['LPAREN', 'params?', 'RPAREN']
  },
  valuesInParen: {
    OPERATOR: '&&',
    SEGMENTS: ['LPAREN', 'values?', 'RPAREN']
  },
  mixinDeclaration: {
    OPERATOR: '&&',
    SEGMENTS: ['MIXIN', 'Identifier', 'paramsInParen?', 'block']
  },
  pageDeclaration: {
    OPERATOR: '&&',
    SEGMENTS: ['PAGE', 'block']
  },
  includeDeclaration: {
    OPERATOR: '&&',
    SEGMENTS: ['includeDeclarationPrefix', 'Identifier', 'includeDeclarationTermination']
  },
  includeDeclarationPrefix: {
    OPERATOR: '||',
    SEGMENTS: ['INCLUDE', 'MEDIA']
  },
  includeDeclarationTermination: {
    OPERATOR: '||',
    SEGMENTS: ['SEMI', 'valuesInParenSemiBlock']
  },
  valuesInParenSemi: {
    OPERATOR: '&&',
    SEGMENTS: ['valuesInParen', 'SEMI?']
  },
  valuesInParenSemiBlock: {
    OPERATOR: '&&',
    SEGMENTS: ['valuesInParenSemi?', 'block?']
  },
  functionDeclaration: {
    OPERATOR: '&&',
    SEGMENTS: ['FUNCTION', 'Identifier', 'paramsInParen', 'BlockStart', 'functionBody?', 'BlockEnd']
  },
  functionBody: {
    OPERATOR: '&&',
    SEGMENTS: ['functionStatement*', 'functionReturn']
  },
  functionReturn: {
    OPERATOR: '&&',
    SEGMENTS: ['RETURN', 'commandStatement', 'SEMI']
  },
  functionStatement: {
    OPERATOR: '&&',
    SEGMENTS: ['commandStatement', 'semiOrStatement']
  },
  semiOrStatement: {
    OPERATOR: '||',
    SEGMENTS: ['SEMI', 'statement']
  },
  commandStatement: {
    OPERATOR: '&&',
    SEGMENTS: ['expressionOrCommandStatement', 'mathStatement?']
  },
  expressionOrCommandStatement: {
    OPERATOR: '||',
    SEGMENTS: ['expression+', 'commandStatementInParens']
  },
  commandStatementInParens: {
    OPERATOR: '&&',
    SEGMENTS: ['LPAREN', 'commandStatement', 'RPAREN']
  },
  mathCharacter: {
    OPERATOR: '||',
    SEGMENTS: ['TIMES', 'PLUS', 'DIV', 'MINUS', 'PERC']
  },
  mathStatement: {
    OPERATOR: '&&',
    SEGMENTS: ['mathCharacter', 'commandStatement']
  },
  expression: {
    OPERATOR: '||',
    SEGMENTS: ['measurement', 'identifier', 'RGB', 'RGBA', 'Color', 'StringLiteral', 'NULL', 'url', 'variableName', 'functionCall']
  },
  ifDeclaration: {
    OPERATOR: '&&',
    SEGMENTS: ['AT_IF', 'conditions', 'block', 'elseIfStatement*', 'elseStatement?' ]
  },
  elseIfStatement: {
    OPERATOR: '&&',
    SEGMENTS: ['AT_ELSE', 'IF', 'conditions', 'block' ]
  },
  elseStatement: {
    OPERATOR: '&&',
    SEGMENTS: ['AT_ELSE', 'block' ]
  },
  conditions: {
    OPERATOR: '||',
    SEGMENTS: ['conditionsNonNull', 'NULL' ]
  },
  conditionsNonNull: {
    OPERATOR: '&&',
    SEGMENTS: ['conditions', 'combineCompareConditions?' ]
  },
  combineCompareConditions: {
    OPERATOR: '&&',
    SEGMENTS: ['COMBINE_COMPARE', 'conditions' ]
  },
  compareOperators: {
    OPERATOR: '||',
    SEGMENTS: ['EQEQ', 'LT', 'GT', 'NOTEQ']
  },
  conditionsInParen: {
    OPERATOR: '&&',
    SEGMENTS: ['LPAREN', 'conditions', 'RPAREN']
  },
  compareOperatorsConditions: {
    OPERATOR: '&&',
    SEGMENTS: ['compareOperatorsConditions', 'conditions']
  },
  condition: {
    OPERATOR: '||',
    SEGMENTS: ['', 'conditionsInParen']
  },
  commandStatementCompareOperatorsConditions: {
    OPERATOR: '&&',
    SEGMENTS: ['commandStatement', 'compareOperatorsConditions?']
  },
  variableDeclaration: {
    OPERATOR: '&&',
    SEGMENTS: ['variableName', 'COLON', 'values', 'POUND_DEFAULT?', 'SEMI']
  },
  commaVariableName: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'variableName']
  },
  commaIdentifier: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'Identifier']
  },
  commaIdentifierListOrMap: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'identifierListOrMap']
  },
  commaIdentifierValue: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'identifierValue']
  },
  colonValues: {
    OPERATOR: '&&',
    SEGMENTS: ['COLON', 'values']
  },
  commaSelector: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'selector']
  },
  forDeclaration: {
    OPERATOR: '&&',
    SEGMENTS: ['AT_FOR', 'variableName', 'FROM', 'fromNumber', 'THROUGH', 'throughNumber', 'block']
  },
  fromNumber: {
    OPERATOR: '&&',
    SEGMENTS: ['Number']
  },
  throughNumber: {
    OPERATOR: '&&',
    SEGMENTS: ['Number']
  },
  whileDeclaration: {
    OPERATOR: '&&',
    SEGMENTS: ['AT_WHILE', 'conditions', 'block']
  },
  eachDeclaration: {
    OPERATOR: '&&',
    SEGMENTS: ['AT_EACH', 'variableName', 'commaVariableName*', 'IN', 'eachValueList', 'block']
  },
  eachValueList: {
    OPERATOR: '||',
    SEGMENTS: ['eachValueListIdentifier', 'eachValueListIdentifierList']
  },
  eachValueListIdentifier: {
    OPERATOR: '&&',
    SEGMENTS: ['Identifier', 'commaIdentifier*']
  },
  eachValueListIdentifierList: {
    OPERATOR: '&&',
    SEGMENTS: ['identifierListOrMap', 'commaIdentifierListOrMap*']
  },
  identifierListOrMap: {
    OPERATOR: '&&',
    SEGMENTS: ['LPAREN', 'identifierValue', 'commaIdentifierValue*', 'RPAREN']
  },
  identifierValue: {
    OPERATOR: '&&',
    SEGMENTS: ['identifier', 'colonValues?']
  },
  importDeclaration: {
    OPERATOR: '&&',
    SEGMENTS: ['IMPORT', 'referenceUrl', 'mediaTypes?', 'SEMI']
  },
  referenceUrl: {
    OPERATOR: '||',
    SEGMENTS: ['referenceUrlStringLiteral,', 'referenceUrlUrl']
  },
  referenceUrlStringLiteral: {
    OPERATOR: '&&',
    SEGMENTS: ['StringLiteral']
  },
  referenceUrlUrl: {
    OPERATOR: '&&',
    SEGMENTS: ['UrlStart', 'Url', 'UrlEnd']
  },
  mediaTypes: {
    OPERATOR: '&&',
    SEGMENTS: ['Identifier', 'commaIdentifier*']
  },
  nested: {
    OPERATOR: '&&',
    SEGMENTS: ['AT', 'nest', 'selectors', 'BlockStart', 'stylesheet', 'BlockEnd']
  },
  nest: {
    OPERATOR: '&&',
    SEGMENTS: ['identifierOrAnd', 'Identifier*', 'pseudo*']
  },
  identifierOrAnd: {
    OPERATOR: '||',
    SEGMENTS: ['Identifier', 'AND']
  },
  ruleset: {
    OPERATOR: '&&',
    SEGMENTS: ['selectors', 'block']
  },
  block: {
    OPERATOR: '&&',
    SEGMENTS: ['BlockStart', 'blockProperty*', 'property?', 'BlockEnd']
  },
  blockProperty: {
    OPERATOR: '||',
    SEGMENTS: ['blockPropertySemi', 'statement']
  },
  blockPropertySemi: {
    OPERATOR: '&&',
    SEGMENTS: ['property', 'IMPORTANT?', 'SEMI']
  },
  selectors: {
    OPERATOR: '&&',
    SEGMENTS: ['selector', 'commaSelector*']
  },
  selector: {
    OPERATOR: '&&',
    SEGMENTS: ['element+', 'selectorPrefixElement*', 'attrib*', 'pseudo?']
  },
  selectorPrefixElement: {
    OPERATOR: '&&',
    SEGMENTS: ['selectorPrefix', 'element']
  },
  selectorPrefix: {
    OPERATOR: '||',
    SEGMENTS: ['GT', 'PLUS', 'TIL']
  },
  element: {
    OPERATOR: '||',
    SEGMENTS: ['identifier', 'hashIdentifier', 'dotIdentifier', 'AND', 'TIMES']
  },
  hashIdentifier: {
    OPERATOR: '&&',
    SEGMENTS: ['HASH', 'identifier']
  },
  dotIdentifier: {
    OPERATOR: '&&',
    SEGMENTS: ['DOT', 'identifier']
  },
  pseudo: {
    OPERATOR: '||',
    SEGMENTS: ['pseudoIdentifier', 'pseudoFunctionCall']
  },
  pseudoIdentifier: {
    OPERATOR: '&&',
    SEGMENTS: ['colonOrColonColon', 'Identifier']
  },
  pseudoFunctionCall: {
    OPERATOR: '&&',
    SEGMENTS: ['colonOrColonColon', 'functionCall']
  },
  colonOrColonColon: {
    OPERATOR: '||',
    SEGMENTS: ['COLON', 'COLONCOLON']
  },
  attrib: {
    OPERATOR: '&&',
    SEGMENTS: ['LBRACK', 'Identifier', 'attribRelateStringLiteralOrIdentifier?', 'RBRACK']
  },
  stringLiteralOrIdentifier: {
    OPERATOR: '||',
    SEGMENTS: ['StringLiteral', 'Identifier']
  },
  attribRelateStringLiteralOrIdentifier: {
    OPERATOR: '&&',
    SEGMENTS: ['attribRelate', 'stringLiteralOrIdentifier']
  },
  attribRelate: {
    OPERATOR: '||',
    SEGMENTS: ['EQ', 'PIPE_EQ', 'TILD_EQ']
  },
  identifier: {
    OPERATOR: '||',
    SEGMENTS: ['identifierIdentifierPart', 'identifierIdentifierBlock']
  },
  identifierIdentifierPart: {
    OPERATOR: '&&',
    SEGMENTS: ['Identifier', 'identifierPart*']
  },
  identifierIdentifierBlock: {
    OPERATOR: '&&',
    SEGMENTS: ['InterpolationStart', 'identifierVariableName', 'BlockEnd', 'identifierPart*']
  },
  identifierPart: {
    OPERATOR: '||',
    SEGMENTS: ['identifierPartBlock', 'Identifier']
  },
  identifierPartBlock: {
    OPERATOR: '&&',
    SEGMENTS: ['InterpolationStart', 'identifierVariableName', 'BlockEnd']
  },
  identifierVariableName: {
    OPERATOR: '&&',
    SEGMENTS: ['DOLLAR', 'Identifier']
  },
  property: {
    OPERATOR: '&&',
    SEGMENTS: ['identifier', 'colonValues']
  },
  values: {
    OPERATOR: '&&',
    SEGMENTS: ['commandStatement', 'commaCommandStatement*']
  },
  commaCommandStatement: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'commandStatement']
  },
  url: {
    OPERATOR: '&&',
    SEGMENTS: ['UrlStart', 'Url', 'UrlEnd']
  },
  measurement: {
    OPERATOR: '&&',
    SEGMENTS: ['Number', 'Unit?']
  },
  functionCall: {
    OPERATOR: '&&',
    SEGMENTS: ['Identifier', 'valuesInParen']
  }
};

// ******************************
// Exports:
// ******************************

[GRAMMAR_SCSS_LEX].forEach((objectToExpose) => {
  Object.keys(objectToExpose).forEach((key) => {
    module.exports[key] = objectToExpose[key];
  })
})

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