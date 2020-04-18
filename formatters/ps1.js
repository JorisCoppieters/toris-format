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

// ******************************
// Output:
// ******************************

function get_definition_output(in_definition_key, in_definition_value, in_state) {
    var state = in_state || { LAST_TOKEN: '', SECOND_TO_LAST_TOKEN: '' };

    var definition_key = in_definition_key;
    var definition_value = (in_definition_value || '').trim();

    var append = definition_value;
    var color_func = false;
    var newline = false;
    var double_newline = false;
    var space_before = true;
    var pre_indent = 0;
    var post_indent = 0;
    var last_token = definition_value;

    switch (definition_key) {
        case 'VAL__NEW_LINE':
            if (in_state.LAST_TOKEN === 'NLx2' || in_state.LAST_TOKEN === 'NL') {
                last_token = 'NLx2';
            } else {
                last_token = 'NL';
            }
            break;

        case 'VAL__functionName':
            newline = true;
            last_token = 'FUNCTION';
            color_func = cprint.toGreen;
            append = definition_value.toLowerCase();
            break;

        case 'VAL__outNullKeyword':
        case 'VAL__outDefaultKeyword':
        case 'VAL__pipeKeyword':
        case 'VAL__notKeyword':
        case 'VAL__tryKeyword':
        case 'VAL__catchKeyword':
        case 'VAL__eqKeyword':
        case 'VAL__neKeyword':
        case 'VAL__inKeyword':
        case 'VAL__forEachKeyword':
        case 'VAL__functionKeyword':
        case 'VAL__switchKeyword':
        case 'VAL__intKeyword':
        case 'VAL__stringKeyword':
        case 'VAL__guidKeyword':
        case 'VAL__globalKeyword':
        case 'VAL__ifKeyword':
        case 'VAL__elseIfKeyword':
        case 'VAL__elseKeyword':
        case 'VAL__orKeyword':
        case 'VAL__andKeyword':
        case 'VAL__trueKeyword':
        case 'VAL__falseKeyword':
        case 'VAL__nullKeyword':
            color_func = cprint.toRed;
            append = definition_value.toLowerCase();
            space_before = false;
            switch (definition_key) {
                case 'VAL__stringKeyword':
                case 'VAL__guidKeyword':
                case 'VAL__functionKeyword':
                case 'VAL__switchKeyword':
                case 'VAL__intKeyword':
                    color_func = cprint.toCyan;
                    break;

                case 'VAL__trueKeyword':
                case 'VAL__falseKeyword':
                case 'VAL__nullKeyword':
                    color_func = cprint.toMagenta;
                    break;

                case 'VAL__ifKeyword':
                    double_newline = in_state.LAST_TOKEN === 'NLx2';
                    newline = true;
                    break;

                case 'VAL__elseIfKeyword':
                case 'VAL__elseKeyword':
                    double_newline = in_state.LAST_TOKEN === 'NLx2';
                    newline = false;
                    space_before = true;
                    break;
            }
            break;

        case 'VAL__version':
        case 'VAL__numeric':
            color_func = cprint.toBlue;
            space_before = ['='].indexOf(in_state.LAST_TOKEN) >= 0;
            break;

        case 'VAL__doubleQuotedString':
        case 'VAL__singleQuotedString':
            color_func = cprint.toYellow;
            space_before = false;
            last_token = 'STRING';
            break;

        case 'VAL__DQUOTE':
        case 'VAL__SQUOTE':
            color_func = cprint.toYellow;
            last_token = definition_value;
            space_before = ['FUNCTION'].indexOf(state.LAST_TOKEN) >= 0;
            break;

        case 'VAL__EQ':
            color_func = cprint.toRed;
            space_before = in_state.LAST_TOKEN != '=';
            last_token = '=';
            break;

        case 'VAL__PAREN_L':
            color_func = cprint.toWhite;
            last_token = definition_value;
            break;

        case 'VAL__PAREN_R':
            color_func = cprint.toWhite;
            last_token = definition_value;
            space_before = false;
            break;

        case 'VAL__CURLY_L':
            color_func = cprint.toWhite;
            last_token = definition_value;
            post_indent++;
            space_before = true;
            break;

        case 'VAL__CURLY_R':
            color_func = cprint.toWhite;
            last_token = definition_value;
            newline = true;
            pre_indent--;
            space_before = true;
            break;

        case 'VAL__DOLLAR':
            color_func = cprint.toBlue;
            space_before = ['('].indexOf(state.LAST_TOKEN) < 0;
            last_token = definition_value;
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
        last_token,
    };
}

// ******************************
// Exports:
// ******************************

module.exports['get_definition_output'] = get_definition_output;

// ******************************
