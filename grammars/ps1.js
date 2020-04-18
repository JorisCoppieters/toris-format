'use strict'; // JS: ES5

// ******************************
//
//
// PS1 DEFINITION FILE
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

module.exports = grammar.export_grammar(
    {
        START: { OPERATOR: '||', SEGMENTS: ['PS1'] },
        PS1: { OPERATOR: '&&', SEGMENTS: ['statementSeparator*', 'statementList*', 'statementSeparator*'] },

        statementList: { OPERATOR: '&&', SEGMENTS: ['statement', 'statementListExtra*'] },
        statementListExtra: { OPERATOR: '&&', SEGMENTS: ['statementSeparator+', 'statement'] },
        statementSeparator: { OPERATOR: '||', SEGMENTS: ['VAL__SEMI', 'VAL__NEW_LINE'] },
        statementBlock: {
            OPERATOR: '&&',
            SEGMENTS: ['VAL__CURLY_L', 'NL*', 'statementList?', 'NL*', 'VAL__CURLY_R'],
        },

        statement: {
            OPERATOR: '&&',
            SEGMENTS: ['statementOptions', 'pipeExpression*', 'inlineComment?'],
        },

        statementOptions: {
            OPERATOR: '||',
            SEGMENTS: [
                'tryCatchExpression',
                'forEachExpression',
                'functionDeclaration',
                'ifStatement',
                'functionExpression',
                'variableExpression',
                'inlineComment',
            ],
        },

        pipeExpression: {
            OPERATOR: '&&',
            SEGMENTS: ['VAL__PIPE', 'functionExpression'],
        },

        tryCatchExpression: {
            OPERATOR: '&&',
            SEGMENTS: [
                'VAL__tryKeyword',
                'NL*',
                'statementBlock',
                'NL*',
                'VAL__catchKeyword',
                'NL*',
                'statementBlock',
            ],
        },

        forEachExpression: {
            OPERATOR: '&&',
            SEGMENTS: ['VAL__forEachKeyword', 'NL*', 'forEachLoopExpression', 'NL*', 'statementBlock'],
        },
        forEachLoopExpression: {
            OPERATOR: '&&',
            SEGMENTS: ['VAL__PAREN_L', 'variableName', 'VAL__inKeyword', 'variableReference', 'VAL__PAREN_R'],
        },

        functionDeclaration: {
            OPERATOR: '&&',
            SEGMENTS: [
                'VAL__functionKeyword',
                'functionName',
                'NL*',
                'functionParamDeclaration',
                'NL*',
                'statementBlock',
            ],
        },
        functionParamDeclaration: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'functionParams?', 'VAL__PAREN_R'] },
        functionParams: { OPERATOR: '&&', SEGMENTS: ['functionParam', 'functionParamExtra*'] },
        functionParam: { OPERATOR: '&&', SEGMENTS: ['variableCast?', 'variableReference'] },
        functionParamExtra: { OPERATOR: '&&', SEGMENTS: ['functionParamSeparator', 'functionParam'] },
        functionParamSeparator: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA'] },

        variableExpression: { OPERATOR: '&&', SEGMENTS: ['variableReference', 'variableAssignment?'] },
        variableAssignment: { OPERATOR: '&&', SEGMENTS: ['variableAssignmentOperator', 'variableCast?', 'conditionalExpression'] },
        variableAssignmentOperator: { OPERATOR: '||', SEGMENTS: ['VAL__EQ', 'plusEqualsOperator'] },
        variableCast: { OPERATOR: '&&', SEGMENTS: ['VAL__SQBRAC_L', 'variableType', 'VAL__SQBRAC_R'] },
        variableType: { OPERATOR: '||', SEGMENTS: ['VAL__guidKeyword', 'VAL__stringKeyword', 'VAL__intKeyword', 'VAL__switchKeyword'] },

        functionExpression: { OPERATOR: '&&', SEGMENTS: ['functionName', 'functionArgs'] },
        functionArgs: { OPERATOR: '||', SEGMENTS: ['functionArgsInParen', 'functionArgsInline'] },
        functionArgsInParen: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'functionParenArgs?', 'VAL__PAREN_R'] },
        functionArgsInline: { OPERATOR: '&&', SEGMENTS: ['functionArg*', 'functionNamedArg*'] },
        functionArg: { OPERATOR: '&&', SEGMENTS: ['argumentValue'] },
        functionNamedArg: { OPERATOR: '&&', SEGMENTS: ['FNL*', 'functionNamedArgMarker?', 'argumentName', 'functionNamedArgValue?'] },
        functionNamedArgMarker: { OPERATOR: '||', SEGMENTS: ['VAL__DASH', 'VAL__SLASH'] },
        functionNamedArgValue: { OPERATOR: '&&', SEGMENTS: ['argumentSeparator?', 'argumentValue'] },
        functionName: { OPERATOR: '&&', SEGMENTS: ['VAL__functionName'] },

        functionParenArgs: { OPERATOR: '&&', SEGMENTS: ['functionParenArg', 'functionParenArgExtra'] },
        functionParenArg: { OPERATOR: '||', SEGMENTS: ['literal', 'variableName'] },
        functionParenArgExtra: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'functionParenArg'] },

        argumentName: { OPERATOR: '&&', SEGMENTS: ['VAL__argumentName'] },
        argumentSeparator: { OPERATOR: '||', SEGMENTS: ['VAL__SPACE', 'VAL__COLON', 'VAL__EQ'] },
        argumentValue: { OPERATOR: '||', SEGMENTS: ['literal', 'variableReference'] },

        ifStatement: {
            OPERATOR: '&&',
            SEGMENTS: [
                'VAL__ifKeyword',
                'NL*',
                'statementCondition',
                'NL*',
                'statementBlock',
                'elseIfStatement*',
                'elseStatement?',
            ],
        },
        elseIfStatement: {
            OPERATOR: '&&',
            SEGMENTS: ['NL*', 'VAL__elseIfKeyword', 'NL*', 'statementCondition', 'NL*', 'statementBlock'],
        },
        elseStatement: { OPERATOR: '&&', SEGMENTS: ['NL*', 'VAL__elseKeyword', 'NL*', 'statementBlock'] },
        statementCondition: { OPERATOR: '&&', SEGMENTS: ['VAL__PAREN_L', 'conditionalExpression', 'VAL__PAREN_R'] },

        conditionalExpression: { OPERATOR: '&&', SEGMENTS: ['condition', 'extraCondition*'] },
        conditionalExpressionInParen: {
            OPERATOR: '&&',
            SEGMENTS: ['VAL__PAREN_L', 'conditionalExpression', 'VAL__PAREN_R', 'variableObjectAccess*'],
        },
        condition: { OPERATOR: '||', SEGMENTS: ['notComparisonExpression', 'comparisonExpression'] },
        extraCondition: { OPERATOR: '&&', SEGMENTS: ['conditionSeparator', 'condition'] },
        conditionSeparator: { OPERATOR: '||', SEGMENTS: ['VAL__orKeyword', 'VAL__andKeyword'] },
        notComparisonExpression: { OPERATOR: '&&', SEGMENTS: ['notOperator', 'conditionalExpression'] },
        comparisonExpression: { OPERATOR: '&&', SEGMENTS: ['comparisonArgument', 'comparisonExpressionRight?'] },
        comparisonExpressionRight: { OPERATOR: '&&', SEGMENTS: ['comparisonOperator', 'comparisonArgument'] },
        comparisonArgument: {
            OPERATOR: '||',
            SEGMENTS: ['conditionalExpressionInParen', 'literal', 'variableReference', 'functionExpression'],
        },
        comparisonOperator: { OPERATOR: '||', SEGMENTS: ['eqOperator', 'neOperator'] },

        variableReference: { OPERATOR: '&&', SEGMENTS: ['variableName', 'variableObjectAccess*'] },
        variableName: { OPERATOR: '&&', SEGMENTS: ['VAL__DOLLAR', 'variableGlobalModifier?', 'VAL__variableName'] },
        variableGlobalModifier: { OPERATOR: '&&', SEGMENTS: ['VAL__globalKeyword', 'VAL__COLON'] },
        variableObjectAccess: { OPERATOR: '||', SEGMENTS: ['variableIndexAccess', 'variableKeyAccess'] },
        variableIndexAccess: { OPERATOR: '&&', SEGMENTS: ['VAL__SQBRAC_L', 'variableIndexAccessExpression', 'VAL__SQBRAC_R'] },
        variableIndexAccessExpression: { OPERATOR: '||', SEGMENTS: ['literal'] },
        variableKeyAccess: { OPERATOR: '&&', SEGMENTS: ['VAL__DOT', 'variableKeyAccessExpression'] },
        variableKeyAccessExpression: { OPERATOR: '||', SEGMENTS: ['conditionalExpression', 'VAL__reference'] },

        literal: {
            OPERATOR: '||',
            SEGMENTS: ['booleanLiteral', 'pathLiteral', 'arrayLiteral', 'stringLiteral', 'versionLiteral', 'numericLiteral', 'nullLiteral'],
        },
        pathLiteral: { OPERATOR: '&&', SEGMENTS: ['pathRoot', 'VAL__COLON', 'pathChild*', 'VAL__SLASH?'] },
        pathRoot: { OPERATOR: '&&', SEGMENTS: ['VAL__driveName'] },
        pathChild: { OPERATOR: '&&', SEGMENTS: ['VAL__SLASH', 'pathChildName'] },
        pathChildName: { OPERATOR: '&&', SEGMENTS: ['VAL__pathChildName'] },
        arrayLiteral: { OPERATOR: '&&', SEGMENTS: ['VAL__AT', 'VAL__PAREN_L', 'arrayEntries?', 'NL*', 'VAL__PAREN_R'] },
        arrayEntries: { OPERATOR: '&&', SEGMENTS: ['arrayEntry', 'arrayEntryExtra*'] },
        arrayEntry: { OPERATOR: '&&', SEGMENTS: ['NL*', 'conditionalExpression'] },
        arrayEntryExtra: { OPERATOR: '&&', SEGMENTS: ['VAL__COMMA', 'arrayEntry'] },
        stringLiteral: { OPERATOR: '||', SEGMENTS: ['singleQuotedStringLiteral', 'doubleQuotedStringLiteral'] },
        singleQuotedStringLiteral: { OPERATOR: '&&', SEGMENTS: ['VAL__SQUOTE', 'VAL__singleQuotedString', 'VAL__SQUOTE'] },
        doubleQuotedStringLiteral: { OPERATOR: '&&', SEGMENTS: ['VAL__DQUOTE', 'VAL__doubleQuotedString', 'VAL__DQUOTE'] },
        booleanLiteral: { OPERATOR: '||', SEGMENTS: ['VAL__trueKeyword', 'VAL__falseKeyword'] },
        intLiteral: { OPERATOR: '&&', SEGMENTS: ['VAL__int'] },
        numericLiteral: { OPERATOR: '&&', SEGMENTS: ['VAL__numeric'] },
        versionLiteral: { OPERATOR: '&&', SEGMENTS: ['VAL__version'] },
        nullLiteral: { OPERATOR: '&&', SEGMENTS: ['VAL__nullKeyword'] },

        NL: { OPERATOR: '&&', SEGMENTS: ['VAL__NEW_LINE'] },
        FNL: { OPERATOR: '&&', SEGMENTS: ['VAL__BACKTICK', 'VAL__NEW_LINE'] },

        inlineComment: { OPERATOR: '&&', SEGMENTS: ['VAL__HASH', 'VAL__comment'] },

        neOperator: { OPERATOR: '||', SEGMENTS: ['VAL__neKeyword', 'neOperator2'] },
        neOperator2: { OPERATOR: '&&', SEGMENTS: ['VAL__EXCLAM', 'VAL__EQ'] },
        eqOperator: { OPERATOR: '||', SEGMENTS: ['VAL__eqKeyword', 'eqOperator2'] },
        eqOperator2: { OPERATOR: '&&', SEGMENTS: ['VAL__EQ', 'VAL__EQ'] },
        notOperator: { OPERATOR: '||', SEGMENTS: ['VAL__notKeyword', 'VAL__EXCLAM'] },
        plusEqualsOperator: { OPERATOR: '&&', SEGMENTS: ['VAL__PLUS', 'VAL__EQ'] },

        VAL__driveName: { OPERATOR: '==', VALUE: '[A-Za-z]+' },
        VAL__pathChildName: { OPERATOR: '==', VALUE: '[A-Za-z0-9!$*._-]+' },
        VAL__comment: { OPERATOR: '==', VALUE: '.*' },
        VAL__reference: { OPERATOR: '==', VALUE: '[A-Za-z0-9._-]+' },
        VAL__functionName: { OPERATOR: '==', VALUE: '[A-Za-z0-9_-]+' },
        VAL__argumentName: { OPERATOR: '==', VALUE: '[A-Za-z0-9_-]+' },
        VAL__variableName: { OPERATOR: '==', VALUE: '[A-Za-z0-9_-]+' },
        VAL__numeric: { OPERATOR: '==', VALUE: '-?[1-9][0-9]*(?:.[0-9]+)' },
        VAL__int: { OPERATOR: '==', VALUE: '-?[1-9][0-9]*' },
        VAL__version: { OPERATOR: '==', VALUE: '[0-9.]+' },
        VAL__singleQuotedString: { OPERATOR: '==', VALUE: "[^']+" },
        VAL__doubleQuotedString: { OPERATOR: '==', VALUE: '[^"]+' },

        VAL__outNullKeyword: { OPERATOR: '==', VALUE: 'Out-Null', CASE_INSENSITIVE: true },
        VAL__outDefaultKeyword: { OPERATOR: '==', VALUE: 'Out-Default', CASE_INSENSITIVE: true },
        VAL__notKeyword: { OPERATOR: '==', VALUE: '-not', CASE_INSENSITIVE: true },
        VAL__tryKeyword: { OPERATOR: '==', VALUE: 'try', CASE_INSENSITIVE: true },
        VAL__catchKeyword: { OPERATOR: '==', VALUE: 'catch', CASE_INSENSITIVE: true },
        VAL__eqKeyword: { OPERATOR: '==', VALUE: '-eq', CASE_INSENSITIVE: true },
        VAL__neKeyword: { OPERATOR: '==', VALUE: '-ne', CASE_INSENSITIVE: true },
        VAL__inKeyword: { OPERATOR: '==', VALUE: 'in', CASE_INSENSITIVE: true },
        VAL__forEachKeyword: { OPERATOR: '==', VALUE: 'foreach', CASE_INSENSITIVE: true },
        VAL__functionKeyword: { OPERATOR: '==', VALUE: 'function', CASE_INSENSITIVE: true },
        VAL__switchKeyword: { OPERATOR: '==', VALUE: 'switch', CASE_INSENSITIVE: true },
        VAL__intKeyword: { OPERATOR: '==', VALUE: 'int', CASE_INSENSITIVE: true },
        VAL__stringKeyword: { OPERATOR: '==', VALUE: 'string', CASE_INSENSITIVE: true },
        VAL__guidKeyword: { OPERATOR: '==', VALUE: 'guid', CASE_INSENSITIVE: true },
        VAL__globalKeyword: { OPERATOR: '==', VALUE: 'global', CASE_INSENSITIVE: true },
        VAL__ifKeyword: { OPERATOR: '==', VALUE: 'if', CASE_INSENSITIVE: true },
        VAL__elseIfKeyword: { OPERATOR: '==', VALUE: 'elseif', CASE_INSENSITIVE: true },
        VAL__elseKeyword: { OPERATOR: '==', VALUE: 'else', CASE_INSENSITIVE: true },
        VAL__orKeyword: { OPERATOR: '==', VALUE: '-or', CASE_INSENSITIVE: true },
        VAL__andKeyword: { OPERATOR: '==', VALUE: '-and', CASE_INSENSITIVE: true },
        VAL__trueKeyword: { OPERATOR: '==', VALUE: '[$]true', CASE_INSENSITIVE: true },
        VAL__falseKeyword: { OPERATOR: '==', VALUE: '[$]false', CASE_INSENSITIVE: true },
        VAL__nullKeyword: { OPERATOR: '==', VALUE: '[$]null', CASE_INSENSITIVE: true },
    },
    // Dependent On:
    [require('./base')]
);

// ******************************
