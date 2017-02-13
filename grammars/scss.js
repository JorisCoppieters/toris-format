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
    SEGMENTS: ['COMMENT', 'SL_COMMENT', 'importDeclaration', 'includeDeclaration', 'mediaDeclaration', 'keyframesDeclaration', 'pageDeclaration', 'nested', 'ruleset', 'mixinDeclaration', 'functionDeclaration', 'variableDeclaration', 'ifDeclaration', 'forDeclaration', 'whileDeclaration', 'eachDeclaration']
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
    SEGMENTS: ['COLON', 'expressions']
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
    SEGMENTS: ['INCLUDE', 'Identifier', 'includeDeclarationTermination']
  },
  includeDeclarationTermination: {
    OPERATOR: '||',
    SEGMENTS: ['SEMI+', 'valuesInParenSemiBlock']
  },
  keyframesDeclaration: {
    OPERATOR: '&&',
    SEGMENTS: ['KEYFRAMES', 'Identifier', 'BlockStart', 'keyframesEntry*', 'BlockEnd']
  },
  keyframesEntry: {
    OPERATOR: '&&',
    SEGMENTS: ['measurement', 'BlockStart', 'keyframesEntryProperty', 'SEMI?', 'keyframesEntryBlockEnd']
  },
  keyframesEntryProperty: {
    OPERATOR: '&&',
    SEGMENTS: ['identifier', 'colonValues']
  },
  keyframesEntryBlockEnd: {
    OPERATOR: '&&',
    SEGMENTS: ['BlockEnd']
  },
  mediaDeclaration: {
    OPERATOR: '&&',
    SEGMENTS: ['MEDIA', 'mediaDeclarationParts', 'mediaDeclarationTermination']
  },
  mediaDeclarationParts: {
    OPERATOR: '&&',
    SEGMENTS: ['mediaDeclarationPart+', 'commaMediaDeclarationPart*']
  },
  commaMediaDeclarationPart: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'mediaDeclarationPart*']
  },
  mediaDeclarationPart: {
    OPERATOR: '||',
    SEGMENTS: ['propertyInParen', 'identifier']
  },
  mediaDeclarationTermination: {
    OPERATOR: '||',
    SEGMENTS: ['SEMI+', 'valuesInParenSemiBlock']
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
    SEGMENTS: ['RETURN', 'commandStatement', 'SEMI+']
  },
  functionStatement: {
    OPERATOR: '&&',
    SEGMENTS: ['commandStatement', 'semiOrStatement']
  },
  semiOrStatement: {
    OPERATOR: '||',
    SEGMENTS: ['SEMI+', 'statement']
  },
  commandStatement: {
    OPERATOR: '&&',
    SEGMENTS: ['expressionOrCommandStatement', 'mathStatement?']
  },
  expressionOrCommandStatement: {
    OPERATOR: '||',
    SEGMENTS: ['expressions', 'commaCommandStatement', 'commandStatementInParens']
  },
  expressions: {
    OPERATOR: '&&',
    SEGMENTS: ['expression+', 'commaExpression*']
  },
  expressionsInParens: {
    OPERATOR: '&&',
    SEGMENTS: ['LPAREN', 'expressions', 'RPAREN']
  },
  commaExpression: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'expression+']
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
    SEGMENTS: ['expressionsInParens', 'mapExpression', 'functionCall', 'url', 'mathCharacter', 'measurement', 'Number', 'identifier', 'RGB', 'Color', 'StringLiteral', 'NULL', 'variableName']
  },
  mapExpression: {
    OPERATOR: '&&',
    SEGMENTS: ['LPAREN', 'mapEntry', 'commaMapEntry*', 'extraComma?', 'RPAREN']
  },
  mapEntry: {
    OPERATOR: '&&',
    SEGMENTS: ['Number', 'COLON', 'expression']
  },
  extraComma: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA']
  },
  commaMapEntry: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'mapEntry']
  },
  RGB: {
    OPERATOR: '&&',
    SEGMENTS: ['LPAREN', 'RGB_VAL', 'COMMA_RGB_VAL*', 'RPAREN']
  },
  COMMA_RGB_VAL: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'RGB_VAL']
  },
  RGB_VAL: {
    OPERATOR: '||',
    SEGMENTS: ['RGB_NUMERIC_VAL', 'variableName']
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
    SEGMENTS: ['variableName', 'COLON', 'values', 'POUND_DEFAULT?', 'SEMI+']
  },
  commaVariableName: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'variableName']
  },
  commaIdentifier: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'Identifier']
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
    SEGMENTS: ['AT_FOR', 'variableName', 'FROM', 'fromNumber', 'THROUGH', 'through', 'block']
  },
  fromNumber: {
    OPERATOR: '&&',
    SEGMENTS: ['Number']
  },
  through: {
    OPERATOR: '||',
    SEGMENTS: ['Number', 'functionCall']
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
    OPERATOR: '&&',
    SEGMENTS: ['eachValueListEntry', 'commaEachValueListEntry*']
  },
  eachValueListEntry: {
    OPERATOR: '||',
    SEGMENTS: ['eachValueListInParen', 'Identifier', 'identifierValue', 'variableName']
  },
  commaEachValueListEntry: {
    OPERATOR: '&&',
    SEGMENTS: ['COMMA', 'eachValueListEntry']
  },
  eachValueListInParen: {
    OPERATOR: '&&',
    SEGMENTS: ['LPAREN', 'eachValueList', 'RPAREN']
  },
  identifierValue: {
    OPERATOR: '&&',
    SEGMENTS: ['identifier', 'colonValues?']
  },
  importDeclaration: {
    OPERATOR: '&&',
    SEGMENTS: ['IMPORT', 'referenceUrl', 'mediaTypes?', 'SEMI+']
  },
  referenceUrl: {
    OPERATOR: '||',
    SEGMENTS: ['referenceUrlStringLiteral', 'referenceUrlUrl']
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
    SEGMENTS: ['AT', 'AND?', 'Identifier+', 'pseudo*', 'selectors', 'BlockStart', 'stylesheet', 'BlockEnd']
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
    SEGMENTS: ['property', 'IMPORTANT?', 'SEMI+']
  },
  selectors: {
    OPERATOR: '&&',
    SEGMENTS: ['selector', 'commaSelector*']
  },
  selector: {
    OPERATOR: '&&',
    SEGMENTS: ['selectorStart*', 'attrib*', 'pseudo*']
  },
  selectorStart: {
    OPERATOR: '||',
    SEGMENTS: ['element', 'selectorPrefixElement']
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
    SEGMENTS: ['identifier', 'hashIdentifier', 'dotIdentifier', 'AND', 'TIMES', 'pseudo']
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
    SEGMENTS: ['pseudoValueInParens', 'pseudoIdentifier', 'pseudoFunctionCall']
  },
  pseudoValueInParens: {
    OPERATOR: '&&',
    SEGMENTS: ['LPAREN', 'pseudoValue', 'RPAREN']
  },
  pseudoValue: {
    OPERATOR: '||',
    SEGMENTS: ['pseudo', 'attrib', 'Number', 'hashBlock']
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
    SEGMENTS: ['COLONCOLON', 'COLON']
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
    OPERATOR: '&&',
    SEGMENTS: ['hashBlockOrIdentifier', 'hashBlockOrIdentifierPart*']
  },
  hashBlockOrIdentifierPart: {
    OPERATOR: '&&',
    SEGMENTS: ['DASH?', 'hashBlockOrIdentifier']
  },
  hashBlockOrIdentifier: {
    OPERATOR: '||',
    SEGMENTS: ['hashBlock', 'Identifier']
  },
  hashBlock: {
    OPERATOR: '&&',
    SEGMENTS: ['HASH', 'BlockStart', 'hashBlockExpression', 'BlockEnd']
  },
  hashBlockExpression: {
    OPERATOR: '&&',
    SEGMENTS: ['expression+']
  },
  identifierVariableName: {
    OPERATOR: '&&',
    SEGMENTS: ['DOLLAR', 'Identifier']
  },
  property: {
    OPERATOR: '&&',
    SEGMENTS: ['identifier', 'colonValues']
  },
  propertyInParen: {
    OPERATOR: '&&',
    SEGMENTS: ['LPAREN', 'property', 'RPAREN']
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
    SEGMENTS: ['Number', 'Unit']
  },
  functionCall: {
    OPERATOR: '&&',
    SEGMENTS: ['Identifier', 'commandStatementInParens']
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