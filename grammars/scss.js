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
// Definition:
// ******************************

module.exports = grammar.export_grammar({
    START: { OPERATOR: '||', SEGMENTS: ['stylesheet'] },
    stylesheet: { OPERATOR: '&&', SEGMENTS: ['statement*'] },
    statement: { OPERATOR: '||', SEGMENTS: ['CLASS', 'COMMENT', 'VARIABLE', 'EACH', 'importDeclaration', 'includeDeclaration', 'fontFaceDeclaration', 'mediaDeclaration', 'KEYFRAMES', 'pageDeclaration', 'extendDeclaration', 'mixinDeclaration', 'functionDeclaration', 'ifDeclaration', 'forDeclaration', 'whileDeclaration', 'nested'] },

    VARIABLE: { STACK: 'VARIABLE', OPERATOR: '&&', SEGMENTS: ['VARIABLE_KEY', 'VAL__COLON', 'VARIABLE_VALUE', 'VAL__POUND_DEFAULT?', 'REQUIRED_SEMI'] },
    VARIABLE_KEY: { STACK: 'VARIABLE_KEY', OPERATOR: '||', SEGMENTS: ['STRING', 'VARIABLE_EXPRESSION'] },
    VARIABLE_VALUE: { STACK: 'VARIABLE_VALUE', OPERATOR: '||', SEGMENTS: ['EXPRESSION'] },

    CLASS: { STACK: 'CLASS', OPERATOR: '&&', SEGMENTS: ['SELECTORS', 'BLOCK'] },
    SELECTORS: { STACK: 'SELECTORS',OPERATOR: '&&', SEGMENTS: ['SELECTOR', 'COMMA_SELECTOR*'] },
    COMMA_SELECTOR: { STACK: 'SELECTORS_2ND', OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'SELECTOR'] },

    SELECTOR: { STACK: 'SELECTOR', OPERATOR: '&&', SEGMENTS: ['FIRST_SELECTOR_PREFIX?', 'SELECTOR_ELEMENT', 'PREFIXED_SELECTOR_ELEMENT*'] },
    FIRST_SELECTOR_PREFIX: { STACK: 'FIRST_SELECTOR_PREFIX', OPERATOR: '&&', SEGMENTS: ['SELECTOR_PREFIX'] },
    PREFIXED_SELECTOR_ELEMENT: { STACK: 'SELECTOR_2ND', OPERATOR: '&&', SEGMENTS: ['SELECTOR_PREFIX?', 'SELECTOR_ELEMENT'] },
    SELECTOR_ELEMENT: { OPERATOR: '&&', SEGMENTS: ['SELECTOR_ELEMENT_NAME', 'SELECTOR_ELEMENT_MODIFIER?'] },
    SELECTOR_ELEMENT_MODIFIER: { OPERATOR: '&&', SEGMENTS: ['VAL__COLON', 'VAL__SELECTOR_MODIFIER'] },
    SELECTOR_ELEMENT_NAME: { OPERATOR: '||', SEGMENTS: ['DOT_SELECTOR_NAME', 'HASH_SELECTOR_NAME', 'VAL__SELECTOR_NAME'] },
    SELECTOR_PREFIX: { OPERATOR: '||', SEGMENTS: ['GT_PREFIX', 'AMP_PREFIX', 'VAL__PLUS', 'VAL__TIL'] },
    GT_PREFIX: { OPERATOR: '&&', SEGMENTS: ['VAL__GT', 'GTGT?'] },
    GTGT: { OPERATOR: '&&', SEGMENTS: ['VAL__GT', 'VAL__GT'] },
    AMP_PREFIX: { OPERATOR: '&&', SEGMENTS: ['VAL__AMP', 'AMP_PREFIX_REMAINDER'] },
    AMP_PREFIX_REMAINDER: { OPERATOR: '||', SEGMENTS: ['VAL__COLON', 'VAL__MINUS'] },

    DOT_SELECTOR_NAME: { OPERATOR: '&&', SEGMENTS: ['VAL__DOT', 'VAL__SELECTOR_NAME'] },
    HASH_SELECTOR_NAME: { OPERATOR: '&&', SEGMENTS: ['VAL__HASH', 'VAL__SELECTOR_NAME'] },

    BLOCK: { STACK: 'BLOCK', OPERATOR: '&&', SEGMENTS: ['VAL__CURLY_L', 'BLOCK_CONTENT_ENTRY*', 'VAL__CURLY_R'] },

    BLOCK_CONTENT_ENTRY: { OPERATOR: '||', SEGMENTS: ['PROPERTY_ENTRY', 'VARIABLE', 'BLOCK_CLASS_ENTRY', 'COMMENT', 'EACH'] },

    PROPERTY_ENTRY: { OPERATOR: '&&', SEGMENTS: ['PROPERTY', 'REQUIRED_SEMI'] },

    BLOCK_CLASS_ENTRY: { OPERATOR: '&&', SEGMENTS: ['CLASS'] },

    PROPERTY: { STACK: 'PROPERTY', OPERATOR: '&&', SEGMENTS: ['PROPERTY_KEY?', 'VAL__COLON', 'PROPERTY_VALUE', 'IMPORTANT?'] },
    PROPERTY_KEY: { OPERATOR: '&&', SEGMENTS: ['VAL__PROPERTY_KEY'] },
    PROPERTY_VALUE: { OPERATOR: '||', SEGMENTS: ['COMMA_SEPERATED_EXPRESSION'] },
    IMPORTANT: { OPERATOR: '==', VALUE: '\\!important' },

    COMMA_SEPERATED_EXPRESSION: { OPERATOR: '&&', SEGMENTS: ['EXPRESSION', 'COMMA_EXPRESSION*'] },
    COMMA_EXPRESSION: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'EXPRESSION'] },

    EXPRESSION: { STACK: 'EXPRESSION', OPERATOR: '&&', SEGMENTS: ['NEGATED_EXPRESSION_PART', 'DELIM_EXPRESSION_PART*'] },
    DELIM_EXPRESSION_PART: { STACK: 'EXPRESSION_2ND', OPERATOR: '&&', SEGMENTS: ['EXPRESSION_PART_DELIM?', 'NEGATED_EXPRESSION_PART'] },
    EXPRESSION_PART_DELIM: { OPERATOR: '||', SEGMENTS: ['MATH_CHARACTER', 'VAL__SPACE'] },
    NEGATED_EXPRESSION_PART: { OPERATOR: '&&', SEGMENTS: ['VAL__NEGATE?', 'EXPRESSION_PART'] },
    EXPRESSION_PART: { OPERATOR: '||', SEGMENTS: [
        'MAP_ENTRY_EXPRESSION',
        'HASH_EXPRESSION',
        'KEYWORD_EXPRESSION',
        'COLOUR_EXPRESSION',
        'STRING_EXPRESSION',
        'VARIABLE_EXPRESSION',
        'MEASUREMENT_EXPRESSION',
        'NUMERIC_EXPRESSION',
        'COMMENT',
        'PAREN_EXPRESSION',
    ] },

    PAREN_EXPRESSION: { STACK: 'PAREN_EXPRESSION', OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'COMMA_SEPERATED_EXPRESSION', 'VAL__PAREN_R'] },
    NUMERIC_EXPRESSION: { STACK: 'NUMERIC_EXPRESSION', OPERATOR: '&&', SEGMENTS: ['VAL__NUMBER'] },
    MEASUREMENT_EXPRESSION: { STACK: 'NUMERIC_EXPRESSION', OPERATOR: '&&', SEGMENTS: ['VAL__MEASUREMENT'] },
    STRING_EXPRESSION: { STACK: 'STRING_EXPRESSION', OPERATOR: '&&', SEGMENTS: ['STRING'] },
    COLOUR_EXPRESSION: { STACK: 'COLOUR_EXPRESSION', OPERATOR: '&&', SEGMENTS: ['VAL__HEX_COLOUR'] },
    KEYWORD_EXPRESSION: { STACK: 'KEYWORD_EXPRESSION', OPERATOR: '&&', SEGMENTS: ['VAL__KEYWORD_NAME', 'FUNCTION_CALL?'] },
    VARIABLE_EXPRESSION: { STACK: 'VARIABLE_EXPRESSION', OPERATOR: '&&', SEGMENTS: ['VAL__DOLLAR', 'VAL__VARIABLE_NAME'] },
    COMMA_VARIABLE_EXPRESSION: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'VARIABLE_EXPRESSION'] },
    HASH_EXPRESSION: { STACK: 'HASH_EXPRESSION', OPERATOR: '&&', SEGMENTS: ['VAL__HASH', 'VAL__CURLY_L', 'EXPRESSION', 'VAL__CURLY_R'] },
    MAP_ENTRY_EXPRESSION: { STACK: 'MAP_ENTRY_EXPRESSION', OPERATOR: '&&', SEGMENTS: ['MAP_ENTRY_KEY', 'VAL__COLON', 'MAP_ENTRY_VALUE'] },
    MAP_ENTRY_KEY: { STACK: 'MAP_ENTRY_KEY', OPERATOR: '&&', SEGMENTS: ['VAL__MAP_KEY'] },
    MAP_ENTRY_VALUE: { STACK: 'MAP_ENTRY_VALUE', OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'COMMA_SEPERATED_EXPRESSION', 'VAL__PAREN_R'] },

    FUNCTION_CALL: { STACK: 'FUNCTION_CALL', OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'FUNCTION_PARAMS?', 'VAL__PAREN_R', 'BLOCK?'] },
    FUNCTION_PARAMS: { STACK: 'FUNCTION_PARAM', OPERATOR: '&&', SEGMENTS: ['FUNCTION_PARAM', 'COMMA_FUNCTION_PARAM*', 'EXTRA_COMMA?'] },
    COMMA_FUNCTION_PARAM: { STACK: 'FUNCTION_PARAM_2ND', OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'FUNCTION_PARAM'] },
    FUNCTION_PARAM: { OPERATOR: '||', SEGMENTS: ['EXPRESSION'] },

    EACH: { STACK: 'EACH', OPERATOR: '&&', SEGMENTS: ['VAL__AT_EACH', 'VARIABLE_EXPRESSION', 'COMMA_VARIABLE_EXPRESSION*', 'VAL__IN', 'EACH_VALUE_LIST', 'BLOCK'] },
    EACH_VALUE_LIST: { OPERATOR: '&&', SEGMENTS: ['EACH_VALUE_LIST_ENTRY', 'COMMA_EACH_VALUE_LIST_ENTRY*'] },
    EACH_VALUE_LIST_ENTRY: { OPERATOR: '||', SEGMENTS: ['EACH_VALUE_LIST_IN_PAREN', 'KEYWORD_EXPRESSION', 'VARIABLE_EXPRESSION'] },
    COMMA_EACH_VALUE_LIST_ENTRY: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'EACH_VALUE_LIST_ENTRY'] },
    EACH_VALUE_LIST_IN_PAREN: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'EACH_VALUE_LIST', 'VAL__PAREN_R'] },

    MATH_CHARACTER: { OPERATOR: '||', SEGMENTS: ['VAL__TIMES', 'VAL__PLUS', 'VAL__DIVIDE', 'MINUS_SPACE', 'VAL__PERC'] },
    MINUS_SPACE: { OPERATOR: '&&', SEGMENTS: ['VAL__MINUS', 'VAL__SPACE'] },

    REQUIRED_SEMI: { OPERATOR: '||', SEGMENTS: ['VAL__SEMI', 'MISSING_SEMI'] },
    MISSING_SEMI: { OPERATOR: '&&', SEGMENTS: ['VAL__EMPTY'] },
    EXTRA_COMMA: { STACK: 'EXTRA_COMMA', OPERATOR: '&&', SEGMENTS: ['VAL__COMMA'] },

    COMMENT: { OPERATOR: '||', SEGMENTS: ['VAL__MULTI_LINE_COMMENT', 'VAL__SINGLE_LINE_COMMENT'] },

    STRING: { OPERATOR: '||', SEGMENTS: ['VAL__STRING_SINGLE_QUOTED', 'VAL__STRING_DOUBLE_QUOTED'] },
    BOOLEAN: { OPERATOR: '||', SEGMENTS: ['VAL__TRUE', 'VAL__FALSE'] },

    VAL__FALSE: { OPERATOR: '==', VALUE: '[Ff]alse' },
    VAL__HEX_COLOUR: { OPERATOR: '==', VALUE: '#[0-9a-fA-F]+' },
    VAL__KEYWORD_NAME: { OPERATOR: '==', VALUE: '\\-*[a-zA-Z\\u0100-\\ufffe_][a-zA-Z\\u0100-\\ufffe0-9_-]*' },
    VAL__MEASUREMENT: { OPERATOR: '==', VALUE: '\\-?(?:[0-9]*\\.)?[0-9]+(?:%|vh|px|rem|cm|mm|in|pt|pc|em|ex|deg|rad|grad|ms|s|hz|khz)' },
    VAL__MULTI_LINE_COMMENT: { OPERATOR: '==', VALUE: '\/\\*[\\s\\S]*?\\*\/' },
    VAL__NEGATE: { OPERATOR: '==', VALUE: '[-]' },
    VAL__NUMBER: { OPERATOR: '==', VALUE: '\\-?(?:[0-9]*\\.)?[0-9]+' },
    VAL__MAP_KEY: { OPERATOR: '==', VALUE: '[0-9]+' },
    VAL__POUND_DEFAULT: { OPERATOR: '==', VALUE: '!default' },
    VAL__PROPERTY_KEY: { OPERATOR: '==', VALUE: '\\-*[a-zA-Z\\u0100-\\ufffe_][a-zA-Z\\u0100-\\ufffe0-9_-]*' },
    VAL__SELECTOR_MODIFIER: { OPERATOR: '==', VALUE: '\\-*[a-zA-Z\\u0100-\\ufffe_][a-zA-Z\\u0100-\\ufffe0-9_-]*' },
    VAL__SELECTOR_NAME: { OPERATOR: '==', VALUE: '\\-*[a-zA-Z\\u0100-\\ufffe_][a-zA-Z\\u0100-\\ufffe0-9_-]*' },
    VAL__SINGLE_LINE_COMMENT: { OPERATOR: '==', VALUE: '\\/\\/[^\\n\\r]*' },
    VAL__STRING_DOUBLE_QUOTED: { OPERATOR: '==', VALUE: '"[^"\\n\\r]*"' },
    VAL__STRING_SINGLE_QUOTED: { OPERATOR: '==', VALUE: '\'[^\'\\n\\r]*\'' },
    VAL__TRUE: { OPERATOR: '==', VALUE: '[T]rue' },
    VAL__VARIABLE_NAME: { OPERATOR: '==', VALUE: '\\-*[a-zA-Z\\u0100-\\ufffe_][a-zA-Z\\u0100-\\ufffe0-9_-]*' },
    VAL__AT_EACH: { OPERATOR: '==', VALUE: '@each' },
    VAL__IN: { OPERATOR: '==', VALUE: 'in' },




    params: { OPERATOR: '&&', SEGMENTS: ['param', 'paramMore*', 'Ellipsis?'] },
    paramMore: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'param*', 'Ellipsis?'] },
    param: { OPERATOR: '&&', SEGMENTS: ['variableName', 'paramOptionalValue?'] },
    variableName: { OPERATOR: '&&', SEGMENTS: ['DOLLAR', 'Identifier?'] },
    paramOptionalValue: { OPERATOR: '&&', SEGMENTS: ['COLON', 'expression'] },
    paramsInParen: { OPERATOR: '&&', SEGMENTS: ['LPAREN', 'params?', 'RPAREN'] },
    valuesInParen: { OPERATOR: '&&', SEGMENTS: ['LPAREN', 'values?', 'RPAREN'] },
    mixinDeclaration: { OPERATOR: '&&', SEGMENTS: ['MIXIN', 'Identifier', 'paramsInParen?', 'block'] },
    pageDeclaration: { OPERATOR: '&&', SEGMENTS: ['PAGE', 'block'] },
    extendDeclaration: { OPERATOR: '&&', SEGMENTS: ['EXTEND', 'percIdentifier', 'VAL__SEMI?'] },
    includeDeclaration: { OPERATOR: '&&', SEGMENTS: ['INCLUDE', 'Identifier', 'includeDeclarationTermination'] },
    includeDeclarationTermination: { OPERATOR: '||', SEGMENTS: ['VAL__SEMI+', 'valuesInParenSemiBlock'] },
    fontFaceDeclaration: { OPERATOR: '&&', SEGMENTS: ['FONT_FACE', 'fontFaceDeclarationStart', 'fontFaceDeclarationValues', 'fontFaceDeclarationEnd'] },
    fontFaceDeclarationStart: { OPERATOR: '&&', SEGMENTS: ['BlockStart'] },
    fontFaceDeclarationValues: { OPERATOR: '&&', SEGMENTS: ['blockProperty*'] },
    fontFaceDeclarationEnd: { OPERATOR: '&&', SEGMENTS: ['BlockEnd'] },
    mediaDeclaration: { OPERATOR: '&&', SEGMENTS: ['MEDIA', 'mediaDeclarationParts', 'mediaDeclarationTermination'] },
    mediaDeclarationParts: { OPERATOR: '&&', SEGMENTS: ['mediaDeclarationPart+', 'commaMediaDeclarationPart*'] },
    commaMediaDeclarationPart: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'mediaDeclarationPart*'] },
    mediaDeclarationPart: { OPERATOR: '||', SEGMENTS: ['propertyInParen', 'identifier'] },
    mediaDeclarationTermination: { OPERATOR: '||', SEGMENTS: ['VAL__SEMI+', 'valuesInParenSemiBlock'] },
    valuesInParenSemi: { OPERATOR: '&&', SEGMENTS: ['valuesInParen', 'VAL__SEMI?'] },
    valuesInParenSemiBlock: { OPERATOR: '&&', SEGMENTS: ['valuesInParenSemi?', 'block?'] },
    functionDeclaration: { OPERATOR: '&&', SEGMENTS: ['FUNCTION', 'Identifier', 'paramsInParen', 'BlockStart', 'functionBody?', 'BlockEnd'] },
    functionBody: { OPERATOR: '&&', SEGMENTS: ['functionStatement*', 'functionReturn'] },
    functionReturn: { OPERATOR: '&&', SEGMENTS: ['RETURN', 'commandStatement', 'VAL__SEMI+'] },
    functionStatement: { OPERATOR: '&&', SEGMENTS: ['commandStatement', 'semiOrStatement'] },
    semiOrStatement: { OPERATOR: '||', SEGMENTS: ['VAL__SEMI+', 'statement'] },
    commandStatement: { OPERATOR: '&&', SEGMENTS: ['expressionOrCommandStatement', 'mathStatement?'] },
    expressionOrCommandStatement: { OPERATOR: '||', SEGMENTS: ['expressions', 'commaCommandStatement'] },
    expressions: { OPERATOR: '&&', SEGMENTS: ['expression+', 'commaExpression*', 'EXTRA_COMMA?'] },
    commaExpression: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'expression+'] },
    mathCharacter: { OPERATOR: '||', SEGMENTS: ['TIMES', 'PLUS', 'DIV', 'MINUS', 'PERC'] },
    mathStatement: { OPERATOR: '&&', SEGMENTS: ['mathCharacter', 'commandStatement'] },
    // expression: { OPERATOR: '||', SEGMENTS: ['url', 'functionCall', 'mapExpression', 'COMMENT', 'mathCharacter', 'MEASUREMENT', 'VAL__NUMBER', 'identifier', 'Color', 'StringLiteral', 'NULL', 'variableName'] },
    expression: { OPERATOR: '&&', SEGMENTS: ['EXPRESSION'] },
    // mapExpression: { OPERATOR: '&&', SEGMENTS: ['mapExpressionStart', 'mapEntry', 'commaMapEntry*', 'EXTRA_COMMA?', 'COMMENT?', 'mapExpressionEnd'] },
    // mapExpressionStart: { OPERATOR: '&&', SEGMENTS: ['LPAREN'] },
    // mapExpressionEnd: { OPERATOR: '&&', SEGMENTS: ['RPAREN'] },
    // mapEntry: { OPERATOR: '&&', SEGMENTS: ['COMMENT?', 'mapEntryKeyValue', 'COMMENT?'] },
    // mapEntryKeyValue: { OPERATOR: '&&', SEGMENTS: ['mapEntryKey', 'COLON', 'mapEntryValues'] },
    // mapEntryKey: { OPERATOR: '||', SEGMENTS: ['VAL__NUMBER', 'StringLiteral', 'Identifier'] },
    // mapEntryValues: { OPERATOR: '&&', SEGMENTS: ['mathCharacter?', 'expression'] },
    // commaMapEntry: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'mapEntry'] },
    // RGB: { OPERATOR: '&&', SEGMENTS: ['LPAREN', 'RGB_VAL', 'COMMA_RGB_VAL*', 'RPAREN'] },
    // COMMA_RGB_VAL: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'RGB_VAL'] },
    // RGB_VAL: { OPERATOR: '||', SEGMENTS: ['RGB_NUMERIC_VAL', 'variableName'] },
    ifDeclaration: { OPERATOR: '&&', SEGMENTS: ['AT_IF', 'CONDITIONS', 'block', 'elseIfStatement*', 'elseStatement?'] },
    elseIfStatement: { OPERATOR: '&&', SEGMENTS: ['AT_ELSE', 'IF', 'CONDITIONS', 'block'] },
    elseStatement: { OPERATOR: '&&', SEGMENTS: ['AT_ELSE', 'block'] },

    // commaVariableName: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'variableName'] },
    commaIdentifier: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'Identifier'] },
    colonValues: { OPERATOR: '&&', SEGMENTS: ['COLON', 'values'] },
    forDeclaration: { OPERATOR: '&&', SEGMENTS: ['AT_FOR', 'variableName', 'FROM', 'fromNumber', 'THROUGH', 'through', 'block'] },
    fromNumber: { OPERATOR: '&&', SEGMENTS: ['VAL__NUMBER'] },
    through: { OPERATOR: '||', SEGMENTS: ['VAL__NUMBER', 'functionCall', 'variableName'] },
    whileDeclaration: { OPERATOR: '&&', SEGMENTS: ['AT_WHILE', 'CONDITIONS', 'block'] },
    // identifierValue: { OPERATOR: '&&', SEGMENTS: ['identifier', 'colonValues?'] },
    importDeclaration: { OPERATOR: '&&', SEGMENTS: ['IMPORT', 'referenceUrl', 'commaReferenceUrl*', 'mediaTypes?', 'VAL__SEMI+'] },
    referenceUrl: { OPERATOR: '||', SEGMENTS: ['StringLiteral', 'url'] },
    commaReferenceUrl: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'referenceUrl'] },
    mediaTypes: { OPERATOR: '&&', SEGMENTS: ['Identifier', 'commaIdentifier*'] },
    nested: { OPERATOR: '&&', SEGMENTS: ['AT', 'AND?', 'Identifier+', 'pseudo*', 'selectors', 'BlockStart', 'stylesheet', 'BlockEnd'] },
    // ruleset: { OPERATOR: '&&', SEGMENTS: ['selectors', 'block'] },
    block: { OPERATOR: '&&', SEGMENTS: ['BlockStart', 'blockProperty*', 'blockPropertyNoSemi?', 'BlockEnd'] },
    blockProperty: { OPERATOR: '||', SEGMENTS: ['blockPropertySemi'] },
    blockPropertySemi: { OPERATOR: '&&', SEGMENTS: ['property', 'IMPORTANT?', 'VAL__SEMI+'] },
    blockPropertyNoSemi: { OPERATOR: '&&', SEGMENTS: ['property', 'IMPORTANT?', 'MISSING_SEMI'] },
    // selectors: { OPERATOR: '&&', SEGMENTS: ['selector', 'commaSelector*'] },
    // commaSelector: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'selector'] },
    // selector: { OPERATOR: '&&', SEGMENTS: ['selectorStart*', 'attrib*', 'selectorPrefix?', 'pseudo*'] },
    // selectorStart: { OPERATOR: '||', SEGMENTS: ['element', 'selectorPrefixElement'] },
    // selectorPrefixElement: { OPERATOR: '&&', SEGMENTS: ['selectorPrefix', 'element'] },
    // selectorPrefix: { OPERATOR: '||', SEGMENTS: ['GTPrefix', 'PLUS', 'TIL'] },
    // GTPrefix: { OPERATOR: '&&', SEGMENTS: ['GT', 'GTGT?'] },
    // GTGT: { OPERATOR: '&&', SEGMENTS: ['GT', 'GT'] },
    element: { OPERATOR: '||', SEGMENTS: ['hashIdentifier', 'dotIdentifier', 'percIdentifier', 'AND', 'TIMES', 'pseudo', 'elementInBrackets'] },
    elementInBrackets: { OPERATOR: '&&', SEGMENTS: ['LBRACK', 'element', 'RBRACK'] },
    hashIdentifier: { OPERATOR: '&&', SEGMENTS: ['HASH', 'identifier'] },
    dotIdentifier: { OPERATOR: '&&', SEGMENTS: ['VAL__DOT', 'identifier'] },
    percIdentifier: { OPERATOR: '&&', SEGMENTS: ['PERC', 'identifier'] },
    pseudo: { OPERATOR: '||', SEGMENTS: ['pseudoValueInParens', 'pseudoFunctionCall'] },
    pseudoValueInParens: { OPERATOR: '&&', SEGMENTS: ['LPAREN', 'pseudoValue', 'RPAREN'] },
    pseudoValue: { OPERATOR: '||', SEGMENTS: ['pseudo', 'attrib', 'VAL__NUMBER', 'hashBlock'] },
    // pseudoIdentifier: { OPERATOR: '&&', SEGMENTS: ['colonOrColonColon', 'Identifier'] },
    pseudoFunctionCall: { OPERATOR: '&&', SEGMENTS: ['colonOrColonColon', 'functionCall'] },
    colonOrColonColon: { OPERATOR: '||', SEGMENTS: ['COLONCOLON', 'COLON'] },
    attrib: { OPERATOR: '&&', SEGMENTS: ['LBRACK', 'Identifier', 'attribRelateStringLiteralOrIdentifier?', 'RBRACK'] },
    stringLiteralOrIdentifier: { OPERATOR: '||', SEGMENTS: ['StringLiteral', 'Identifier'] },
    attribRelateStringLiteralOrIdentifier: { OPERATOR: '&&', SEGMENTS: ['attribRelate', 'stringLiteralOrIdentifier'] },
    attribRelate: { OPERATOR: '||', SEGMENTS: ['EQ', 'PIPE_EQ', 'TILD_EQ', 'STAR_EQ'] },
    identifier: { OPERATOR: '&&', SEGMENTS: ['hashBlockOrIdentifier', 'hashBlockOrIdentifierPart*'] },
    hashBlockOrIdentifierPart: { OPERATOR: '&&', SEGMENTS: ['DASH?', 'hashBlockOrIdentifier'] },
    hashBlockOrIdentifier: { OPERATOR: '||', SEGMENTS: ['hashBlock'] },
    hashBlock: { OPERATOR: '&&', SEGMENTS: ['HASH', 'hashBlockStart', 'hashBlockExpression', 'hashBlockEnd'] },
    hashBlockExpression: { OPERATOR: '&&', SEGMENTS: ['expression+'] },
    hashBlockStart: { OPERATOR: '&&', SEGMENTS: ['BlockStart'] },
    hashBlockEnd: { OPERATOR: '&&', SEGMENTS: ['BlockEnd'] },
    property: { OPERATOR: '&&', SEGMENTS: ['identifier', 'colonValues'] },
    propertyInParen: { OPERATOR: '&&', SEGMENTS: ['LPAREN', 'property', 'RPAREN'] },
    values: { OPERATOR: '&&', SEGMENTS: ['commandStatement', 'commaCommandStatement*'] },
    commaCommandStatement: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'commandStatement'] },
    url: { OPERATOR: '&&', SEGMENTS: ['UrlStart', 'Url', 'UrlEnd'] },
    functionCall: { OPERATOR: '&&', SEGMENTS: ['Identifier', 'functionCallStart', 'functionCallArguments', 'functionCallEnd'] },
    functionCallStart: { OPERATOR: '&&', SEGMENTS: ['LPAREN'] },
    functionCallEnd: { OPERATOR: '&&', SEGMENTS: ['RPAREN'] },
    functionCallArguments: { OPERATOR: '&&', SEGMENTS: ['commandStatement'] },

    // Key Frames
    KEYFRAMES: { OPERATOR: '&&', SEGMENTS: ['VAL_KEYFRAMES', 'KEYFRAMES_IDENTIFIER', 'BlockStart', '_KEYFRAMES_ENTRY*', 'KEYFRAMES_END'] },
    KEYFRAMES_IDENTIFIER: { OPERATOR: '&&', SEGMENTS: ['Identifier'] },
    _KEYFRAMES_ENTRY: { OPERATOR: '&&', SEGMENTS: ['KEYFRAMES_ENTRY_KEY', 'BlockStart', 'KEYFRAMES_ENTRY_PROPERTY', 'COLON', 'values', 'VAL__SEMI?', 'KEYFRAMES_ENTRY_END'] },
    KEYFRAMES_ENTRY_KEY: { OPERATOR: '||', SEGMENTS: ['VAL__MEASUREMENT', 'VAL__NUMBER'] },
    KEYFRAMES_ENTRY_PROPERTY: { OPERATOR: '&&', SEGMENTS: ['values'] },
    KEYFRAMES_ENTRY_END: { OPERATOR: '&&', SEGMENTS: ['BlockEnd'] },
    KEYFRAMES_END: { OPERATOR: '&&', SEGMENTS: ['BlockEnd'] },

    // Conditions
    CONDITIONS: { OPERATOR: '||', SEGMENTS: ['CONDITION_COMBINING'] },
    CONDITION_COMBINING: { OPERATOR: '&&', SEGMENTS: ['_CONDITION_COMBINING_VALUE', '_COMBINE__CONDITION_COMBINING_VALUE+'] },
    _CONDITION_COMBINING_VALUE: { OPERATOR: '||', SEGMENTS: ['CONDITION_COMPARISON'] },
    _COMBINE__CONDITION_COMBINING_VALUE: { OPERATOR: '&&', SEGMENTS: ['COMBINE_OPERATORS', '_CONDITION_COMBINING_VALUE'] },
    CONDITION_COMPARISON: { OPERATOR: '&&', SEGMENTS: ['CONDITION_LEAF', '_COMPARE_CONDITION_VALUE*'] },
    _COMPARE_CONDITION_VALUE: { OPERATOR: '&&', SEGMENTS: ['COMPARE_OPERATORS', 'CONDITION_LEAF'] },
    CONDITION_LEAF: { OPERATOR: '||', SEGMENTS: ['_CONDITION_IN_PAREN', 'CONDITION_VALUE'], },
    _CONDITION_IN_PAREN: { OPERATOR: '&&', SEGMENTS: ['LPAREN', 'CONDITIONS', 'RPAREN'] },
    CONDITION_VALUE: { OPERATOR: '||', SEGMENTS: ['VAL__NUMBER', 'variableName', 'BOOLEAN', 'StringLiteral', 'Identifier'] },
    COMPARE_OPERATORS: { OPERATOR: '||', SEGMENTS: ['EQEQ', 'LTEQ', 'LT', 'GTEQ', 'GT', 'NOTEQ'] },
    COMBINE_OPERATORS: { OPERATOR: '||', SEGMENTS: ['COMBINE_COMPARE_AND', 'COMBINE_COMPARE_OR', 'AND_LITERAL', 'OR_LITERAL'] },

    // Other:
    // MEASUREMENT: { OPERATOR: '&&', SEGMENTS: ['VAL__MEASUREMENT'] },

    VAL_KEYFRAMES: { OPERATOR: '==', VALUE: '@keyframes' },

    NULL: { OPERATOR: '==', VALUE: 'null' },
    COMBINE_COMPARE_AND: { OPERATOR: '==', VALUE: '[&][&]' },
    COMBINE_COMPARE_OR: { OPERATOR: '==', VALUE: '[|][|]' },
    AND_LITERAL: { OPERATOR: '==', VALUE: '(?:AND|and)' },
    OR_LITERAL: { OPERATOR: '==', VALUE: '(?:OR|or)' },
    Ellipsis: { OPERATOR: '==', VALUE: '\\.\\.\\.' },
    LPAREN: { OPERATOR: '==', VALUE: '\\(' },
    RPAREN: { OPERATOR: '==', VALUE: '\\)' },
    BlockStart: { OPERATOR: '==', VALUE: '\\{' },
    BlockEnd: { OPERATOR: '==', VALUE: '\\}' },
    LBRACK: { OPERATOR: '==', VALUE: '\\[' },
    RBRACK: { OPERATOR: '==', VALUE: '\\]' },
    GT: { OPERATOR: '==', VALUE: '>' },
    GTEQ: { OPERATOR: '==', VALUE: '>=' },
    TIL: { OPERATOR: '==', VALUE: '~' },
    LT: { OPERATOR: '==', VALUE: '<' },
    LTEQ: { OPERATOR: '==', VALUE: '<=' },
    COLON: { OPERATOR: '==', VALUE: ':' },
    SEMI: { OPERATOR: '==', VALUE: ';' },
    COMMA: { OPERATOR: '==', VALUE: ',' },
    DOT: { OPERATOR: '==', VALUE: '\\.' },
    DOLLAR: { OPERATOR: '==', VALUE: '\\$' },
    AT: { OPERATOR: '==', VALUE: '@' },
    AND: { OPERATOR: '==', VALUE: '&' },
    HASH: { OPERATOR: '==', VALUE: '#' },
    DASH: { OPERATOR: '==', VALUE: '\\-' },
    COLONCOLON: { OPERATOR: '==', VALUE: '::' },
    PLUS: { OPERATOR: '==', VALUE: '\\+' },
    TIMES: { OPERATOR: '==', VALUE: '\\*' },
    DIV: { OPERATOR: '==', VALUE: '\\/' },
    MINUS: { OPERATOR: '==', VALUE: '\\-' },
    PERC: { OPERATOR: '==', VALUE: '%' },
    UrlStart: { OPERATOR: '&&', SEGMENTS: ['UrlStartVal', 'LPAREN'] },
    UrlStartVal: { OPERATOR: '==', VALUE: 'url' },
    EQEQ: { OPERATOR: '==', VALUE: '==' },
    NOTEQ: { OPERATOR: '==', VALUE: '!=' },
    EQ: { OPERATOR: '==', VALUE: '=' },
    PIPE_EQ: { OPERATOR: '==', VALUE: '[|]=' },
    TILD_EQ: { OPERATOR: '==', VALUE: '~=' },
    STAR_EQ: { OPERATOR: '==', VALUE: '[*]=' },
    MIXIN: { OPERATOR: '==', VALUE: '@mixin' },
    FUNCTION: { OPERATOR: '==', VALUE: '@function' },
    AT_ELSE: { OPERATOR: '==', VALUE: '@else' },
    IF: { OPERATOR: '==', VALUE: 'if' },
    AT_IF: { OPERATOR: '==', VALUE: '@if' },
    AT_FOR: { OPERATOR: '==', VALUE: '@for' },
    AT_WHILE: { OPERATOR: '==', VALUE: '@while' },
    INCLUDE: { OPERATOR: '==', VALUE: '@include' },
    IMPORT: { OPERATOR: '==', VALUE: '@import' },
    RETURN: { OPERATOR: '==', VALUE: '@return' },
    FONT_FACE: { OPERATOR: '==', VALUE: '@font-face' },
    MEDIA: { OPERATOR: '==', VALUE: '@media' },
    PAGE: { OPERATOR: '==', VALUE: '@page' },
    EXTEND: { OPERATOR: '==', VALUE: '@extend' },
    FROM: { OPERATOR: '==', VALUE: 'from' },
    THROUGH: { OPERATOR: '==', VALUE: 'through' },
    Identifier: { OPERATOR: '==', VALUE: '\\-*[a-zA-Z\\u0100-\\ufffe_][a-zA-Z\\u0100-\\ufffe0-9_-]*' },
    StringLiteral: { OPERATOR: '&&', SEGMENTS: ['STRING'] },
    Color: { OPERATOR: '==', VALUE: '#[0-9a-fA-F]+' },
    RGB_NUMERIC_VAL: { OPERATOR: '==', VALUE: '(?:[0-9]{0,3}\\.)?[0-9]+' },
    UrlEnd: { OPERATOR: '&&', SEGMENTS: ['RPAREN'] },
    Url: { OPERATOR: '||', SEGMENTS: ['STRING', 'UrlVal'] },
    UrlVal: { OPERATOR: '==', VALUE: '[^\)]+' }
},
// Dependant On:
[
    require('./base'),
    require('./scss')
]);

// ******************************