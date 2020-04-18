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
            newline = ['VAL__functionKeyword', '.', '|', '=', '(', ')'].indexOf(in_state.LAST_TOKEN) < 0;
            last_token = 'FUNCTION';
            color_func = cprint.toGreen;
            append = correctCase(definition_value, 'function');
            space_before = ['.', '(', ')'].indexOf(in_state.LAST_TOKEN) < 0;
            break;

        case 'VAL__variableName':
            space_before = false;
            last_token = 'VARIABLE';
            color_func = cprint.toWhite;
            append = correctCase(definition_value, 'variable');
            break;

        case 'VAL__argumentName':
            space_before = ['-', '/'].indexOf(in_state.LAST_TOKEN) < 0;
            last_token = 'ARGUMENT';
            color_func = cprint.toWhite;
            append = correctCase(definition_value, 'variable');
            break;

        case 'VAL__comment':
            color_func = cprint.toDarkGray;
            space_before = ['#'].indexOf(in_state.LAST_TOKEN) >= 0;
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
            last_token = definition_key;
            switch (definition_key) {
                case 'VAL__stringKeyword':
                case 'VAL__guidKeyword':
                case 'VAL__switchKeyword':
                case 'VAL__intKeyword':
                    color_func = cprint.toCyan;
                    break;

                case 'VAL__trueKeyword':
                case 'VAL__falseKeyword':
                case 'VAL__nullKeyword':
                    color_func = cprint.toMagenta;
                    space_before = ['='].indexOf(in_state.LAST_TOKEN) >= 0;
                    break;

                case 'VAL__functionKeyword':
                    color_func = cprint.toCyan;
                    double_newline = true;
                    newline = true;
                    break;

                case 'VAL__tryKeyword':
                    double_newline = in_state.LAST_TOKEN === 'NLx2';
                    newline = true;
                    break;

                case 'VAL__catchKeyword':
                    space_before = true;
                    break;

                case 'VAL__forEachKeyword':
                    double_newline = in_state.LAST_TOKEN === 'NLx2';
                    newline = true;
                    break;

                case 'VAL__inKeyword':
                    space_before = true;
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

                case 'VAL__orKeyword':
                case 'VAL__andKeyword':
                case 'VAL__eqKeyword':
                case 'VAL__neKeyword':
                    space_before = true;
                    break;
            }
            break;

        case 'VAL__version':
        case 'VAL__numeric':
            color_func = cprint.toBlue;
            space_before = ['=', 'VAL__eqKeyword', 'VAL__neKeyword', 'FUNCTION'].indexOf(in_state.LAST_TOKEN) >= 0;
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
            space_before = ['ARGUMENT', 'FUNCTION', 'VAL__neKeyword', 'VAL__eqKeyword', '='].indexOf(state.LAST_TOKEN) >= 0;
            break;

        case 'VAL__EXCLAM':
            color_func = cprint.toRed;
            space_before = ['VARIABLE'].indexOf(state.LAST_TOKEN) >= 0;
            last_token = '!';
            break;

        case 'VAL__PIPE':
            color_func = cprint.toCyan;
            space_before = true;
            last_token = '|';
            break;

        case 'VAL__EQ':
            color_func = cprint.toRed;
            space_before = ['=', '!', '+'].indexOf(in_state.LAST_TOKEN) < 0;
            last_token = '=';
            break;

        case 'VAL__PLUS':
            color_func = cprint.toRed;
            space_before = true;
            last_token = '+';
            break;

        case 'VAL__COLON':
            color_func = cprint.toRed;
            space_before = false;
            last_token = ':';
            break;

        case 'VAL__DASH':
            color_func = cprint.toRed;
            last_token = '-';
            break;

        case 'VAL__SLASH':
            color_func = cprint.toRed;
            last_token = '/';
            break;

        case 'VAL__DOT':
            color_func = cprint.toWhite;
            space_before = false;
            last_token = '.';
            break;

        case 'VAL__COMMA':
            color_func = cprint.toRed;
            space_before = false;
            last_token = ',';
            break;

        case 'VAL__HASH':
            color_func = cprint.toDarkGray;
            last_token = '#';
            break;

        case 'VAL__AT':
            color_func = cprint.toRed;
            last_token = '@';
            break;

        case 'VAL__BACKTICK':
            color_func = cprint.toDarkGray;
            last_token = '`';
            space_before = true;
            break;

        case 'VAL__PAREN_L':
            var declaration = in_state.STACK.indexOf('FunctionDeclare') >= 0;
            color_func = cprint.toWhite;
            last_token = definition_value;
            space_before = declaration ?
                ['@'].indexOf(in_state.LAST_TOKEN) < 0 :
                ['FUNCTION', '@'].indexOf(in_state.LAST_TOKEN) < 0;
            break;

        case 'VAL__PAREN_R':
            color_func = cprint.toWhite;
            last_token = definition_value;
            space_before = false;
            break;

        case 'VAL__CURLY_L':
            color_func = cprint.toWhite;
            last_token = '{';
            post_indent++;
            space_before = true;
            break;

        case 'VAL__CURLY_R':
            color_func = cprint.toWhite;
            last_token = '}';
            newline = true;
            pre_indent--;
            space_before = true;
            break;

        case 'VAL__SQBRAC_L':
            color_func = cprint.toCyan;
            last_token = definition_value;
            space_before = [',', '='].indexOf(in_state.LAST_TOKEN) >= 0;
            break;

        case 'VAL__SQBRAC_R':
            color_func = cprint.toCyan;
            last_token = definition_value;
            space_before = false;
            break;

        case 'VAL__DOLLAR':
            color_func = cprint.toWhite;
            space_before = ['(', ']', '!', '.', ':'].indexOf(state.LAST_TOKEN) < 0;
            newline = ['{', 'NL', 'NLx2'].indexOf(state.LAST_TOKEN) >= 0;
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
// Helper Functions:
// ******************************

function correctCase (in_contents, in_type) {
    if (!in_contents.match(/[a-z]/)) {
        return in_contents;
    }

    let parts = in_contents
        .replace(/([A-Z])/g, '_$1')
        .replace(/^_+/,'')
        .split(/[_-]/)
        .map(part => part.substr(0, 1).toUpperCase() + part.substr(1).toLowerCase());

    if (in_type === 'variable') {
        let titleCase = parts.join('');
        return titleCase.substr(0, 1).toLowerCase() + titleCase.substr(1);
    } else if (in_type === 'function') {
        return parts.length > 1 ? parts[0] + '-' + parts.slice(1).join('') : parts[0];
    }

    return '';
}

// ******************************
// Exports:
// ******************************

module.exports['get_definition_output'] = get_definition_output;

// ******************************
