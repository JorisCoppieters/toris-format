'use strict'; // JS: ES5

// ******************************
//
//
// SCSS OUTPUT FILE
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var cprint = require('color-print');
var utils = require('../src/utils');
var regexp_shorthand = require('../regexp/shorthand');

// ******************************
// Exposing Functions:
// ******************************

var r_A = regexp_shorthand.r_A;
var r_AG = regexp_shorthand.r_AG;
var r_W = regexp_shorthand.r_W;
var r_S = regexp_shorthand.r_S;
var r_w = regexp_shorthand.r_w;
var r_g = regexp_shorthand.r_g;
var r_v = regexp_shorthand.r_v;
var r_dq = regexp_shorthand.r_dq;
var r_sq = regexp_shorthand.r_sq;

// ******************************
// Globals:
// ******************************

var g_DEBUG = false;
var g_FORMAT_PROPERTY_VALUES_ON_NEWLINES = [];

// ******************************
// Setup Functions:
// ******************************

function setup (in_config) {
    if (!in_config) {
        return;
    }

    g_DEBUG = utils.get_setup_property(in_config, "debug", g_DEBUG);
    g_FORMAT_PROPERTY_VALUES_ON_NEWLINES = utils.get_setup_property(in_config, "format_property_values_on_newlines", g_FORMAT_PROPERTY_VALUES_ON_NEWLINES);
}

// ******************************
// Output:
// ******************************

function get_definition_output (in_definition_key, in_definition_value, in_state, in_config) {
    setup(in_config);

    var state = in_state || { LAST_TOKEN: '' };

    var definition_key = in_definition_key;
    var definition_value = (in_definition_value || '').trim();
    var whitespace_matches = (in_definition_value || '').match(new RegExp('^' + r_v(r_W), 'i'));
    var whitespace_before = '';
    var whitespace_before_includes_newline = false;
    var whitespace_before_includes_double_newline = false;
    if (whitespace_matches) {
        whitespace_before = whitespace_matches[1];
        whitespace_before_includes_newline = whitespace_before.match(/^[\s]*?(\n|\r\n?)[\s]*?$/);
        whitespace_before_includes_double_newline = whitespace_before.match(/^[\s]*?(\n|\r\n?)[\s]*?(\n|\r\n?)[\s]*?$/);
    }

    var append = definition_value;
    var color_func = false;
    var newline = false;
    var double_newline = false;
    var space_before = true;
    var pre_indent = 0;
    var post_indent = 0;
    var last_token = false;

    if (definition_key) {
        if (definition_key.match(/DECLARATION_.*/)) {
            state.DECLARATION_TYPE = definition_key;
            state.VALUE_TYPE = false;
        } else if (definition_key.match(/TYPE_.*/)) {
            state.VALUE_TYPE = definition_key;
        }
    }

    switch (definition_key) {

        // Declaration Types:
        case 'url':
            state.DECLARATION_TYPE = 'URL';
            state.VALUE_TYPE = false;
            break;
        case 'importDeclaration':
            state.DECLARATION_TYPE = 'IMPORT';
            state.VALUE_TYPE = false;
            break;
        case 'ifDeclaration':
            state.DECLARATION_TYPE = 'IF';
            state.VALUE_TYPE = false;
            break;
        case 'elseIfDeclaration':
            state.DECLARATION_TYPE = 'ELSE_IF';
            state.VALUE_TYPE = false;
            break;
        case 'elseDeclaration':
            state.DECLARATION_TYPE = 'ELSE';
            state.VALUE_TYPE = false;
            break;
        case 'includeDeclaration':
            state.DECLARATION_TYPE = 'INCLUDE';
            state.VALUE_TYPE = false;
            break;
        case 'functionDeclaration':
            state.DECLARATION_TYPE = 'FUNCTION';
            state.VALUE_TYPE = false;
            break;
        case 'returnDeclaration':
            state.DECLARATION_TYPE = 'RETURN';
            state.VALUE_TYPE = false;
            break;
        case 'fontFaceDeclaration':
            state.DECLARATION_TYPE = 'FONT_FACE';
            state.VALUE_TYPE = false;
            break;
        case 'mixinDeclaration':
            state.DECLARATION_TYPE = 'MIXIN';
            state.VALUE_TYPE = false;
            break;
        case 'eachDeclaration':
            state.DECLARATION_TYPE = 'EACH';
            state.VALUE_TYPE = false;
            break;
        case 'mediaDeclaration':
            state.DECLARATION_TYPE = 'MEDIA';
            state.VALUE_TYPE = false;
            break;
        case 'pageDeclaration':
            state.DECLARATION_TYPE = 'PAGE';
            state.VALUE_TYPE = false;
            break;
        case 'extendDeclaration':
            state.DECLARATION_TYPE = 'EXTEND';
            state.VALUE_TYPE = false;
            break;
        case 'nested':
            state.DECLARATION_TYPE = 'NESTED';
            state.VALUE_TYPE = false;
            break;
        case 'variableDeclaration':
            state.DECLARATION_TYPE = 'VARIABLE';
            state.VALUE_TYPE = false;
            break;
        case 'variableDeclarationValues':
            state.DECLARATION_TYPE = 'VARIABLE_VALUES';
            state.VALUE_TYPE = false;
            break;
        case 'functionCall':
            if (state.MULTI_LINE_FUNCTION && state.MULTI_LINE_FUNCTION_PAREN_DEPTH === 1) {
                state.DECLARATION_TYPE = 'MULTI_LINE_FUNCTION_CALL';
                state.VALUE_TYPE = 'MULTI_LINE_FUNCTION_CALL';
            } else {
                state.DECLARATION_TYPE = 'FUNCTION_CALL';
                state.VALUE_TYPE = 'FUNCTION_CALL';
            }
            break;
        case 'functionCallStart':
            if (state.MULTI_LINE_FUNCTION) {
                state.DECLARATION_TYPE = 'MULTI_LINE_FUNCTION_START';
            } else {
                state.DECLARATION_TYPE = 'FUNCTION_START';
            }
            break;
        case 'functionCallEnd':
            if (state.MULTI_LINE_FUNCTION) {
                state.DECLARATION_TYPE = 'MULTI_LINE_FUNCTION_END';
            } else {
                state.DECLARATION_TYPE = 'FUNCTION_END';
            }
            break;
        case 'functionCallArguments':
            if (state.MULTI_LINE_FUNCTION && state.MULTI_LINE_FUNCTION_PAREN_DEPTH === 1) {
                state.DECLARATION_TYPE = 'MULTI_LINE_FUNCTION_CALL_ARGUMENTS';
                state.VALUE_TYPE = false;
            } else {
                state.DECLARATION_TYPE = 'FUNCTION_CALL_ARGUMENTS';
                state.VALUE_TYPE = false;
            }
            break;
        case 'hashBlock':
            state.DECLARATION_TYPE = 'HASH_BLOCK';
            state.VALUE_TYPE = false;
            break;
        case 'hashBlockStart':
            state.DECLARATION_TYPE = 'HASH_BLOCK_START';
            state.VALUE_TYPE = false;
            break;
        case 'hashBlockExpression':
            state.DECLARATION_TYPE = 'HASH_BLOCK_EXPRESSION';
            state.VALUE_TYPE = false;
            break;
        case 'hashBlockEnd':
            state.DECLARATION_TYPE = 'HASH_BLOCK_END';
            state.VALUE_TYPE = false;
            break;
        case 'mapExpressionStart':
            state.DECLARATION_TYPE = 'MAP_EXPRESSION_START';
            state.VALUE_TYPE = false;
            break;
        case 'mapExpressionEnd':
            state.DECLARATION_TYPE = 'MAP_EXPRESSION_END';
            state.VALUE_TYPE = false;
            break;
        case 'mapEntryKey':
            state.DECLARATION_TYPE = 'MAP_ENTRY_KEY';
            state.VALUE_TYPE = false;
            break;
        case 'mapEntryValues':
            state.DECLARATION_TYPE = 'MAP_ENTRY_VALUES';
            state.VALUE_TYPE = false;
            break;
        case 'selector':
        case 'property':
            state.DECLARATION_TYPE = definition_key.toUpperCase();
            state.VALUE_TYPE = definition_key.toUpperCase();
            break;
        case 'expressions3Plus':
        case 'expressions3PlusInParens':
            switch (state.DECLARATION_TYPE) {
                case 'VARIABLE_VALUES':
                    state.DECLARATION_TYPE = 'VARIABLE_VALUES_3PLUS';
                    state.VARIABLE_VALUES_3PLUS = true;
                    state.VARIABLE_VALUES_3PLUS_PAREN_DEPTH = 0;
                    post_indent = 1;
                    break;
            }
            break;

        // Specific Values:
        case 'COLON':
        case 'COLONCOLON':
        case 'DASH':
        case 'DOT':
        case 'COMBINE_COMPARE_AND':
        case 'COMBINE_COMPARE_OR':
        case 'LT':
        case 'LTEQ':
        case 'GTEQ':
        case 'EQ':
        case 'STAR_EQ':
        case 'EQEQ':
        case 'NOTEQ':
        case 'PIPE_EQ':
        case 'TILD_EQ':
        case 'HASH':
        case 'LBRACK':
        case 'RBRACK':
        case 'TIL':
            color_func = cprint.toLightCyan;
            last_token = definition_value;

            if (['SELECTOR'].indexOf(state.VALUE_TYPE) >= 0) {
                double_newline = whitespace_before_includes_double_newline;
                newline = (whitespace_before_includes_newline || [',', '{', ';', '}', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
                color_func = cprint.toLightCyan;
            }

            if (['HASH_BLOCK'].indexOf(state.DECLARATION_TYPE) >= 0 && ['HASH'].indexOf(definition_key) >= 0) {
                newline = (['{', ';', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
            }

            if (['PROPERTY', 'TYPE_KEYFRAMES_ENTRY_PROPERTY'].indexOf(state.LAST_TOKEN) >= 0) {
                space_before = false;
            } else if (['DASH'].indexOf(definition_key) >= 0) {
                space_before = false;
            } else if (['VARIABLE', 'PROPERTY_VALUE'].indexOf(state.VALUE_TYPE) >= 0 && ['COLON'].indexOf(definition_key) >= 0) {
                space_before = false;
            } else if (['MAP_ENTRY_KEY'].indexOf(state.DECLARATION_TYPE) >= 0) {
                space_before = false;
            } else if (['HASH_BLOCK'].indexOf(state.DECLARATION_TYPE) >= 0 && ['OPERATOR', ':', 'MINUS'].indexOf(state.LAST_TOKEN) < 0) {
                space_before = false;
            } else if (['SELECTOR'].indexOf(state.DECLARATION_TYPE) >= 0 && ['COLON', 'EQ', 'RBRACK'].indexOf(definition_key) >= 0) {
                space_before = false;
            } else if (['SELECTOR'].indexOf(state.DECLARATION_TYPE) >= 0 && ['LBRACK'].indexOf(definition_key) >= 0 && state.VALUE_TYPE !== 'SELECTOR_PREFIX') {
                space_before = false;
            } else if (['SELECTOR'].indexOf(state.DECLARATION_TYPE) >= 0 && !whitespace_before) {
                space_before = false;
            }
            break;

        case 'AT_EACH':
        case 'AT_FOR':
        case 'FUNCTION':
        case 'AT_IF':
        case 'IF':
        case 'AND_LITERAL':
        case 'OR_LITERAL':
        case 'IMPORT':
        case 'INCLUDE':
        case 'VAL_KEYFRAMES':
        case 'MEDIA':
        case 'FONT_FACE':
        case 'MIXIN':
        case 'EXTEND':
        case 'PAGE':
        case 'RETURN':
            double_newline = whitespace_before_includes_double_newline;
            newline = (whitespace_before_includes_newline || [';', '{', ',', '}', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
            color_func = cprint.toCyan;
            last_token = definition_value;
            break;

        case 'AT_ELSE':
            color_func = cprint.toCyan;
            last_token = definition_value;
            break;

        case 'FROM':
        case 'THROUGH':
        case 'IN':
            color_func = cprint.toCyan;
            last_token = definition_value.toUpperCase();
            break;

        case 'BlockStart':
            last_token = '{';
            post_indent = 1;
            color_func = cprint.toWhite;

            switch (state.DECLARATION_TYPE) {
                case 'HASH_BLOCK_START':
                    space_before = false;
                    break;
            }
            break;

        case 'BlockEndSemi':
        case 'BlockEnd':
            last_token = '}';
            if (definition_key === 'BlockEndSemi') {
                append = '}';
            }
            pre_indent = -1;
            newline = true;
            color_func = cprint.toWhite;

            switch (state.VALUE_TYPE) {
                case 'TYPE_KEYFRAMES_ENTRY_END':
                    newline = false;
                    break;

                default:
                    switch (state.DECLARATION_TYPE) {

                        case 'HASH_BLOCK_EXPRESSION':
                            newline = false;
                            space_before = false;
                            break;

                        case 'HASH_BLOCK_END':
                            newline = false;
                            space_before = false;
                            state.DECLARATION_TYPE = 'HASH_BLOCK_AFTER';
                            break;
                    }
            }
            break;

        case 'LPAREN':
            if (['FUNCTION_CALL', 'MULTI_LINE_FUNCTION_CALL', 'SELECTOR', 'MINUS', 'URL'].indexOf(state.LAST_TOKEN) >= 0) {
                space_before = false;
            }

            if (['INCLUDE', 'MEDIA', 'MIXIN', 'PAGE', 'FUNCTION', 'RETURN'].indexOf(state.DECLARATION_TYPE) >= 0) {
                space_before = false;
            }

            if (['('].indexOf(state.LAST_TOKEN) >= 0 && ['IF'].indexOf(state.DECLARATION_TYPE) >= 0) {
                space_before = false;
            }

            if (state.DECLARATION_TYPE === 'MAP_EXPRESSION_START') {
                post_indent = 1;
            }

            if (state.MULTI_LINE_FUNCTION) {
                state.MULTI_LINE_FUNCTION_PAREN_DEPTH += 1;
            }

            if (state.VARIABLE_VALUES_3PLUS) {
                state.VARIABLE_VALUES_3PLUS_PAREN_DEPTH += 1;
            }

            color_func = cprint.toMagenta;
            last_token = '(';
            break;
        case 'RPAREN':
            space_before = false;

            if (state.DECLARATION_TYPE === 'MAP_EXPRESSION_END') {
                newline = true;
                pre_indent = -1;
            }

            if (state.MULTI_LINE_FUNCTION) {
                state.MULTI_LINE_FUNCTION_PAREN_DEPTH -= 1;
                if (state.MULTI_LINE_FUNCTION_PAREN_DEPTH === 0) {
                    newline = true;
                    state.MULTI_LINE_FUNCTION = false;
                    pre_indent = -1;
                }
            }

            if (state.VARIABLE_VALUES_3PLUS) {
                state.VARIABLE_VALUES_3PLUS_PAREN_DEPTH -= 1;
                if (state.VARIABLE_VALUES_3PLUS_PAREN_DEPTH === 0) {
                    newline = true;
                    state.VARIABLE_VALUES_3PLUS = false;
                    pre_indent = -1;
                }
            }

            color_func = cprint.toMagenta;
            last_token = ')';
            break;

        case 'NOSEMI':
        case 'SEMI':
            append = ';';
            if (state.LAST_TOKEN === ';') {
                append = false;
            }

            if (state.VARIABLE_VALUES_3PLUS) {
                if (state.VARIABLE_VALUES_3PLUS_PAREN_DEPTH === 0) {
                    state.VARIABLE_VALUES_3PLUS = false;
                    pre_indent = -1;
                }
            }

            space_before = false;
            color_func = cprint.toLightMagenta;
            last_token = ';';
            break;

        case 'extraComma':
            state.LAST_TOKEN = 'IGNORE:,';
            break;
        case 'COMMA':
            if (state.LAST_TOKEN === 'IGNORE:,') {
                state.LAST_TOKEN = false;
                append = false;
                break;
            }

            space_before = false;
            color_func = cprint.toWhite;
            last_token = ',';
            break;

        case 'COMMENT':
            double_newline = whitespace_before_includes_double_newline;
            newline = (whitespace_before_includes_newline || ['SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
            color_func = cprint.toDarkGrey;
            last_token = 'MULTI_LINE_COMMENT';
            break;
        case 'SL_COMMENT':
            double_newline = whitespace_before_includes_double_newline;
            newline = (whitespace_before_includes_newline || ['SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
            color_func = cprint.toDarkGrey;
            last_token = 'SINGLE_LINE_COMMENT';
            break;
        case 'IMPORTANT':
            color_func = cprint.toLightRed;
            last_token = 'IMPORTANT';
            break;

        case 'Number':
        case 'True':
        case 'False':
        case 'Color':
        case 'RGB_VAL':
        case 'STRING_SINGLE_QUOTED':
        case 'STRING_DOUBLE_QUOTED':
        case 'UrlVal':
        case 'UrlStartVal':
            last_token = 'VALUE';

            switch (state.DECLARATION_TYPE) {

                case 'DECLARATION_KEYFRAMES':

                case 'INCLUDE':
                case 'MIXIN':
                case 'FUNCTION_END':
                case 'HASH_BLOCK_EXPRESSION':
                case 'MAP_ENTRY_VALUES':
                case 'SELECTOR':
                case 'VARIABLE_VALUES':
                    if (['(', '=', '==', '!=', '|=', '*=', '~='].indexOf(state.LAST_TOKEN) >= 0) {
                        space_before = false;
                    } else if (['MINUS'].indexOf(state.LAST_TOKEN) >= 0 && ['OPERATOR', ':', '('].indexOf(state.SECOND_TO_LAST_TOKEN) >= 0) {
                        space_before = false;
                    }

                    if (definition_value === '0') {
                        last_token = '0'
                    }

                    color_func = cprint.toYellow;
                    break;

                case 'PROPERTY':
                    if (['MINUS'].indexOf(state.LAST_TOKEN) >= 0 && ['OPERATOR', ':', '('].indexOf(state.SECOND_TO_LAST_TOKEN) >= 0) {
                        space_before = false;
                    } else if (['('].indexOf(state.LAST_TOKEN) >= 0) {
                        space_before = false;
                    }
                    color_func = cprint.toYellow;
                    break;

                case 'FUNCTION_CALL_ARGUMENTS':
                    if (['('].indexOf(state.LAST_TOKEN) >= 0) {
                        space_before = false;
                    }
                    color_func = cprint.toYellow;
                    break;

                case 'IF':
                    if (['('].indexOf(state.LAST_TOKEN) >= 0) {
                        space_before = false;
                    }
                    color_func = cprint.toYellow;
                    break;

                case 'URL':
                    switch (definition_key) {
                        case 'UrlStartVal':
                            last_token = 'URL';
                            color_func = cprint.toLightCyan;
                            break;

                        case 'UrlVal':
                        case 'STRING_SINGLE_QUOTED':
                        case 'STRING_DOUBLE_QUOTED':
                            space_before = false;
                            color_func = cprint.toYellow;
                            break;
                    }
                    break;

                case 'VARIABLE_VALUES_3PLUS':
                    newline = (['(', ':', ',', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
                    color_func = cprint.toYellow;
                    break;

                case 'MULTI_LINE_FUNCTION_CALL_ARGUMENTS':
                case 'MULTI_LINE_FUNCTION_END':
                    newline = (state.LAST_TOKEN === ',');
                    color_func = cprint.toYellow;
                    break;

                case 'IMPORT':
                    newline = (state.LAST_TOKEN !== '@import');
                    color_func = cprint.toYellow;
                    last_token = 'IMPORT';
                    break;

                case 'MAP_ENTRY_KEY':
                    newline = true;
                    color_func = cprint.toGreen;
                    last_token = 'MAP_ENTRY_KEY';
                    break;

                default:
                    if (g_DEBUG) {
                        append = state.DECLARATION_TYPE + ':' + state.VALUE_TYPE + ':' + definition_key;
                        color_func = cprint.toBackgroundYellow;
                    }
                    break;

            }
            break;

        // Value Types For Generic Values:
        case 'MEASUREMENT':
        case 'BOOLEAN':
            state.VALUE_TYPE = definition_key;
            break;

        case 'selectorPrefix':
            state.VALUE_TYPE = 'SELECTOR_PREFIX';
            break;
        case 'mathCharacter':
            state.VALUE_TYPE = 'OPERATOR';
            break;
        case 'StringLiteral':
            if (state.DECLARATION_TYPE === 'VARIABLE_VALUES_3PLUS') {
                state.VALUE_TYPE = 'STRING_3PLUS';
            } else {
                state.VALUE_TYPE = 'STRING';
            }
            break;
        case 'colonValues':
            state.VALUE_TYPE = 'PROPERTY_VALUE';
            break;
        case 'variableName':
            state.VALUE_TYPE = 'VARIABLE';
            break;

        // Generic Values:
        case 'VAL_MEASUREMENT':

        case 'PLUS':
        case 'MINUS':
        case 'DIV':
        case 'TIMES':
        case 'GT':
        case 'PERC':
        case 'AND':
        case 'DOLLAR':
        case 'PathIdentifier':
        case 'Identifier':
            last_token = state.VALUE_TYPE;

            switch (state.VALUE_TYPE) {

                case 'TYPE_KEYFRAMES_IDENTIFIER':
                    color_func = cprint.toWhite;
                    break;

                case 'TYPE_KEYFRAMES_ENTRY_KEY':
                    double_newline = whitespace_before_includes_double_newline;
                    newline = (whitespace_before_includes_newline || [';', '}', '{', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
                    color_func = cprint.toGreen;
                    break;

                case 'TYPE_KEYFRAMES_ENTRY_PROPERTY':
                    color_func = cprint.toGreen;
                    break;

                case 'MEASUREMENT':
                    color_func = cprint.toLightGray;

                    if (['FUNCTION_CALL_ARGUMENTS'].indexOf(state.DECLARATION_TYPE) >= 0) {
                        if (['MINUS'].indexOf(state.LAST_TOKEN) >= 0 && ['('].indexOf(state.SECOND_TO_LAST_TOKEN) >= 0) {
                            space_before = false;
                        } else if (['(', 'OPERATOR'].indexOf(state.LAST_TOKEN) >= 0) {
                            space_before = false;
                        }
                    } else if (['(', 'MINUS', 'OPERATOR'].indexOf(state.LAST_TOKEN) >= 0) {
                        space_before = false;
                    }
                    break;

                case 'TYPE_COMPARE_OPERATORS':
                case 'OPERATOR':
                    color_func = cprint.toMagenta;

                    if (['%'].indexOf(definition_value) >= 0) {
                        color_func = cprint.toRed;
                        space_before = false;
                    }

                    if (definition_key === 'MINUS') {
                        space_before = (state.LAST_TOKEN !== '(');
                        last_token = 'MINUS';
                    }
                    break;

                case 'SELECTOR':
                case 'SELECTOR_PREFIX':
                    double_newline = whitespace_before_includes_double_newline;
                    newline = (whitespace_before_includes_newline || ['', ';', '{', ',', '}', 'MULTI_LINE_COMMENT', 'SINGLE_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
                    color_func = cprint.toLightCyan;

                    if (definition_key === 'GT') {
                        if (['>'].indexOf(state.LAST_TOKEN) >= 0) {
                            space_before = false;
                        }
                        last_token = '>';
                    } else if (definition_key === 'AND') {
                        last_token = '&';
                    } else if (definition_key === 'PERC') {
                        last_token = '%';
                    } else {
                        if (['.', '#', '%', ':', '::', '[', '%'].indexOf(state.LAST_TOKEN) >= 0) {
                            space_before = false;
                        }
                        color_func = cprint.toWhite;
                    }
                    break;

                case 'PROPERTY':
                    newline = (state.LAST_TOKEN !== '(');
                    if (['('].indexOf(state.LAST_TOKEN) >= 0) {
                        space_before = false;
                    }
                    color_func = cprint.toGreen;
                    break;

                case 'PROPERTY_VALUE':
                    color_func = cprint.toWhite;
                    break;

                case 'TYPE_CONDITION_VALUE':
                    if (['('].indexOf(state.LAST_TOKEN) >= 0) {
                        space_before = false;
                    }
                    color_func = cprint.toYellow;
                    break;

                case 'VARIABLE':
                    color_func = cprint.toLightBlue;
                    last_token = definition_value;

                    switch (state.DECLARATION_TYPE) {

                        case 'FUNCTION':
                        case 'HASH_BLOCK_AFTER':
                        case 'HASH_BLOCK_END':
                        case 'MULTI_LINE_FUNCTION_CALL_ARGUMENTS':
                        case 'MULTI_LINE_FUNCTION_END':
                        case 'VARIABLE':
                        case 'VARIABLE_VALUES':
                        case 'VARIABLE_VALUES_3PLUS':
                            if (definition_key === 'DOLLAR') {
                                double_newline = whitespace_before_includes_double_newline;
                                newline = (whitespace_before_includes_newline || [';', '{', '}', ',', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
                                if (['{', 'MINUS', '('].indexOf(state.LAST_TOKEN) >= 0) {
                                    space_before = false;
                                }
                                last_token = '$';
                            } else {
                                if (['$', '('].indexOf(state.LAST_TOKEN) >= 0) {
                                    space_before = false;
                                }
                            }
                            break;

                        case 'EACH':
                        case 'FUNCTION_CALL_ARGUMENTS':
                        case 'HASH_BLOCK_EXPRESSION':
                        case 'IF':
                        case 'INCLUDE':
                        case 'MAP_ENTRY_VALUES':
                        case 'MIXIN':
                        case 'PROPERTY':
                            if (definition_key === 'DOLLAR') {
                                if (['{', 'MINUS', '('].indexOf(state.LAST_TOKEN) >= 0) {
                                    space_before = false;
                                }
                                last_token = '$';
                            } else {
                                if (['$', '('].indexOf(state.LAST_TOKEN) >= 0) {
                                    space_before = false;
                                }
                            }
                            break;

                        default:
                            if (g_DEBUG) {
                                append = state.DECLARATION_TYPE + ':' + state.VALUE_TYPE + ':' + definition_key;
                                color_func = cprint.toBackgroundYellow;
                            }
                            break;
                    }
                    break;

                case 'FUNCTION_CALL':
                    color_func = cprint.toLightCyan;

                    if (['{'].indexOf(state.LAST_TOKEN) >= 0) {
                        space_before = false;
                    }

                    if (g_FORMAT_PROPERTY_VALUES_ON_NEWLINES.indexOf(definition_value) >= 0) {
                        state.MULTI_LINE_FUNCTION = true;
                        state.MULTI_LINE_FUNCTION_PAREN_DEPTH = 0;
                        post_indent = 1;
                    }
                    break;

                case 'MULTI_LINE_FUNCTION_CALL':
                    newline = (['', '(', ','].indexOf(state.LAST_TOKEN) >= 0);
                    color_func = cprint.toLightCyan;
                    break;

                case 'STRING':
                    if ([':'].indexOf(state.LAST_TOKEN) >= 0) {
                        space_before = false;
                    }
                    color_func = cprint.toYellow;
                    break;

                case 'STRING_3PLUS':
                    newline = (['(', ':', ',', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
                    color_func = cprint.toYellow;
                    break;

                default:
                    if (state.VALUE_TYPE) {
                        if (g_DEBUG) {
                            append = state.DECLARATION_TYPE + ':' + state.VALUE_TYPE + ':' + definition_key;
                            color_func = cprint.toBackgroundRed;
                        }
                        break;
                    }

                    last_token = state.DECLARATION_TYPE + '_VALUE';
                    switch (state.DECLARATION_TYPE) {

                        case 'FUNCTION':
                        case 'INCLUDE':
                        case 'MEDIA':
                        case 'MIXIN':
                        case 'RETURN':
                            if (['('].indexOf(state.LAST_TOKEN) >= 0) {
                                space_before = false;
                            }
                            color_func = cprint.toCyan;
                            break;

                        case 'EXTEND':
                            if (['Identifier'].indexOf(definition_key) >= 0) {
                                space_before = false;
                            }
                            color_func = cprint.toCyan;
                            break;

                        case 'URL':
                            color_func = cprint.toYellow;
                            break;

                        case 'HASH_BLOCK_EXPRESSION':
                            if (['{'].indexOf(state.LAST_TOKEN) >= 0) {
                                space_before = false;
                            }
                            color_func = cprint.toYellow;
                            break;

                        case 'HASH_BLOCK_AFTER':
                            if (['-', '}'].indexOf(state.LAST_TOKEN) >= 0) {
                                space_before = false;
                            }
                            color_func = cprint.toYellow;
                            break;

                        case 'FUNCTION_CALL_ARGUMENTS':
                            space_before = (state.LAST_TOKEN === 'FUNCTION_CALL_ARGUMENTS_VALUE');
                            color_func = cprint.toYellow;
                            break;

                        case 'MULTI_LINE_FUNCTION_CALL_ARGUMENTS':
                            newline = (['', '(', ',', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
                            space_before = (state.LAST_TOKEN === 'MULTI_LINE_FUNCTION_CALL_ARGUMENTS_VALUE');
                            color_func = cprint.toYellow;
                            break;

                        case 'MULTI_LINE_FUNCTION_END':
                            newline = (['', '(', ',', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
                            space_before = (state.LAST_TOKEN === 'MULTI_LINE_FUNCTION_END_VALUE');
                            color_func = cprint.toYellow;
                            break;

                        case 'MAP_ENTRY_KEY':
                            newline = (['', '(', ',', 'SINGLE_LINE_COMMENT', 'MULTI_LINE_COMMENT'].indexOf(state.LAST_TOKEN) >= 0);
                            color_func = cprint.toYellow;
                            break;

                        default:
                            if (g_DEBUG) {
                                append = state.DECLARATION_TYPE + ':[NO_VALUE]:' + definition_key;
                                color_func = cprint.toBackgroundRed;
                            }
                            break;
                    }
                    break;
            }
            break;
    }

    return {
        append,
        color_func,
        newline,
        double_newline,
        space_before,
        pre_indent,
        post_indent,
        last_token
    };
}

// ******************************
// Exports:
// ******************************

module.exports['get_definition_output'] = get_definition_output;

module.exports['setup'] = setup; // TODO: DEPRECATE EXPORT

// ******************************