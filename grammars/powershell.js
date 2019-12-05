'use strict'; // JS: ES5

// ******************************
//
//
// POWERSHELL DEFINITION FILE
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
    START: { OPERATOR: '||', SEGMENTS: ['powershell*'] },
    // powershell: { OPERATOR: '||', SEGMENTS: ['statementList','value'] },
    powershell: { OPERATOR: '||', SEGMENTS: ['statementList'] },

    statementList: { OPERATOR: '&&', SEGMENTS: ['statement','statementListExtra*'] },
    statementListExtra: { OPERATOR: '&&', SEGMENTS: ['VAL__SEMI','statement'] },
    statementBlock: { OPERATOR: '&&', SEGMENTS: ['VAL__CURLY_L','statementList?','VAL__CURLY_R'] },

    statement: { OPERATOR: '||', SEGMENTS: ['ifStatement','switchStatement','foreachStatement','forWhileStatement','doWhileStatement','functionDeclaration','parameterDeclaration','flowControlStatement','trapStatement','finallyStatement','pipeline'], DEBUG: 'ALL' },
    ifStatement: { OPERATOR: '&&', SEGMENTS: ['IF','pipelineInParen','statementBlock','elseIfStatement*','elseStatement?'] },
    elseIfStatement: { OPERATOR: '&&', SEGMENTS: ['ELSEIF','pipelineInParen','statementBlock'] },
    elseStatement: { OPERATOR: '&&', SEGMENTS: ['ELSE','statementBlock'] },

    switchStatement: { OPERATOR: '&&', SEGMENTS: ['SWITCH','switchParams?','switchParams2?','switchFileParam','VAL__CURLY_L','switchStatementEntry+','VAL__CURLY_R'] },
    switchParams: { OPERATOR: '||', SEGMENTS: ['SWITCH_REGEX','SWITCH_WILDCARD','SWITCH_EXACT']},
    switchParams2: { OPERATOR: '||', SEGMENTS: ['SWITCH_CASESENSITIVE']},
    switchFileParam: { OPERATOR: '&&', SEGMENTS: ['SWITCH_FILE','switchFileParamValue']},
    // switchFileParamValue: { OPERATOR: '||', SEGMENTS: ['propertyOrArrayReference','pipelineInParen']},
    switchFileParamValue: { OPERATOR: '||', SEGMENTS: ['pipelineInParen']},
    switchStatementEntry: { OPERATOR: '&&', SEGMENTS: ['switchStatementEntryType','statementBlock']},
    switchStatementEntryType: { OPERATOR: '||', SEGMENTS: ['SWITCH_DEFAULT','ParameterArgumentToken','propertyOrArrayReference','statementBlock']},

    // pipeline: { OPERATOR: '||', SEGMENTS: ['assignmentStatement','pipelineStatement'] },
    pipeline: { OPERATOR: '||', SEGMENTS: ['pipelineStatement'] },
    pipelineInParen: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L','pipeline','VAL__PAREN_R'] },
    firstPipelineElement: { OPERATOR: '||', SEGMENTS: ['expression','cmdletCall'] },
    pipelineStatement: { OPERATOR: '&&', SEGMENTS: ['firstPipelineElement','piped*'] },
    piped: { OPERATOR: '&&', SEGMENTS: ['VAL__PIPE','cmdletCall'] },

    assignmentStatement: { OPERATOR: '&&', SEGMENTS: ['lvalueExpression','AssignmentOperatorToken','pipeline'] },

    value: { OPERATOR: '||', SEGMENTS: ['assignmentInParen','statementListWrapped','statementListArray','cmdletBody','hashLiteralObject'] },
    assignmentInParen: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L','assignmentStatement','VAL__PAREN_R'] },
    statementListWrapped: { OPERATOR: '&&', SEGMENTS: ['WRAPPER_START','statementList','VAL__PAREN_R'] },
    statementListArray: { OPERATOR: '&&', SEGMENTS: ['ARRAY_START','statementList','VAL__PAREN_R'] },
    hashLiteralObject: { OPERATOR: '&&', SEGMENTS: ['OBJECT_START','hashLiteral','VAL__CURLY_R'] },

    expression: { OPERATOR: '||', SEGMENTS: ['variableExpression','functionExpression','logicalExpression'] },
    variableExpression: { OPERATOR: '&&', SEGMENTS: ['VAL__DOLLAR','VARIABLE_NAME'] },
    functionExpression: { OPERATOR: '&&', SEGMENTS: ['FUNCTION_NAME', 'functionArgument*'] },
    functionArgument: { OPERATOR: '||', SEGMENTS: ['dashFunctionArgument', 'argumentValue'] },
    dashFunctionArgument: { OPERATOR: '&&', SEGMENTS: ['VAL__DASH', 'ARGUMENT_NAME', 'argumentValueExpression?'] },
    argumentValueExpression: { OPERATOR: '&&', SEGMENTS: ['argumentValueSeparator', 'argumentValue'] },
    argumentValueSeparator: { OPERATOR: '||', SEGMENTS: ['VAL__NON_EMPTY_WHITESPACE', 'VAL__COLON', 'VAL__EQ'] },
    argumentValue: { OPERATOR: '||', SEGMENTS: ['doubleQuotedArgumentValue', 'singleQuotedArgumentValue'] },
    doubleQuotedArgumentValue: { OPERATOR: '&&', SEGMENTS: ['VAL__DQUOTE', 'ARGUMENT_DQUOTE_STRING_VALUE', 'VAL__DQUOTE'] },
    singleQuotedArgumentValue: { OPERATOR: '&&', SEGMENTS: ['VAL__SQUOTE', 'ARGUMENT_SQUOTE_STRING_VALUE', 'VAL__SQUOTE'] },
    logicalExpression: { OPERATOR: '&&', SEGMENTS: ['bitwiseExpression', 'logicalBitwiseExpression*'] },
    logicalBitwiseExpression: { OPERATOR: '&&', SEGMENTS: ['LogicalOperatorToken','bitwiseExpression'] },
    bitwiseExpression: { OPERATOR: '&&', SEGMENTS: ['comparisonExpression', 'bitwiseComparisonExpression*'] },
    bitwiseComparisonExpression: { OPERATOR: '&&', SEGMENTS: ['BitwiseOperatorToken','comparisonExpression'] },
    comparisonExpression: { OPERATOR: '&&', SEGMENTS: ['addExpression', 'comparisonAddExpression*'] },
    comparisonAddExpression: { OPERATOR: '&&', SEGMENTS: ['ComparisonOperatorToken','addExpression'] },
    addExpression: { OPERATOR: '&&', SEGMENTS: ['multiplyExpression', 'addMultiplyExpression*'] },
    addMultiplyExpression: { OPERATOR: '&&', SEGMENTS: ['AdditionOperatorToken','multiplyExpression'] },

    multiplyExpression: { OPERATOR: '&&', SEGMENTS: ['formatExpression','MultiplyOperatorToken','formatExpression'] },
    formatExpression: { OPERATOR: '&&', SEGMENTS: ['rangeExpression', 'formatRangeExpression*'] },
    formatRangeExpression: { OPERATOR: '&&', SEGMENTS: ['FormatOperatorToken','rangeExpression'] },
    rangeExpression: { OPERATOR: '&&', SEGMENTS: ['arrayLiteral', 'rangeArrayLiteral*'] },
    rangeArrayLiteral: { OPERATOR: '&&', SEGMENTS: ['RangeOperatorToken','arrayLiteral'] },
    arrayLiteral: { OPERATOR: '&&', SEGMENTS: ['postfixOperator', 'commaPostfixOperator*'] },
    commaPostfixOperator: { OPERATOR: '&&', SEGMENTS: ['CommaToken','postfixOperator'] },
    postfixOperator: { OPERATOR: '&&', SEGMENTS: ['lvalueExpression','prePostfixOperatorTokenOrPropertyOrArrayReference'] },
    prePostfixOperatorTokenOrPropertyOrArrayReference: { OPERATOR: '||', SEGMENTS: ['PrePostfixOperatorToken','propertyOrArrayReference'] },
    propertyOrArrayReference: { OPERATOR: '&&', SEGMENTS: ['value','propertyOrArrayReferenceOperator*'] },

    // lvalue: { OPERATOR: '&&', SEGMENTS: ['simpleLvalue','propertyOrArrayReferenceOperator*'] },
    // parseCall: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L','arrayLiteral','VAL__PAREN_R'] },
    finallyStatement: { OPERATOR: '&&', SEGMENTS: ['FINALLY','statementBlock'] },
    // redirection: { OPERATOR: '&&', SEGMENTS: ['redirectionOperatorToken','propertyOrArrayReference'] },
    // simpleLvalue: { OPERATOR: '&&', SEGMENTS: ['AttributeSpecificationToken*','variableToken'] },
    trapStatement: { OPERATOR: '&&', SEGMENTS: ['TRAP','AttributeSpecificationToken?','statementBlock'] },

    // cmdletBody: { OPERATOR: '&&', SEGMENTS: ['VAL__CURLY_L' [ 'VAL__PAREN_L','parameterDeclarationExpression','VAL__PAREN_R' ] ([ 'begin','statementBlock' | 'process','statementBlock' | 'end','statementBlock' ]* |'statementList','VAL__CURLY_R'] },
    cmdletBody: { OPERATOR: '==', VALUE: '--TODO--' },
    // cmdletCall: { OPERATOR: '&&', SEGMENTS: ['&' | '.' | 'empty' ] [ 'name' | 'expression' ][ 'parameterToken' |'parameterArgumentToken' |'postfixOperator' |'redirection' ]*] },
    cmdletCall: { OPERATOR: '==', VALUE: '--TODO--' },
    // doWhileStatement: { OPERATOR: '&&', SEGMENTS: ['LoopLabelToken?','do','statementBlock' ['while' | 'until'] 'pipelineInParen'] },
    doWhileStatement: { OPERATOR: '==', VALUE: '--TODO--' },
    // flowControlStatement: { OPERATOR: '&&', SEGMENTS: [['break' | 'continue'] ['propertyNameToken' | 'propertyOrArrayReference']{0 |1} |'return','pipeline'] },
    flowControlStatement: { OPERATOR: '==', VALUE: '--TODO--' },
    // foreachStatement: { OPERATOR: '&&', SEGMENTS: ['LoopLabelToken?','foreach''VAL__PAREN_L','variableToken'  'in','pipeline','VAL__PAREN_R''statementBlock'] },
    foreachStatement: { OPERATOR: '==', VALUE: '--TODO--' },
    // forWhileStatement: { OPERATOR: '&&', SEGMENTS: ['LoopLabelToken?','while','pipelineInParen','statementBlock' |'LoopLabelToken?','for','VAL__PAREN_L','pipelineRule?',';''pipelineRule?',';','pipelineRule?','VAL__PAREN_R','statementBlock'] },
    forWhileStatement: { OPERATOR: '==', VALUE: '--TODO--' },
    // functionDeclaration: { OPERATOR: '&&', SEGMENTS: ['FunctionDeclarationToken''ParameterArgumentToken' [ 'VAL__PAREN_L','parameterDeclarationExpression','VAL__PAREN_R' ] 'cmdletBody'# The following rule defines the grammar for a cmdlet (function/script/scriptblock) body] },
    functionDeclaration: { OPERATOR: '==', VALUE: '--TODO--' },
    // lvalueExpression: { OPERATOR: '&&', SEGMENTS: [lvalue' [? |? 'lvalue']*] },
    lvalueExpression: { OPERATOR: '==', VALUE: '--TODO--' },
    // parameterDeclarationExpression: { OPERATOR: '&&', SEGMENTS: ['parameterWithIntializer' [ 'CommaToken','parameterWithIntializer' ]*] },
    // parameterDeclaration: { OPERATOR: '&&', SEGMENTS: ['ParameterDeclarationToken','VAL__PAREN_L','parameterDeclarationExpression','VAL__PAREN_R'] },
    parameterDeclaration: { OPERATOR: '==', VALUE: '--TODO--' },
    // parameterWithIntializer: { OPERATOR: '&&', SEGMENTS: ['simpleLvalue' [ '='  'expression' ]] },
    // propertyOrArrayReferenceOperator: { OPERATOR: '&&', SEGMENTS: ['[','expression',']' ] |'.' ['PropertyNameToken','parseCallRule?' |'value']] },
    propertyOrArrayReferenceOperator: { OPERATOR: '==', VALUE: '--TODO--' },

    hashLiteral: { OPERATOR: '==', VALUE: '--TODO--' },

    variableToken: { OPERATOR: '==', VALUE: '--TODO--' },
    redirectionOperatorToken: { OPERATOR: '==', VALUE: '--TODO--' },
    AssignmentOperatorToken: { OPERATOR: '==', VALUE: '--TODO--' },
    ParameterArgumentToken: { OPERATOR: '==', VALUE: '--TODO--' },
    LogicalOperatorToken: { OPERATOR: '==', VALUE: '--TODO--' },
    BitwiseOperatorToken: { OPERATOR: '==', VALUE: '--TODO--' },
    ComparisonOperatorToken: { OPERATOR: '==', VALUE: '--TODO--' },
    AdditionOperatorToken: { OPERATOR: '==', VALUE: '--TODO--' },
    MultiplyOperatorToken: { OPERATOR: '==', VALUE: '--TODO--' },
    FormatOperatorToken: { OPERATOR: '==', VALUE: '--TODO--' },
    RangeOperatorToken: { OPERATOR: '==', VALUE: '--TODO--' },
    CommaToken: { OPERATOR: '==', VALUE: '--TODO--' },
    PrePostfixOperatorToken: { OPERATOR: '==', VALUE: '--TODO--' },
    AttributeSpecificationToken: { OPERATOR: '==', VALUE: '--TODO--' },

    VARIABLE_NAME: { OPERATOR: '==', VALUE: '[a-zA-Z]+' },
    ARGUMENT_NAME: { OPERATOR: '==', VALUE: '[a-zA-Z]+' },
    ARGUMENT_DQUOTE_STRING_VALUE: { OPERATOR: '==', VALUE: '[^"]+' },
    ARGUMENT_SQUOTE_STRING_VALUE: { OPERATOR: '==', VALUE: '[^\']+' },
    FUNCTION_NAME: { OPERATOR: '==', VALUE: '[a-zA-Z_-]+' },

    SWITCH: { OPERATOR: '==', VALUE: 'switch' },
    SWITCH_REGEX: { OPERATOR: '==', VALUE: '-regex' },
    SWITCH_WILDCARD: { OPERATOR: '==', VALUE: '-wildcard' },
    SWITCH_EXACT: { OPERATOR: '==', VALUE: '-exact' },
    SWITCH_CASESENSITIVE: { OPERATOR: '==', VALUE: '-casesensitive' },
    SWITCH_FILE: { OPERATOR: '==', VALUE: '-file' },
    SWITCH_DEFAULT: { OPERATOR: '==', VALUE: 'default' },

    WRAPPER_START: { OPERATOR: '==', VALUE: '[$][(]' },
    ARRAY_START: { OPERATOR: '==', VALUE: '[@][(]' },
    OBJECT_START: { OPERATOR: '==', VALUE: '[@][{]' },

    IF: { OPERATOR: '==', REGEXP: new RegExp('if', 'i') },
    ELSEIF: { OPERATOR: '==', VALUE: 'elseif' },
    ELSE: { OPERATOR: '==', VALUE: 'else' },
    FINALLY: { OPERATOR: '==', VALUE: 'finally' },
    TRAP: { OPERATOR: '==', VALUE: 'trap' },
    TODO: { OPERATOR: '==', VALUE: '--TODO--' },
},
// Dependant On:
[
    require('./base')
]);

// ******************************