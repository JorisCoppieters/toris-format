'use strict'; // JS: ES5

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

var grammar = require('./_core');

// ******************************
// Exposing Functions:
// ******************************

// ******************************
// Definition:
// ******************************

module.exports = grammar.export_grammar({
  START: { OPERATOR: '||', SEGMENTS: ['stylesheet'] },
  stylesheet: { OPERATOR: '&&', SEGMENTS: ['statement*'] },
  statement: { OPERATOR: '||', SEGMENTS: ['DECLARATION_KEYFRAMES'] },

  // Key Frames
  DECLARATION_KEYFRAMES: { OPERATOR: '&&', SEGMENTS: ['VAL__KEYFRAMES', 'TYPE_KEYFRAMES_IDENTIFIER', 'BlockStart', '_KEYFRAMES_ENTRY*', 'TYPE_KEYFRAMES_END'] },
  TYPE_KEYFRAMES_IDENTIFIER: { OPERATOR: '&&', SEGMENTS: ['Identifier'] },
  _KEYFRAMES_ENTRY: { OPERATOR: '&&', SEGMENTS: ['TYPE_KEYFRAMES_ENTRY_KEY', 'BlockStart', 'TYPE_KEYFRAMES_ENTRY_PROPERTY', 'COLON', 'commandStatments', 'VAL__SEMI?', 'TYPE_KEYFRAMES_ENTRY_END'] },
  TYPE_KEYFRAMES_ENTRY_KEY: { OPERATOR: '||', SEGMENTS: ['VAL__MEASUREMENT', 'VAL__NUMBER'] },
  TYPE_KEYFRAMES_ENTRY_PROPERTY: { OPERATOR: '&&', SEGMENTS: ['commandStatments'] },
  TYPE_KEYFRAMES_ENTRY_END: { OPERATOR: '&&', SEGMENTS: ['BlockEnd'] },
  TYPE_KEYFRAMES_END: { OPERATOR: '&&', SEGMENTS: ['BlockEnd'] },

  // Variables
  // TYPE_VARIABLE_VALUE: { OPERATOR: '||', SEGMENTS: ['TYPE_VARIABLE_NAME'] },
  // TYPE_VARIABLE_NAME: { OPERATOR: '&&', SEGMENTS: ['VAL__DOLLAR', '_VARIABLE_NAME'] },
  // _VARIABLE_NAME: { OPERATOR: '&&', SEGMENTS: ['VAL__IDENTIFIER'] },

  // Condition
  // TYPE_CONDITION: { OPERATOR: '||', SEGMENTS: ['_ODD_EXPRESSION_CONDITION', '_EXPRESSION_CONDITION'] },
  // _ODD_EXPRESSION_CONDITION: { OPERATOR: '&&', SEGMENTS: ['VAL__EXCLAM', '_EXPRESSION'] },

  // _EXPRESSION_CONDITION: { OPERATOR: '&&', SEGMENTS: ['_EXPRESSION', '_COMPARE_EXPRESSION?'] },
  // _COMPARE_EXPRESSION: { OPERATOR: '&&', SEGMENTS: ['_COMPARE_OPERATOR', '_EXPRESSION'] },

  // _EXPRESSION: { OPERATOR: '&&', SEGMENTS: ['_MATH_OPERATOR?', '_TERM', '_OPERATOR_TERM*'] },
  // _OPERATOR_TERM: { OPERATOR: '&&', SEGMENTS: ['_MATH_OPERATOR', '_TERM'] },

  // _TERM: { OPERATOR: '&&', SEGMENTS: ['_FACTOR', '_COMBINE_FACTOR*'] },
  // _COMBINE_FACTOR: { OPERATOR: '&&', SEGMENTS: ['_COMBINE_OPERATOR', '_FACTOR'] },

  // _FACTOR: { OPERATOR: '||', SEGMENTS: ['TYPE_VARIABLE_VALUE', '_EXPRESSION_IN_PAREN'] },
  // _EXPRESSION_IN_PAREN: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', '_EXPRESSION', 'VAL__PAREN_R'] },

  // _COMPARE_OPERATOR: { OPERATOR: '||', SEGMENTS: ['VAL__EQEQ', 'VAL__LTEQ', 'VAL__LT', 'VAL__GTEQ', 'VAL__GT', 'VAL__NOTEQ'] },
  // _COMBINE_OPERATOR: { OPERATOR: '||', SEGMENTS: ['VAL__AND', 'VAL__OR'] },
  // _MATH_OPERATOR: { OPERATOR: '||', SEGMENTS: ['VAL__PLUS', 'VAL__MINUS', 'VAL__TIMES', 'VAL__DIVIDE'] },

  // Other
  // TYPE__BOOLEAN: { OPERATOR: '||', SEGMENTS: ['VAL__TRUE', 'VAL__FALSE'] },
  // TYPE__STRING: { OPERATOR: '||', SEGMENTS: ['VAL__STRING_DOUBLE_QUOTED', 'VAL__STRING_SINGLE_QUOTED'] },

  // Values
  VAL__KEYFRAMES: { OPERATOR: '==', VALUE: '@keyframes' },
  VAL__MEASUREMENT: { OPERATOR: '==', VALUE: '\\-?(?:[0-9]*\\.)?[0-9]+(?:%|px|rem|cm|mm|in|pt|pc|em|ex|deg|rad|grad|ms|s|hz|khz)' },
  VAL__NUMBER: { OPERATOR: '==', VALUE: '\\-?(?:[0-9]*\\.)?[0-9]+' },
  VAL__IDENTIFIER: { OPERATOR: '==', VALUE: '\\-*[a-zA-Z\\u0100-\\ufffe_][a-zA-Z\\u0100-\\ufffe0-9_-]*' },
  VAL__STRING_DOUBLE_QUOTED: { OPERATOR: '==', VALUE: '"[^"\\n\\r]*"' },
  VAL__STRING_SINGLE_QUOTED: { OPERATOR: '==', VALUE: '\'[^\'\\n\\r]*\'' },





  // MEASUREMENT: { OPERATOR: '&&', SEGMENTS: ['VAL__MEASUREMENT'] },

  // statement: { OPERATOR: '||', SEGMENTS: ['COMMENT', 'SL_COMMENT', 'importDeclaration', 'includeDeclaration', 'fontFaceDeclaration', 'mediaDeclaration', 'DECLARATION_KEYFRAMES', 'pageDeclaration', 'extendDeclaration', 'ruleset', 'mixinDeclaration', 'functionDeclaration', 'variableDeclaration', 'ifDeclaration', 'forDeclaration', 'whileDeclaration', 'eachDeclaration', 'nested'] },
  // params: { OPERATOR: '&&', SEGMENTS: ['param', 'paramMore*', 'Ellipsis?'] },
  // paramMore: { OPERATOR: '&&', SEGMENTS: ['COMMA', 'param*', 'Ellipsis?'] },
  // param: { OPERATOR: '&&', SEGMENTS: ['variableName', 'paramOptionalValue?'] },
  // variableName: { OPERATOR: '&&', SEGMENTS: ['VAL__DOLLAR', 'Identifier?'] },
  // paramOptionalValue: { OPERATOR: '&&', SEGMENTS: ['COLON', 'expression'] },
  // paramsInParen: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'params?', 'VAL__PAREN_R'] },
  // valuesInParen: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'values?', 'VAL__PAREN_R'] },
  // mixinDeclaration: { OPERATOR: '&&', SEGMENTS: ['MIXIN', 'Identifier', 'paramsInParen?', 'block'] },
  // pageDeclaration: { OPERATOR: '&&', SEGMENTS: ['PAGE', 'block'] },
  // extendDeclaration: { OPERATOR: '&&', SEGMENTS: ['EXTEND', 'percIdentifier', 'VAL__SEMI?'] },
  // includeDeclaration: { OPERATOR: '&&', SEGMENTS: ['INCLUDE', 'Identifier', 'includeDeclarationTermination'] },
  // includeDeclarationTermination: { OPERATOR: '||', SEGMENTS: ['VAL__SEMI+', 'valuesInParenSemiBlock'] },
  // fontFaceDeclaration: { OPERATOR: '&&', SEGMENTS: ['FONT_FACE', 'fontFaceDeclarationStart', 'fontFaceDeclarationValues', 'fontFaceDeclarationEnd'] },
  // fontFaceDeclarationStart: { OPERATOR: '&&', SEGMENTS: ['BlockStart'] },
  // fontFaceDeclarationValues: { OPERATOR: '&&', SEGMENTS: ['blockProperty*'] },
  // fontFaceDeclarationEnd: { OPERATOR: '&&', SEGMENTS: ['BlockEnd'] },
  // mediaDeclaration: { OPERATOR: '&&', SEGMENTS: ['MEDIA', 'mediaDeclarationParts', 'mediaDeclarationTermination'] },
  // mediaDeclarationParts: { OPERATOR: '&&', SEGMENTS: ['mediaDeclarationPart+', 'commaMediaDeclarationPart*'] },
  // commaMediaDeclarationPart: { OPERATOR: '&&', SEGMENTS: ['COMMA', 'mediaDeclarationPart*'] },
  // mediaDeclarationPart: { OPERATOR: '||', SEGMENTS: ['propertyInParen', 'identifier'] },
  // mediaDeclarationTermination: { OPERATOR: '||', SEGMENTS: ['VAL__SEMI+', 'valuesInParenSemiBlock'] },
  // valuesInParenSemi: { OPERATOR: '&&', SEGMENTS: ['valuesInParen', 'VAL__SEMI?'] },
  // valuesInParenSemiBlock: { OPERATOR: '&&', SEGMENTS: ['valuesInParenSemi?', 'block?'] },
  // functionDeclaration: { OPERATOR: '&&', SEGMENTS: ['FUNCTION', 'Identifier', 'paramsInParen', 'BlockStart', 'functionBody?', 'BlockEnd'] },
  // functionBody: { OPERATOR: '&&', SEGMENTS: ['functionStatement*', 'functionReturn'] },
  // functionReturn: { OPERATOR: '&&', SEGMENTS: ['RETURN', 'commandStatement', 'VAL__SEMI+'] },
  // functionStatement: { OPERATOR: '&&', SEGMENTS: ['commandStatement', 'semiOrStatement'] },
  // semiOrStatement: { OPERATOR: '||', SEGMENTS: ['VAL__SEMI+', 'statement'] },


  // commandStatments: { OPERATOR: '&&', SEGMENTS: ['commandStatement', 'commaCommandStatement*'] },
  // commaCommandStatement: { OPERATOR: '&&', SEGMENTS: ['COMMA', 'commandStatement'] },

  // commandStatement: { OPERATOR: '&&', SEGMENTS: ['commandStatementExpression', 'mathCharacterCommandStatementExpression*'] },
  // mathCharacterCommandStatementExpression: { OPERATOR: '&&', SEGMENTS: ['mathCharacter', 'commandStatementExpression'] },




  // commandStatementExpression: { OPERATOR: '&&', SEGMENTS: ['VAL__EMPTY'] },




  // // expressions: { OPERATOR: '&&', SEGMENTS: ['expression+', 'commaExpression*', 'extraComma?'] },
  // // expressionsInParens: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'expressionsInParenContents', 'VAL__PAREN_R'] },
  // // commaExpression: { OPERATOR: '&&', SEGMENTS: ['COMMA', 'expression+'] },

  // // expressionsInParenContents: { OPERATOR: '||', SEGMENTS: ['mapExpression', 'expressions'] },

  // mathCharacter: { OPERATOR: '||', SEGMENTS: ['VAL__TIMES', 'VAL__PLUS', 'VAL__DIVIDE', 'VAL__MINUS', 'VAL__PERC'] },
  // // expression: { OPERATOR: '||', SEGMENTS: ['url', 'functionCall', 'expressionsInParens', 'mapExpression', 'SL_COMMENT', 'COMMENT', 'mathCharacter', 'MEASUREMENT', 'VAL__NUMBER', 'identifier', 'RGB', 'Color', 'StringLiteral', 'NULL', 'variableName'] },
  // // mapExpression: { OPERATOR: '&&', SEGMENTS: ['mapEntry', 'commaMapEntry*', 'extraComma?', 'comment?', 'mapExpressionEnd'] },
  // // mapExpressionEnd: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_R'] },
  // // mapEntry: { OPERATOR: '&&', SEGMENTS: ['comment?', 'mapEntryKeyValue', 'comment?'] },
  // // mapEntryKeyValue: { OPERATOR: '&&', SEGMENTS: ['mapEntryKey', 'COLON', 'mapEntryValues'] },
  // // mapEntryKey: { OPERATOR: '||', SEGMENTS: ['VAL__NUMBER', 'StringLiteral', 'Identifier'] },
  // // mapEntryValues: { OPERATOR: '&&', SEGMENTS: ['mathCharacter?', 'expression'] },
  // // extraComma: { OPERATOR: '&&', SEGMENTS: ['COMMA'] },
  // // commaMapEntry: { OPERATOR: '&&', SEGMENTS: ['COMMA', 'mapEntry'] },
  // // RGB: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'RGB_VAL', 'COMMA_RGB_VAL*', 'VAL__PAREN_R'] },
  // // COMMA_RGB_VAL: { OPERATOR: '&&', SEGMENTS: ['COMMA', 'RGB_VAL'] },
  // // RGB_VAL: { OPERATOR: '||', SEGMENTS: ['RGB_NUMERIC_VAL', 'variableName'] },
  // ifDeclaration: { OPERATOR: '&&', SEGMENTS: ['AT_IF', 'TYPE_CONDITIONS', 'block', 'elseIfStatement*', 'elseStatement?'] },
  // elseIfStatement: { OPERATOR: '&&', SEGMENTS: ['AT_ELSE', 'IF', 'TYPE_CONDITIONS', 'block'] },
  // elseStatement: { OPERATOR: '&&', SEGMENTS: ['AT_ELSE', 'block'] },


  // functionCall: { OPERATOR: '&&', SEGMENTS: ['Identifier', 'functionCallStart', 'functionCallArguments', 'functionCallEnd'] },
  // functionCallStart: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L'] },
  // functionCallEnd: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_R'] },
  // functionCallArguments: { OPERATOR: '&&', SEGMENTS: ['commandStatement'] },


  // variableDeclaration: { OPERATOR: '&&', SEGMENTS: ['variableDeclarationKey', 'COLON', 'variableDeclarationValues', 'POUND_DEFAULT?', 'VAL__SEMI+'] },
  // variableDeclarationKey: { OPERATOR: '||', SEGMENTS: ['StringLiteral', 'variableName'] },
  // variableDeclarationValues: { OPERATOR: '&&', SEGMENTS: ['commandStatments'] },
  // commaVariableName: { OPERATOR: '&&', SEGMENTS: ['COMMA', 'variableName'] },
  // commaIdentifier: { OPERATOR: '&&', SEGMENTS: ['COMMA', 'Identifier'] },
  // colonValues: { OPERATOR: '&&', SEGMENTS: ['COLON', 'commandStatments'] },
  // forDeclaration: { OPERATOR: '&&', SEGMENTS: ['AT_FOR', 'variableName', 'FROM', 'fromNumber', 'THROUGH', 'through', 'block'] },
  // fromNumber: { OPERATOR: '&&', SEGMENTS: ['VAL__NUMBER'] },
  // through: { OPERATOR: '||', SEGMENTS: ['VAL__NUMBER', 'functionCall', 'variableName'] },
  // whileDeclaration: { OPERATOR: '&&', SEGMENTS: ['AT_WHILE', 'TYPE_CONDITIONS', 'block'] },
  // eachDeclaration: { OPERATOR: '&&', SEGMENTS: ['AT_EACH', 'variableName', 'commaVariableName*', 'IN', 'eachValueList', 'block'] },
  // // eachValueList: { OPERATOR: '&&', SEGMENTS: ['eachValueListEntry', 'commaEachValueListEntry*'] },
  // // eachValueListEntry: { OPERATOR: '||', SEGMENTS: ['eachValueListInParen', 'functionCall', 'Identifier', 'identifierValue', 'variableName'] },
  // // commaEachValueListEntry: { OPERATOR: '&&', SEGMENTS: ['COMMA', 'eachValueListEntry'] },
  // // eachValueListInParen: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'eachValueList', 'VAL__PAREN_R'] },
  // // identifierValue: { OPERATOR: '&&', SEGMENTS: ['identifier', 'colonValues?'] },
  // importDeclaration: { OPERATOR: '&&', SEGMENTS: ['IMPORT', 'referenceUrl', 'commaReferenceUrl*', 'mediaTypes?', 'VAL__SEMI+'] },
  // referenceUrl: { OPERATOR: '||', SEGMENTS: ['StringLiteral', 'url'] },
  // commaReferenceUrl: { OPERATOR: '&&', SEGMENTS: ['COMMA', 'referenceUrl'] },
  // mediaTypes: { OPERATOR: '&&', SEGMENTS: ['Identifier', 'commaIdentifier*'] },
  // nested: { OPERATOR: '&&', SEGMENTS: ['VAL__AT', 'VAL__AMP?', 'Identifier+', 'pseudo*', 'selectors', 'BlockStart', 'stylesheet', 'BlockEnd'] },
  // ruleset: { OPERATOR: '&&', SEGMENTS: ['selectors', 'block'] },
  // block: { OPERATOR: '&&', SEGMENTS: ['VAL__EMPTY'] },
  // // block: { OPERATOR: '&&', SEGMENTS: ['BlockStart', 'blockProperty*', 'blockPropertyNoSemi?', 'BlockEnd'] },
  // // blockProperty: { OPERATOR: '||', SEGMENTS: ['blockPropertySemi', 'statement'] },
  // // blockPropertySemi: { OPERATOR: '&&', SEGMENTS: ['property', 'IMPORTANT?', 'VAL__SEMI+'] },
  // // blockPropertyNoSemi: { OPERATOR: '&&', SEGMENTS: ['property', 'IMPORTANT?', 'NOSEMI'] },
  // // NOSEMI: { OPERATOR: '&&', SEGMENTS: ['VAL__EMPTY'] },
  // selectors: { OPERATOR: '&&', SEGMENTS: ['selectorWithCommentAfter', 'commaSelectorWithComment*'] },
  // commaSelectorWithComment: { OPERATOR: '&&', SEGMENTS: ['COMMA', 'selectorWithCommentBeforeAndAfter'] },
  // selectorWithCommentAfter: { OPERATOR: '&&', SEGMENTS: ['selector', 'comment?'] },
  // selectorWithCommentBeforeAndAfter: { OPERATOR: '&&', SEGMENTS: ['comment?', 'selector', 'comment?'] },
  // comment: { OPERATOR: '||', SEGMENTS: ['SL_COMMENT', 'COMMENT'] },
  // selector: { OPERATOR: '&&', SEGMENTS: ['selectorStart*', 'attrib*', 'selectorPrefix?', 'pseudo*'] },
  // selectorStart: { OPERATOR: '||', SEGMENTS: ['element', 'selectorPrefixElement'] },
  // selectorPrefixElement: { OPERATOR: '&&', SEGMENTS: ['selectorPrefix', 'element'] },
  // selectorPrefix: { OPERATOR: '||', SEGMENTS: ['VAL__GT', 'VAL__PLUS', 'VAL__TIL'] },
  // element: { OPERATOR: '||', SEGMENTS: ['identifier', 'dotIdentifier', 'percIdentifier', 'VAL__AMP', 'VAL__TIMES', 'pseudo', 'elementInBrackets'] },
  // elementInBrackets: { OPERATOR: '&&', SEGMENTS: ['VAL__SQBRAC_L', 'element', 'VAL__SQBRAC_R'] },
  // // hashIdentifier: { OPERATOR: '&&', SEGMENTS: ['VAL__HASH', 'identifier'] },
  // dotIdentifier: { OPERATOR: '&&', SEGMENTS: ['VAL__DOT', 'identifier'] },
  // percIdentifier: { OPERATOR: '&&', SEGMENTS: ['VAL__PERC', 'identifier'] },
  // pseudo: { OPERATOR: '||', SEGMENTS: ['pseudoValueInParens', 'pseudoIdentifier', 'pseudoFunctionCall'] },
  // pseudoValueInParens: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'pseudoValue', 'VAL__PAREN_R'] },
  // pseudoValue: { OPERATOR: '||', SEGMENTS: ['pseudo', 'attrib', 'VAL__NUMBER', 'hashBlock', 'selector'] },
  // pseudoIdentifier: { OPERATOR: '&&', SEGMENTS: ['colonOrColonColon', 'Identifier'] },
  // pseudoFunctionCall: { OPERATOR: '&&', SEGMENTS: ['colonOrColonColon', 'functionCall'] },
  // colonOrColonColon: { OPERATOR: '||', SEGMENTS: ['COLONCOLON', 'COLON'] },
  // attrib: { OPERATOR: '&&', SEGMENTS: ['VAL__SQBRAC_L', 'Identifier', 'attribRelateStringLiteralOrIdentifier?', 'VAL__SQBRAC_R'] },
  // stringLiteralOrIdentifier: { OPERATOR: '||', SEGMENTS: ['StringLiteral', 'Identifier'] },
  // attribRelateStringLiteralOrIdentifier: { OPERATOR: '&&', SEGMENTS: ['attribRelate', 'stringLiteralOrIdentifier'] },
  // attribRelate: { OPERATOR: '||', SEGMENTS: ['VAL__EQ', 'PIPE_EQ', 'TILD_EQ', 'STAR_EQ'] },
  // identifier: { OPERATOR: '&&', SEGMENTS: ['hashBlockOrIdentifier', 'hashBlockOrIdentifierPart*'] },
  // hashBlockOrIdentifierPart: { OPERATOR: '&&', SEGMENTS: ['VAL__DASH?', 'hashBlockOrIdentifier'] },
  // hashBlockOrIdentifier: { OPERATOR: '||', SEGMENTS: ['hashBlock', 'Identifier'] },
  // hashBlock: { OPERATOR: '&&', SEGMENTS: ['VAL__HASH', 'hashBlockStart', 'hashBlockExpression', 'hashBlockEnd'] },
  // hashBlockExpression: { OPERATOR: '&&', SEGMENTS: ['expression+'] },
  // hashBlockStart: { OPERATOR: '&&', SEGMENTS: ['BlockStart'] },
  // hashBlockEnd: { OPERATOR: '&&', SEGMENTS: ['BlockEnd'] },
  // property: { OPERATOR: '&&', SEGMENTS: ['identifier', 'colonValues'] },
  // propertyInParen: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'property', 'VAL__PAREN_R'] },
  // url: { OPERATOR: '&&', SEGMENTS: ['UrlStart', 'Url', 'UrlEnd'] },


  // Lexer:
  // AND_LITERAL: { OPERATOR: '==', VALUE: '(?:AND|and)' },
  // AT_EACH: { OPERATOR: '==', VALUE: '@each' },
  // AT_ELSE: { OPERATOR: '==', VALUE: '@else' },
  // AT_FOR: { OPERATOR: '==', VALUE: '@for' },
  // AT_IF: { OPERATOR: '==', VALUE: '@if' },
  // AT_WHILE: { OPERATOR: '==', VALUE: '@while' },
  // BlockEnd: { OPERATOR: '==', VALUE: '\\}' },
  // BlockStart: { OPERATOR: '==', VALUE: '\\{' },
  // COLON: { OPERATOR: '==', VALUE: ':' },
  // COLONCOLON: { OPERATOR: '==', VALUE: '::' },
  // Color: { OPERATOR: '==', VALUE: '#[0-9a-fA-F]+' },
  // COMBINE_COMPARE_AND: { OPERATOR: '==', VALUE: '[&][&]' },
  // COMBINE_COMPARE_OR: { OPERATOR: '==', VALUE: '[|][|]' },
  // COMMA: { OPERATOR: '==', VALUE: ',' },
  // COMMENT: { OPERATOR: '==', VALUE: '\/\\*[\\s\\S]*?\\*\/' },
  // DASH: { OPERATOR: '==', VALUE: '\\-' },
  // DIV: { OPERATOR: '==', VALUE: '\\/' },
  // DOLLAR: { OPERATOR: '==', VALUE: '\\$' },
  // DOT: { OPERATOR: '==', VALUE: '\\.' },
  // Ellipsis: { OPERATOR: '==', VALUE: '\\.\\.\\.' },
  // EXTEND: { OPERATOR: '==', VALUE: '@extend' },
  // False: { OPERATOR: '==', VALUE: '[Ff]alse' },
  // FONT_FACE: { OPERATOR: '==', VALUE: '@font-face' },
  // FROM: { OPERATOR: '==', VALUE: 'from' },
  // FUNCTION: { OPERATOR: '==', VALUE: '@function' },
  // HASH: { OPERATOR: '==', VALUE: '#' },
  // Identifier: { OPERATOR: '==', VALUE: '\\-*[a-zA-Z\\u0100-\\ufffe_][a-zA-Z\\u0100-\\ufffe0-9_-]*' },
  // IF: { OPERATOR: '==', VALUE: 'if' },
  // IMPORT: { OPERATOR: '==', VALUE: '@import' },
  // IMPORTANT: { OPERATOR: '==', VALUE: '\\!important' },
  // IN: { OPERATOR: '==', VALUE: 'in' },
  // INCLUDE: { OPERATOR: '==', VALUE: '@include' },
  // VAL__SQBRAC_L: { OPERATOR: '==', VALUE: '\\[' },
  // MEDIA: { OPERATOR: '==', VALUE: '@media' },
  // MINUS: { OPERATOR: '==', VALUE: '\\-' },
  // MIXIN: { OPERATOR: '==', VALUE: '@mixin' },
  // NOTEQ: { OPERATOR: '==', VALUE: '!=' },
  // NULL: { OPERATOR: '==', VALUE: 'null' },
  // OR_LITERAL: { OPERATOR: '==', VALUE: '(?:OR|or)' },
  // PAGE: { OPERATOR: '==', VALUE: '@page' },
  // PIPE_EQ: { OPERATOR: '==', VALUE: '[|]=' },
  // PLUS: { OPERATOR: '==', VALUE: '\\+' },
  // POUND_DEFAULT: { OPERATOR: '==', VALUE: '!default' },
  // RETURN: { OPERATOR: '==', VALUE: '@return' },
  // RGB_NUMERIC_VAL: { OPERATOR: '==', VALUE: '(?:[0-9]{0,3}\\.)?[0-9]+' },
  // SL_COMMENT: { OPERATOR: '==', VALUE: '\\/\\/[^\\n\\r]*' },
  // STAR_EQ: { OPERATOR: '==', VALUE: '[*]=' },
  // StringLiteral: { OPERATOR: '&&', SEGMENTS: ['STRING'] },
  // THROUGH: { OPERATOR: '==', VALUE: 'through' },
  // TIL: { OPERATOR: '==', VALUE: '~' },
  // TILD_EQ: { OPERATOR: '==', VALUE: '~=' },
  // TIMES: { OPERATOR: '==', VALUE: '\\*' },
  // True: { OPERATOR: '==', VALUE: '[T]rue' },
  // Unit: { OPERATOR: '==', VALUE: '(%|px|cm|mm|in|pt|pc|em|ex|deg|rad|grad|ms|s|hz|khz)' },
  // Url: { OPERATOR: '||', SEGMENTS: ['STRING', 'UrlVal'] },
  // UrlEnd: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_R'] },
  // UrlStart: { OPERATOR: '&&', SEGMENTS: ['UrlStartVal', 'VAL__PAREN_L'] },
  // UrlStartVal: { OPERATOR: '==', VALUE: 'url' },
  // UrlVal: { OPERATOR: '==', VALUE: '[^\)]+' },
},
// Dependant On:
[
  require('./base'),
]);

// ******************************