'use strict'; // JS: ES5

// ******************************
//
//
// PARSER (HTML)
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var formatter = require('./formatter');
var parser = require('./parser');
var utils = require('./utils');

// ******************************
// Constants:
// ******************************

const FALSE = false;
const TRUE = true;

const k_COMMENT_TOKEN = '[COMMENT]';
const k_CONTENT_TOKEN = '[CONTENT]';
const k_XML_HEADER_TOKEN = '[XML_HEADER]';
const k_NULL_VALUE_TOKEN = '[NULLVALUE]';
const k_NO_VALUE_TOKEN = '[NOVALUE]';

const k_ATTRIBUTE_NAME_CLASS = 'class';

const k_ATTRIBUTE_TYPE_VALUE_BOOLEAN = '[ATTRIBUTE_TYPE_VALUE_BOOLEAN]';
const k_ATTRIBUTE_TYPE_VALUE_NUMERIC = '[ATTRIBUTE_TYPE_VALUE_NUMERIC]';
const k_ATTRIBUTE_TYPE_VALUE_BLOCK = '[ATTRIBUTE_TYPE_VALUE_BLOCK]';
const k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED = '[ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED]';
const k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED = '[ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED]';
const k_ATTRIBUTE_TYPE_VALUE_ACCESSOR_FUNCTION = '[ATTRIBUTE_TYPE_VALUE_ACCESSOR_FUNCTION]';
const k_ATTRIBUTE_TYPE_VALUE_ACCESSOR = '[ATTRIBUTE_TYPE_VALUE_ACCESSOR]';
const k_ATTRIBUTE_TYPE_VALUE_NULL = '[ATTRIBUTE_TYPE_VALUE_NULL]';
const k_ATTRIBUTE_TYPE_VALUE_EMPTY = '[ATTRIBUTE_TYPE_VALUE_EMPTY]';
const k_ATTRIBUTE_TYPE_NO_VALUE = '[ATTRIBUTE_TYPE_NO_VALUE]';

const k_CLASS_TYPE_BINDING = '[CLASS_TYPE_BINDING]';
const k_CLASS_TYPE_NORMAL = '[CLASS_TYPE_NORMAL]';

const k_NG2_ATTRIBUTE_TYPE_REFERENCE = '[NG2_ATTRIBUTE_TYPE_REFERENCE]';
const k_NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY = '[NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY]';
const k_NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY = '[NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY]';
const k_NG2_ATTRIBUTE_TYPE_BINDING_EVENT = '[NG2_ATTRIBUTE_TYPE_BINDING_EVENT]';
const k_NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE = '[NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE]';

// ******************************
// RegEx Shorthand:
// ******************************

var r_A = '[\\s\\S]*?'; // RegEx: Any (Not Greedy)
var r_AG = '[\\s\\S]*'; // RegEx: Any (Greedy)
var r_W = '[\\s]*'; // RegEx: Optional Whitepsace
var r_S = '[\\s]+'; // RegEx: Whitepsace

// ******************************

function r_w(in_re) {
    // RegEx: Whitespace around
    return r_W + in_re + r_W;
}

// ******************************

function r_g(in_re) {
    // RegEx: Group
    return '(?:' + in_re + ')';
}

// ******************************

function r_v(in_re) {
    // RegEx: Variable
    return '(' + in_re + ')';
}

// ******************************

function r_dq(in_re) {
    // RegEx: Double Quote
    return r_W + '"' + r_W + in_re + r_W + '"';
}

// ******************************

function r_sq(in_re) {
    // RegEx: Single Quote
    return r_W + "'" + r_W + in_re + r_W + "'";
}

// ******************************
// Globals:
// ******************************

// State:
var g_ELEMENT_STACK = [];
var g_CURRENT_ELEMENT = '';
var g_CURRENT_ELEMENT_ATTRIBUTES = [];
var g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT = [];
var g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE = '';
var g_CURRENT_ELEMENT_CLASSES = [];
var g_CURRENT_ELEMENT_CLASSES_CLASS_NAME = '';
var g_CURRENT_ELEMENT_WHITESPACE_BEFORE = false;

var g_HTML_CONTENT = '';
var g_HTML_INVALID = '';
var g_HTML_LINE_NUMBER = 1;

// Config - Base:
var g_BLOCK_ELEMENTS_BASE = [
    'address',
    'blockquote',
    'center',
    'dir',
    'div',
    'dl',
    'fieldset',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'isindex',
    'menu',
    'noframes',
    'noscript',
    'ol',
    'p',
    'pre',
    'table',
    'ul',
];
var g_INLINE_ELEMENTS_BASE = [
    'a',
    'abbr',
    'acronym',
    'b',
    'basefont',
    'bdo',
    'big',
    'br',
    'cite',
    'code',
    'dfn',
    'em',
    'font',
    'i',
    'img',
    'input',
    'kbd',
    'label',
    'q',
    's',
    'samp',
    'select',
    'small',
    'span',
    'strike',
    'strong',
    'sub',
    'sup',
    'textarea',
    'tt',
    'u',
    'var',
];
var g_ONE_TIME_BOUND_ELEMENT_PREFIXES_BASE = ['ng-'];
var g_SELF_CLOSING_HTML_TAGS_BASE = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

// Config - Indenting:
var g_INDENT_COUNT = 0;
var g_INDENT = '    ';

// Config - HTML:
var g_ADD_NOOPENER_NOREFERRER = false;
var g_ALLOW_ARBITRARY_CLOSING_HTML_TAGS = false;
var g_ALLOW_EMPTY_FILES = false;
var g_ANGULAR_VERSION = 1;
var g_BLOCK_ELEMENTS = g_BLOCK_ELEMENTS_BASE;
var g_CONVERT_LINE_ENDINGS = false;
var g_FORCE_BLOCK_WHITESPACE_FORMATTING = false;
var g_FORCE_INLINE_WHITESPACE_FORMATTING = false;
var g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST = -1;
var g_INLINE_ELEMENTS = g_INLINE_ELEMENTS_BASE;
var g_MULTI_CLASSES_ORDER = [];
var g_NG_ATTRIBUTES_ORDER = [];
var g_NG_ATTRIBUTES_ORDER_PRE_NATIVE = [];
var g_NONE_ONE_TIME_BOUND_ELEMENTS = [];
var g_ONE_TIME_BOUND_ELEMENT_PREFIXES = g_ONE_TIME_BOUND_ELEMENT_PREFIXES_BASE;
var g_REMOVE_CSS = false;
var g_SELF_CLOSING_HTML_TAGS = g_SELF_CLOSING_HTML_TAGS_BASE;

// RegEx:
var t_NL = '\n';
var g_NL = '\r\n';
var g_REGEX_NL = r_g('\\r\\n|\\r|\\n');
var g_REGEX_HTML_STYLE = '<style' + r_A + '>' + r_v(r_A) + '<\\/style>';
var g_REGEX_HTML_COMMENT = '<!--' + r_W + r_v(r_A) + r_W + '-->';
var g_REGEX_HTML_CONTENT = '[^<]+?';
var g_REGEX_HTML_ELEMENT = '[a-z0-9_-]+';
var g_REGEX_HTML_ATTRIBUTE_KEY = '[:a-z0-9_.-]+';
var g_REGEX_HTML_ATTRIBUTE_VALUE = r_A;
var g_REGEX_XML_HEADER = r_v('<\\?xml' + r_A + '\\?>');

// ******************************
// Setup Functions:
// ******************************

function setup(in_config) {
    if (!in_config) {
        return;
    }

    g_ADD_NOOPENER_NOREFERRER = utils.get_setup_property(in_config, 'add_noopener_noreferrer', g_ADD_NOOPENER_NOREFERRER);
    g_ALLOW_EMPTY_FILES = utils.get_setup_property(in_config, 'allow_empty_files', g_ALLOW_EMPTY_FILES);
    g_ALLOW_ARBITRARY_CLOSING_HTML_TAGS = utils.get_setup_property(in_config, 'allow_arbitrary_closing_html_tags', g_ALLOW_ARBITRARY_CLOSING_HTML_TAGS);
    g_ANGULAR_VERSION = utils.get_setup_property(in_config, ['angular_version', 'ng_version'], g_ANGULAR_VERSION);
    g_BLOCK_ELEMENTS = utils.get_setup_property(in_config, 'block_elements', g_BLOCK_ELEMENTS, g_BLOCK_ELEMENTS_BASE);
    g_FORCE_BLOCK_WHITESPACE_FORMATTING = utils.get_setup_property(in_config, 'force_block_whitespace_formatting', g_FORCE_BLOCK_WHITESPACE_FORMATTING);
    g_FORCE_INLINE_WHITESPACE_FORMATTING = utils.get_setup_property(in_config, 'force_inline_whitespace_formatting', g_FORCE_INLINE_WHITESPACE_FORMATTING);
    g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST = utils.get_setup_property(in_config, 'format_multi_classes_with_at_least', g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST);
    g_INDENT = utils.get_setup_property(in_config, 'indent', g_INDENT);
    g_INLINE_ELEMENTS = utils.get_setup_property(in_config, 'inline_elements', g_INLINE_ELEMENTS, g_INLINE_ELEMENTS_BASE);
    g_MULTI_CLASSES_ORDER = utils.get_setup_property(in_config, 'multi_classes_order', g_MULTI_CLASSES_ORDER);
    g_NG_ATTRIBUTES_ORDER = utils.get_setup_property(in_config, 'ng_attributes_order', g_NG_ATTRIBUTES_ORDER);
    g_NG_ATTRIBUTES_ORDER_PRE_NATIVE = utils.get_setup_property(in_config, 'ng_attributes_order_pre_native', g_NG_ATTRIBUTES_ORDER_PRE_NATIVE);
    g_NL = utils.get_setup_property(in_config, 'line_ending', g_NL);
    g_CONVERT_LINE_ENDINGS = utils.get_setup_property(in_config, 'convert_line_endings', g_CONVERT_LINE_ENDINGS);
    g_NONE_ONE_TIME_BOUND_ELEMENTS = utils.get_setup_property(in_config, 'none_one_time_bound_elements', g_NONE_ONE_TIME_BOUND_ELEMENTS);
    g_ONE_TIME_BOUND_ELEMENT_PREFIXES = utils.get_setup_property(in_config, 'one_time_bound_element_prefixes', g_ONE_TIME_BOUND_ELEMENT_PREFIXES, g_ONE_TIME_BOUND_ELEMENT_PREFIXES_BASE);
    g_REMOVE_CSS = utils.get_setup_property(in_config, 'remove_css', g_REMOVE_CSS);
    g_SELF_CLOSING_HTML_TAGS = utils.get_setup_property(in_config, 'self_closing_tags', g_SELF_CLOSING_HTML_TAGS, g_SELF_CLOSING_HTML_TAGS_BASE);
}

// ******************************
// HTML Functions:
// ******************************

function format_html_contents(in_contents, in_indent_count, in_wrap_with_divs) {
    var result = false;

    do {
        var html_content = in_contents || '';
        if (html_content.trim().length === 0) {
            if (g_ALLOW_EMPTY_FILES) {
                return '';
            }
            throw new Error('Empty file!');
        }

        reset_html_variables();

        if (in_indent_count > 0) {
            g_INDENT_COUNT = in_indent_count;
        }

        if (g_CONVERT_LINE_ENDINGS) {
            html_content = html_content.replace(new RegExp(g_REGEX_NL, 'g'), t_NL);
        }

        if (!parse_html(html_content)) {
            if (in_wrap_with_divs) {
                return format_html_contents('<div>' + in_contents + '</div>', in_indent_count, true);
            }

            throw new Error('Unrecognised HTML #' + g_HTML_LINE_NUMBER + ': \n' + g_HTML_INVALID.substr(0, 100) + ' ... ');
        }

        while (g_ELEMENT_STACK.length) {
            var top_element = g_ELEMENT_STACK.pop();
            if ([k_COMMENT_TOKEN, k_XML_HEADER_TOKEN, k_CONTENT_TOKEN].indexOf(top_element) >= 0) {
                continue;
            }

            if (in_wrap_with_divs) {
                return format_html_contents('<div>' + in_contents + '</div>', in_indent_count, true);
            }

            throw new Error('HTML stack still contained element: ' + top_element);
        }

        result = '';

        if (in_indent_count > 0) {
            result += get_indent();
        }

        result += g_HTML_CONTENT;

        if (g_CONVERT_LINE_ENDINGS) {
            result = result.replace(new RegExp(t_NL, 'g'), g_NL);
        }

        reset_html_variables();
    } while (FALSE);

    return result;
}

// ******************************

function parse_html(in_html_content) {
    var result = false;

    var html_content = in_html_content || '';

    var functions = [parse_xml_header, parse_style, parse_html_open_element, parse_html_close_element, parse_comment, parse_content];

    var parse_run = 0;
    var max_parse_runs = 5000;

    try {
        var parsed = true;
        while (parsed) {
            parsed = false;
            parse_run++;

            if (html_content.trim().length === 0) {
                result = true;
                break;
            }

            functions.forEach(function (fn) {
                if (parsed) {
                    return;
                }

                var remaining = fn(html_content);
                if (remaining !== false) {
                    g_HTML_LINE_NUMBER += num_lines(html_content) - num_lines(remaining);
                    html_content = remaining;
                    parsed = true;
                }
            });

            if (parse_run > max_parse_runs) {
                throw new Error('Too many parse runs!');
            }
        }
    } catch (err) {
        g_HTML_INVALID = html_content.substr(0, 200);
        throw new Error('Invalid HTML #' + g_HTML_LINE_NUMBER + ': ' + err);
    }

    return result;
}

// ******************************

function parse_html_open_element(in_html_content) {
    var result = false;

    do {
        var html_content = in_html_content;
        var remaining = parse_html_open_element_start(html_content);
        if (remaining === false) {
            g_HTML_INVALID = html_content;
            result = false;
            break;
        }

        html_content = remaining;
        remaining = parse_html_open_element_end(html_content);
        if (remaining === false) {
            remaining = html_content;
        } else {
            result = remaining;
            break;
        }

        html_content = remaining;
        remaining = parse_html_open_element_attributes(html_content);
        if (remaining === false) {
            remaining = html_content;
        }

        html_content = remaining;
        remaining = parse_html_open_element_end(html_content);

        if (remaining === false) {
            g_HTML_INVALID = html_content;
            result = false;
        } else {
            result = remaining;
        }
    } while (FALSE);

    return result;
}

// ******************************

function parse_html_open_element_start(in_html_content) {
    var result = false;

    do {
        var matches = in_html_content.match(new RegExp('^' + r_v(r_W) + '<' + r_W + r_v(g_REGEX_HTML_ELEMENT) + r_v(r_AG) + '$', 'i'));
        if (!matches) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var whitespace_before = matches.shift() || '';
        var element = (matches.shift() || '').trim();
        var remaining = matches.shift() || '';

        // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+whitespace_before+'~~~'+element+'~~~'+remaining.substr(0,100)+'|------\n');

        g_CURRENT_ELEMENT = element;
        g_CURRENT_ELEMENT_ATTRIBUTES = [];
        g_CURRENT_ELEMENT_WHITESPACE_BEFORE = whitespace_before;

        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function parse_html_open_element_attributes(in_html_content) {
    var result = false;

    var html_content = in_html_content || '';

    var functions = [
        function (in_html_content) {
            return parse_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED);
        },
        function (in_html_content) {
            return parse_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED);
        },
        function (in_html_content) {
            return parse_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_BOOLEAN);
        },
        function (in_html_content) {
            return parse_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_NULL);
        },
        function (in_html_content) {
            return parse_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_EMPTY);
        },
        function (in_html_content) {
            return parse_attribute(in_html_content, k_ATTRIBUTE_TYPE_NO_VALUE);
        },
    ];

    if (g_ANGULAR_VERSION >= 2.0 && g_ANGULAR_VERSION < 3.0) {
        functions = functions.concat([
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_REFERENCE);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_REFERENCE);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_NULL, k_NG2_ATTRIBUTE_TYPE_REFERENCE);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_EMPTY, k_NG2_ATTRIBUTE_TYPE_REFERENCE);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_NO_VALUE, k_NG2_ATTRIBUTE_TYPE_REFERENCE);
            },

            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_BOOLEAN, k_NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_NULL, k_NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_EMPTY, k_NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_NO_VALUE, k_NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY);
            },

            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_NULL, k_NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_EMPTY, k_NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_NO_VALUE, k_NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY);
            },

            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_EVENT);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_EVENT);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_NULL, k_NG2_ATTRIBUTE_TYPE_BINDING_EVENT);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_EMPTY, k_NG2_ATTRIBUTE_TYPE_BINDING_EVENT);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_NO_VALUE, k_NG2_ATTRIBUTE_TYPE_BINDING_EVENT);
            },

            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_NULL, k_NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_EMPTY, k_NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE);
            },
            function (in_html_content) {
                return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_NO_VALUE, k_NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE);
            },
        ]);
    }

    var parsed = true;
    while (parsed) {
        parsed = false;

        if (html_content.trim().length === 0) {
            result = true;
            break;
        }

        functions.forEach(function (fn) {
            if (parsed) {
                return;
            }

            var remaining = fn(html_content);
            if (remaining !== false) {
                html_content = remaining;
                parsed = true;
            }
        });
    }

    result = html_content;

    return result;
}

// ******************************

function parse_attribute(in_html_content, in_attribute_type) {
    var result = false;

    do {
        var regExpString = '^' + r_W + r_v(g_REGEX_HTML_ATTRIBUTE_KEY);

        switch (in_attribute_type) {
            case k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED:
                regExpString += r_W + '=' + r_dq(r_v('\\:\\:') + '?' + r_W + r_v(g_REGEX_HTML_ATTRIBUTE_VALUE));
                break;

            case k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED:
                regExpString += r_W + '=' + r_sq(r_v('\\:\\:') + '?' + r_W + r_v(g_REGEX_HTML_ATTRIBUTE_VALUE));
                break;

            case k_ATTRIBUTE_TYPE_VALUE_BOOLEAN:
                regExpString += r_W + '=' + r_v('(?:true|false)');
                break;

            case k_ATTRIBUTE_TYPE_VALUE_EMPTY:
                regExpString += r_W + '=' + r_dq('');
                break;

            case k_ATTRIBUTE_TYPE_VALUE_NULL:
                regExpString += r_W + '=null';
                break;

            case k_ATTRIBUTE_TYPE_NO_VALUE:
                break;
        }

        regExpString += r_v(r_AG) + '$';

        var matches = in_html_content.match(new RegExp(regExpString, 'i'));
        if (!matches) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var key = matches.shift() || '';
        var val;
        var already_one_time_bound;

        switch (in_attribute_type) {
            case k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED:
            case k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED:
                already_one_time_bound = matches.shift() === '::';
                val = matches.shift() || '';

                var should_be_one_time_bound = key.match(new RegExp('(' + g_ONE_TIME_BOUND_ELEMENT_PREFIXES.join('|') + ').*?'));
                var should_not_be_one_time_bound = g_CURRENT_ELEMENT.match(new RegExp('(' + g_NONE_ONE_TIME_BOUND_ELEMENTS.join('|') + ')'));
                var binding = (should_be_one_time_bound && !should_not_be_one_time_bound) || already_one_time_bound ? '::' : '';

                if (val === '"true"' || val === "'true'" || val === 'true') {
                    val = binding + 'true';
                } else if (val === '"false"' || val === "'false'" || val === 'false') {
                    val = binding + 'false';
                } else if (is_numeric(val)) {
                    val = binding + val;
                } else if (already_one_time_bound) {
                    val = binding + val;
                } else if (val === "''" || val.match(/^'[^']+'$/)) {
                    val = binding + val;
                }
                break;

            case k_ATTRIBUTE_TYPE_VALUE_BOOLEAN:
                val = matches.shift() || '';
                break;

            case k_ATTRIBUTE_TYPE_VALUE_EMPTY:
                val = '';
                break;

            case k_ATTRIBUTE_TYPE_VALUE_NULL:
                val = k_NULL_VALUE_TOKEN;
                break;

            case k_ATTRIBUTE_TYPE_NO_VALUE:
                val = k_NO_VALUE_TOKEN;
                break;
        }

        g_CURRENT_ELEMENT_ATTRIBUTES[key] = val;
        var remaining = matches.shift() || '';

        // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+regExpString+'~~~'+key+'~~~'+already_one_time_bound+'~~~'+val+'~~~'+remaining.substr(0,100)+'|------\n');
        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function parse_ng2_attribute(in_html_content, in_attribute_type, in_ng2_binding_type) {
    var result = false;

    do {
        var regExpString = '^' + r_W;

        switch (in_ng2_binding_type) {
            case k_NG2_ATTRIBUTE_TYPE_REFERENCE:
                regExpString += r_v('#[@:a-z]+');
                break;

            case k_NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY:
                regExpString += r_v('\\[' + '[$@:a-zA-Z0-9._-]+' + '\\]');
                break;

            case k_NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY:
                regExpString += r_v('\\[\\(' + '[$@:a-zA-Z0-9._-]+' + '\\)\\]');
                break;

            case k_NG2_ATTRIBUTE_TYPE_BINDING_EVENT:
                regExpString += r_v('\\(' + '[$@:a-zA-Z0-9._-]+' + '\\)');
                break;

            case k_NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE:
                regExpString += r_v('\\*' + '[@:a-zA-Z0-9._-]+');
                break;
        }

        switch (in_attribute_type) {
            case k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED:
                regExpString += r_W + '=' + r_dq(r_v(g_REGEX_HTML_ATTRIBUTE_VALUE));
                break;

            case k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED:
                regExpString += r_W + '=' + r_sq(r_v(g_REGEX_HTML_ATTRIBUTE_VALUE));
                break;

            case k_ATTRIBUTE_TYPE_VALUE_BOOLEAN:
                regExpString += r_W + '=' + r_v('(?:true|false)');
                break;

            case k_ATTRIBUTE_TYPE_VALUE_EMPTY:
                regExpString += r_W + '=' + r_dq('');
                break;

            case k_ATTRIBUTE_TYPE_VALUE_NULL:
                regExpString += r_W + '=null';
                break;

            case k_ATTRIBUTE_TYPE_NO_VALUE:
                regExpString += ''; // Add nothing
                break;
        }

        regExpString += r_v(r_AG) + '$';

        var matches = in_html_content.match(new RegExp(regExpString, 'i'));
        if (!matches) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var key = matches.shift() || '';
        var val;

        switch (in_attribute_type) {
            case k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED:
            case k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED:
                val = matches.shift() || '';

                if (val === '"true"' || val === "'true'" || val === 'true') {
                    val = 'true';
                } else if (val === '"false"' || val === "'false'" || val === 'false') {
                    val = 'false';
                }

                break;

            case k_ATTRIBUTE_TYPE_VALUE_BOOLEAN:
                val = matches.shift() || '';
                break;

            case k_ATTRIBUTE_TYPE_VALUE_EMPTY:
                val = '';
                break;

            case k_ATTRIBUTE_TYPE_VALUE_NULL:
                val = k_NULL_VALUE_TOKEN;
                break;

            case k_ATTRIBUTE_TYPE_NO_VALUE:
                val = k_NO_VALUE_TOKEN;
                break;
        }

        g_CURRENT_ELEMENT_ATTRIBUTES[key] = val;
        var remaining = matches.shift() || '';

        // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+key+'~~~'+val+'~~~'+remaining.substr(0,100)+'|------\n');

        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function parse_html_open_element_end(in_html_content) {
    var result = false;

    do {
        var matches = in_html_content.match(new RegExp('^' + r_W + r_v('/') + '?>' + r_v(r_AG) + '$', 'i'));
        if (!matches) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var self_closing_tag = matches.shift() === '/';
        var remaining = matches.shift() || '';

        // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+self_closing_tag+'~~~'+remaining.substr(0,100)+'|------\n');

        var output = '';
        var indent = '';
        var space_content = g_CURRENT_ELEMENT_WHITESPACE_BEFORE.length;

        if (self_closing_tag) {
            if (g_SELF_CLOSING_HTML_TAGS.indexOf(g_CURRENT_ELEMENT) >= 0) {
                output = '<' + g_CURRENT_ELEMENT + sort_attributes(g_CURRENT_ELEMENT_ATTRIBUTES) + '>';
                indent = t_NL + get_indent();
            } else if (g_ALLOW_ARBITRARY_CLOSING_HTML_TAGS) {
                output = '<' + g_CURRENT_ELEMENT + sort_attributes(g_CURRENT_ELEMENT_ATTRIBUTES) + '/>';
                indent = t_NL + get_indent();
            } else {
                throw new Error('Not a self closing HTML tag: ' + g_CURRENT_ELEMENT);
            }
        } else if (g_SELF_CLOSING_HTML_TAGS.indexOf(g_CURRENT_ELEMENT) >= 0) {
            output = '<' + g_CURRENT_ELEMENT + sort_attributes(g_CURRENT_ELEMENT_ATTRIBUTES) + '>';
            indent = t_NL + get_indent();
        } else {
            var top_element_info = get_top_element_info();

            output = '<' + g_CURRENT_ELEMENT + sort_attributes(g_CURRENT_ELEMENT_ATTRIBUTES) + '>';

            if (top_element_info.top_element_is_block_element && g_FORCE_BLOCK_WHITESPACE_FORMATTING) {
                indent = t_NL + get_indent();
            } else if (space_content) {
                if (top_element_info.had_content || top_element_info.had_comment || top_element_info.had_xml_header || !top_element_info.top_element_is_inline_element) {
                    if (top_element_info.top_element_is_inline_element && g_FORCE_INLINE_WHITESPACE_FORMATTING) {
                        indent = ' ';
                    } else {
                        if (g_CURRENT_ELEMENT_WHITESPACE_BEFORE.match(/^ +$/)) {
                            indent = ' ';
                        } else {
                            indent = t_NL + get_indent();
                        }
                    }
                } else {
                    if (g_CURRENT_ELEMENT_WHITESPACE_BEFORE.match(/^ +$/)) {
                        indent = ' ';
                    } else {
                        indent = t_NL + get_indent();
                    }
                }
            }

            inc_indent(1);
            g_ELEMENT_STACK.push(g_CURRENT_ELEMENT);
        }

        if (g_HTML_CONTENT.length) {
            g_HTML_CONTENT += indent;
        }

        g_HTML_CONTENT += output;

        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function add_attributes(in_attributes) {
    if (g_CURRENT_ELEMENT === 'a') {
        if (in_attributes['target'] === '_blank') {
            var rel = (in_attributes['rel'] || '').replace('noopener', '').replace('noreferrer', '').trim();
            if (g_ADD_NOOPENER_NOREFERRER) {
                return {
                    rel: 'noopener noreferrer' + (rel ? ' ' + rel : ''),
                };
            }
        }
    }

    return {};
}

// ******************************

function sort_attributes(in_attributes) {
    var result = '';

    do {
        if (!in_attributes) {
            break;
        }

        var attributes = in_attributes;
        var added_attributes = add_attributes(in_attributes);

        Object.keys(added_attributes).forEach(function (added_attribute_key) {
            attributes[added_attribute_key] = added_attributes[added_attribute_key];
        });

        var attribute_keys = Object.keys(attributes);
        attribute_keys.sort();

        var attributes_order_pre_native = [];
        g_NG_ATTRIBUTES_ORDER_PRE_NATIVE.forEach(function (attribute) {
            attributes_order_pre_native.push('^' + attribute + '$');
        });

        var attributes_order_post_native = [];
        g_NG_ATTRIBUTES_ORDER.forEach(function (attribute) {
            attributes_order_post_native.push('^' + attribute + '$');
        });

        var sorted_attribute_keys = [];

        attributes_order_pre_native.forEach(function (special_order) {
            attribute_keys.forEach(function (key) {
                if (!key.match(new RegExp(special_order))) {
                    return;
                }

                if (sorted_attribute_keys.indexOf(key) >= 0) {
                    return;
                }

                sorted_attribute_keys.push(key);
            });
        });

        attribute_keys.forEach(function (key) {
            var special_order_match = attributes_order_post_native.filter(function (special_order) {
                var matches = key.match(new RegExp(special_order));
                return matches && matches.length;
            });

            if (special_order_match.length) {
                return;
            }

            if (sorted_attribute_keys.indexOf(key) >= 0) {
                return;
            }

            sorted_attribute_keys.push(key);
        });

        attributes_order_post_native.forEach(function (special_order) {
            attribute_keys.forEach(function (key) {
                if (!key.match(new RegExp(special_order))) {
                    return;
                }

                if (sorted_attribute_keys.indexOf(key) >= 0) {
                    return;
                }

                sorted_attribute_keys.push(key);
            });
        });

        var indent = str_repeat(g_INDENT, g_INDENT_COUNT + 1);

        sorted_attribute_keys.forEach(function (key) {
            var val = attributes[key];
            val = val.replace(/[\s]+/, ' ');

            if (val === k_NULL_VALUE_TOKEN) {
                result += t_NL + indent + key + '=null';
                return;
            }

            if (val === k_NO_VALUE_TOKEN) {
                result += t_NL + indent + key;
                return;
            }

            var inline_variable = val.match(new RegExp('^(\\:\\:)?\\{\\{' + r_v(r_A) + '\\}\\}$', 'i'));
            if (!inline_variable) {
                var inline_block = val.match(new RegExp('^(\\:\\:)?\\{' + r_v(r_AG) + '\\}$', 'i'));
                if (inline_block) {
                    var attribute_block_object_parse_result = parse_attribute_block_content(val);
                    var binding = attribute_block_object_parse_result.binding;
                    var attribute_block_object = attribute_block_object_parse_result.object;
                    val = attribute_block_object_to_string(binding, attribute_block_object);
                }
            }

            if (key === k_ATTRIBUTE_NAME_CLASS) {
                var val_indent = str_repeat(g_INDENT, g_INDENT_COUNT + 2);

                if (g_MULTI_CLASSES_ORDER && g_MULTI_CLASSES_ORDER.length) {
                    var classes = parse_classes_content(val);
                    classes = sort_classes(classes);

                    if (g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST >= 0 && classes.length > g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST) {
                        val =
                            t_NL +
                            val_indent +
                            classes
                                .filter(function (val) {
                                    return val.trim().length;
                                })
                                .join(t_NL + val_indent);
                    } else {
                        val = classes
                            .filter(function (val) {
                                return val.trim().length;
                            })
                            .join(' ');
                    }
                }
            }

            result += t_NL + indent + key + '="' + val + '"';
        });
    } while (FALSE);

    return result;
}

// ******************************

function parse_classes_content(in_classes_content) {
    var result = false;

    do {
        var classes_content = in_classes_content || '';
        var classes_content_remaining = classes_content;

        g_CURRENT_ELEMENT_CLASSES = [];
        g_CURRENT_ELEMENT_CLASSES_CLASS_NAME = '';

        while (TRUE) {
            var remaining = parse_classes_content_class_name(classes_content_remaining);
            if (remaining === false) {
                break;
            }
            classes_content_remaining = remaining;

            remaining = parse_classes_content_space(classes_content_remaining);
            if (remaining === false) {
                break;
            }
            classes_content_remaining = remaining;
        }

        if (classes_content_remaining) {
            throw new Error('Cannot parse classes: ' + classes_content.substr(0, 100).trim() + '...\n@' + classes_content_remaining.substr(0, 100).trim() + '...');
        }

        result = g_CURRENT_ELEMENT_CLASSES;
        g_CURRENT_ELEMENT_CLASSES = [];
        g_CURRENT_ELEMENT_CLASSES_CLASS_NAME = '';
    } while (FALSE);

    return result;
}

// ******************************

function parse_classes_content_space(in_classes_content) {
    var result = false;

    do {
        var classes_content = in_classes_content || '';

        var matches;
        if (!(matches = classes_content.match(new RegExp('^' + r_S + r_v(r_AG) + '$', 'i')))) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var remaining = matches.shift() || '';

        // console.log('[SPACE]"'+classes_content.substr(0,100)+'" => ~~~'+' '+'~~~'+remaining.substr(0,100)+'|------\n');

        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function parse_classes_content_class_name(in_classes_content) {
    var result = false;

    do {
        var classes_content = in_classes_content || '';

        var functions = [
            function (in_classes_content) {
                return parse_classes_content_class_name_type(in_classes_content, k_CLASS_TYPE_BINDING);
            },
            function (in_classes_content) {
                return parse_classes_content_class_name_type(in_classes_content, k_CLASS_TYPE_NORMAL);
            },
        ];

        var matched_value = false;
        functions.forEach(function (fn) {
            if (matched_value) {
                return;
            }
            var remaining = fn(classes_content);
            if (remaining !== false) {
                classes_content = remaining;
                matched_value = true;
            }
        });

        if (!matched_value) {
            break;
        }

        g_CURRENT_ELEMENT_CLASSES.push(g_CURRENT_ELEMENT_CLASSES_CLASS_NAME);

        result = classes_content;
    } while (FALSE);

    return result;
}

// ******************************

function parse_classes_content_class_name_type(in_classes_content, in_class_name_type) {
    var result = false;

    do {
        var regExpString = '^';

        switch (in_class_name_type) {
            case k_CLASS_TYPE_BINDING:
                regExpString += r_W + r_v('[A-Z0-9a-z-_]*(?:\\{\\{.*?\\}\\}[A-Z0-9a-z-_]*)+');
                break;

            case k_CLASS_TYPE_NORMAL:
                regExpString += r_W + r_v('[A-Z0-9a-z-_]+');
                break;
        }

        regExpString += r_v(r_AG) + '$';

        var matches = in_classes_content.match(new RegExp(regExpString, 'i'));
        if (!matches) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var class_name = matches.shift() || '';
        var remaining = matches.shift() || '';

        g_CURRENT_ELEMENT_CLASSES_CLASS_NAME = class_name;

        // console.log(in_class_name_type+'"'+in_classes_content.substr(0,100)+'" => ~~~'+class_name+'~~~'+remaining.substr(0,100)+'|------\n');

        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function sort_classes(in_class_names) {
    var result = false;

    do {
        var class_names = in_class_names.sort();
        var sorted_class_names = [];

        g_MULTI_CLASSES_ORDER.forEach(function (class_order_regexp) {
            class_names.forEach(function (class_name) {
                if (!class_name.match(new RegExp(class_order_regexp))) {
                    return;
                }

                if (sorted_class_names.indexOf(class_name) >= 0) {
                    return;
                }

                sorted_class_names.push(class_name);
            });
        });

        class_names.forEach(function (class_name) {
            var class_order_regexp_match = g_MULTI_CLASSES_ORDER.filter(function (class_order_regexp) {
                var matches = class_name.match(new RegExp(class_order_regexp));
                return matches && matches.length;
            });

            if (class_order_regexp_match.length) {
                return;
            }

            if (sorted_class_names.indexOf(class_name) >= 0) {
                return;
            }

            sorted_class_names.push(class_name);
        });

        result = sorted_class_names;
    } while (FALSE);

    return result;
}

// ******************************

function parse_attribute_block_content(in_attribute_block_content) {
    var result = false;

    do {
        var matches;
        if (!(matches = in_attribute_block_content.match(new RegExp('^(\\:\\:)?\\{' + r_v(r_AG) + '\\}$', 'i')))) {
            break;
        }

        g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT = [];
        g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE = '';

        matches.shift(); // First idx in match is the complete match string
        var binding = matches.shift() || '';
        var attribute_block_content = matches.shift() || '';
        var attribute_block_content_remaining = attribute_block_content;

        while (TRUE) {
            var remaining = parse_attribute_block_content_entry(attribute_block_content_remaining);
            if (remaining === false) {
                break;
            }
            attribute_block_content_remaining = remaining;

            remaining = parse_attribute_block_content_comma(attribute_block_content_remaining);
            if (remaining === false) {
                break;
            }
            attribute_block_content_remaining = remaining;
        }

        if (attribute_block_content_remaining) {
            throw new Error('Cannot parse attribute object: ' + attribute_block_content.substr(0, 1000).trim() + '...\n@' + attribute_block_content_remaining.substr(0, 1000).trim() + '...');
        }

        result = {
            binding,
            object: g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT,
        };
        g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT = [];
        g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE = '';
    } while (FALSE);

    return result;
}

// ******************************

function parse_attribute_block_content_comma(in_attribute_block_content) {
    var result = false;

    do {
        var attribute_block_content = in_attribute_block_content || '';

        var matches;
        if (!(matches = attribute_block_content.match(new RegExp('^' + r_W + ',' + r_W + r_v(r_AG) + '$', 'i')))) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var remaining = matches.shift() || '';

        // console.log('[COMMA]"'+attribute_block_content.substr(0,100)+'" => ~~~'+','+'~~~'+remaining.substr(0,100)+'|------\n');

        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function parse_attribute_block_content_entry(in_attribute_block_content) {
    var result = false;

    do {
        var attribute_block_content = in_attribute_block_content || '';

        var matches;
        if (!(matches = attribute_block_content.match(new RegExp('^' + r_W + r_v("'?[$A-Za-z0-9 _-]+'?") + r_W + ':' + r_W + r_v(r_AG) + '$', 'i')))) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var key = matches.shift() || '';
        var val = matches.shift() || '';

        key = key.trim();

        // console.log('[KEY]"'+attribute_block_content.substr(0,100)+'" => ~~~'+key+'|------\n');

        result = parse_attribute_block_content_entry_key_value_pair(key, val);
    } while (FALSE);

    return result;
}

// ******************************

function parse_attribute_block_content_entry_key_value_pair(in_attribute_block_content_entry_key, in_attribute_block_content_entry_value, in_aggregate) {
    var result = false;

    do {
        var key = in_attribute_block_content_entry_key || '';
        var val = in_attribute_block_content_entry_value || '';

        var functions = [
            function (in_key, in_val) {
                return parse_attribute_block_content_entry_key_value_pair_type(in_key, in_val, k_ATTRIBUTE_TYPE_VALUE_BOOLEAN);
            },
            function (in_key, in_val) {
                return parse_attribute_block_content_entry_key_value_pair_type(in_key, in_val, k_ATTRIBUTE_TYPE_VALUE_NUMERIC);
            },
            function (in_key, in_val) {
                return parse_attribute_block_content_entry_key_value_pair_type(in_key, in_val, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED);
            },
            function (in_key, in_val) {
                return parse_attribute_block_content_entry_key_value_pair_type(in_key, in_val, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED);
            },
            function (in_key, in_val) {
                return parse_attribute_block_content_entry_key_value_pair_type(in_key, in_val, k_ATTRIBUTE_TYPE_VALUE_ACCESSOR_FUNCTION);
            },
            function (in_key, in_val) {
                return parse_attribute_block_content_entry_key_value_pair_type(in_key, in_val, k_ATTRIBUTE_TYPE_VALUE_ACCESSOR);
            },
            function (in_key, in_val) {
                return parse_attribute_block_content_entry_key_value_pair_type(in_key, in_val, k_ATTRIBUTE_TYPE_VALUE_BLOCK);
            },
        ];

        var matched_value = false;
        functions.forEach(function (fn) {
            if (matched_value) {
                return;
            }
            var remaining = fn(key, val);
            if (remaining !== false) {
                val = remaining;
                matched_value = true;
            }
        });

        if (!matched_value) {
            break;
        }

        if (in_aggregate) {
            g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT[key] += ' ' + g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE;
        } else {
            g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT[key] = g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE;
        }

        result = val;
        if (!result) {
            break;
        }

        var matches;
        if (!(matches = result.match(new RegExp('^' + r_W + r_v('[+=!&|<>-]+') + r_W + r_v(r_AG) + '$', 'i')))) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var condition = matches.shift() || '';
        var remaining = matches.shift() || '';

        // console.log('[CONDITION]"'+result.substr(0,100)+'" => ~~~'+condition+'~~~'+remaining.substr(0,100)+'|------\n');

        g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT[key] += ' ' + condition;

        remaining = parse_attribute_block_content_entry_key_value_pair(in_attribute_block_content_entry_key, remaining, true);

        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function parse_attribute_block_content_entry_key_value_pair_type(in_attribute_block_content_entry_key, in_attribute_block_content_entry_value, in_attribute_type) {
    var result = false;

    do {
        var regExpString = '^';

        switch (in_attribute_type) {
            case k_ATTRIBUTE_TYPE_VALUE_BOOLEAN:
                regExpString += r_W + r_v('(?:true|false)');
                break;

            case k_ATTRIBUTE_TYPE_VALUE_NUMERIC:
                regExpString += r_W + r_v('[0-9.-]+');
                break;

            case k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED:
                regExpString += r_W + r_v(r_sq(r_A));
                break;

            case k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED:
                regExpString += r_W + r_v(r_dq(r_A));
                break;

            case k_ATTRIBUTE_TYPE_VALUE_BLOCK:
                regExpString += r_W + r_v('\\{' + r_A + '\\}');
                break;

            case k_ATTRIBUTE_TYPE_VALUE_ACCESSOR_FUNCTION:
                regExpString += r_W + r_v('\\!*' + r_g('[$a-zA-Z0-9_]+\\??\\.') + '*' + '[$a-zA-Z0-9_-]+\\([a-zA-Z0-9. "\',_-]*\\)');
                break;

            case k_ATTRIBUTE_TYPE_VALUE_ACCESSOR:
                regExpString +=
                    r_W +
                    r_v(
                        '\\!*' +
                            r_g(r_g(r_g('\\(' + r_w('[$a-zA-Z0-9_]+') + r_w('\\|') + r_w('async') + '\\)') + '|' + r_g(r_g('[$a-zA-Z0-9_]+'))) + '\\??\\.') +
                            '*' +
                            r_g(
                                r_g('\\(' + r_g(r_g(r_w('[$a-zA-Z0-9._-]+') + r_w('\\|\\|')) + '*' + r_w('[$a-zA-Z0-9._-]+') + '|' + r_g(r_w('[$a-zA-Z0-9._]+') + r_w('\\|') + r_w('async'))) + '\\)') +
                                    '|' +
                                    r_g('[$a-zA-Z0-9_-]+')
                            )
                    );
                break;
        }

        regExpString += r_W + r_v(r_AG) + '$';

        var matches = in_attribute_block_content_entry_value.match(new RegExp(regExpString, 'i'));
        if (!matches) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var val = matches.shift() || '';
        var remaining = matches.shift() || '';

        if (in_attribute_type === k_ATTRIBUTE_TYPE_VALUE_BLOCK) {
            var tmp_CURRENT_ELEMENT_ATTRIBUTE_OBJECT = g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT;
            var attribute_block_object_parse_result = parse_attribute_block_content(val);
            var attribute_block_object = attribute_block_object_parse_result.object;
            g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT = tmp_CURRENT_ELEMENT_ATTRIBUTE_OBJECT;

            val = attribute_block_object;
        }

        g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE = val;

        // console.log(in_attribute_type+'['+key+']"'+in_attribute_block_content_entry_value.substr(0,100)+'" => ~~~'+val+'~~~'+remaining.substr(0,100)+'|------\n');

        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function attribute_block_object_to_string(in_binding, in_attribute_block_object) {
    var result = false;

    do {
        inc_indent(1);
        var indent = get_indent();

        var attribute_block_object_formatted = '{';

        var attribute_block_object_entry_keys = Object.keys(in_attribute_block_object);
        attribute_block_object_entry_keys.sort();

        attribute_block_object_entry_keys.forEach(function (attribute_block_object_entry_key) {
            var attribute_block_object_entry_value = in_attribute_block_object[attribute_block_object_entry_key];
            if (typeof attribute_block_object_entry_value === 'object') {
                attribute_block_object_entry_value = attribute_block_object_to_string('', attribute_block_object_entry_value);
            }
            attribute_block_object_formatted += t_NL + indent + g_INDENT + attribute_block_object_entry_key + ': ' + attribute_block_object_entry_value + ',';
        });

        if (attribute_block_object_entry_keys.length > 0) {
            attribute_block_object_formatted = attribute_block_object_formatted.substr(0, attribute_block_object_formatted.length - 1) + t_NL + indent;
        }

        attribute_block_object_formatted += '}';
        inc_indent(-1);

        result = in_binding + attribute_block_object_formatted;
    } while (FALSE);

    return result;
}

// ******************************

function parse_html_close_element(in_html_content) {
    var result = false;

    do {
        var matches = in_html_content.match(new RegExp('^' + r_v(r_W) + '</' + r_W + r_v(g_REGEX_HTML_ELEMENT) + r_W + '>' + r_v(r_AG) + '$', 'i'));
        if (!matches) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var whitespace_before = matches.shift() || '';
        var element = (matches.shift() || '').trim();
        var remaining = matches.shift() || '';

        // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+whitespace_before+'~~~'+element+'~~~'+remaining.substr(0,100)+'|------\n');

        var space_content = whitespace_before.length;

        var output = '';
        var indent = '';

        inc_indent(-1);

        var top_element_info = get_top_element_info(true);
        if (!top_element_info.top_element) {
            throw new Error('Closing "' + element + '" but there is no matching open element');
        }

        if (top_element_info.top_element !== element) {
            throw new Error('expected "' + top_element_info.top_element + '" but got "' + element + '"');
        }

        var top_element_is_empty = !top_element_info.had_content && !top_element_info.had_comment && !top_element_info.had_xml_header && top_element_info.top_element === g_CURRENT_ELEMENT;

        output = '</' + element + '>';

        if (top_element_info.top_element_is_block_element && g_FORCE_BLOCK_WHITESPACE_FORMATTING) {
            indent = t_NL + get_indent();
        } else if (space_content) {
            if (top_element_is_empty && top_element_info.top_element_is_inline_element && g_FORCE_INLINE_WHITESPACE_FORMATTING) {
                indent = '';
            } else if (top_element_info.had_content || top_element_info.had_comment || top_element_info.had_xml_header || !top_element_info.top_element_is_inline_element) {
                if (top_element_info.top_element_is_inline_element && g_FORCE_INLINE_WHITESPACE_FORMATTING) {
                    indent = ' ';
                } else {
                    if (whitespace_before.match(/^ +$/)) {
                        indent = ' ';
                    } else {
                        indent = t_NL + get_indent();
                    }
                }
            } else {
                if (whitespace_before.match(/^ +$/)) {
                    indent = ' ';
                } else {
                    indent = t_NL + get_indent();
                }
            }
        }

        if (g_HTML_CONTENT.length) {
            g_HTML_CONTENT += indent;
        }

        g_HTML_CONTENT += output;

        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function parse_content(in_html_content) {
    var result = false;

    do {
        var matches = in_html_content.match(new RegExp('^' + r_v(r_W) + r_v(g_REGEX_HTML_CONTENT) + r_v(r_g(r_W + '<' + r_AG) + '?') + '$', 'i'));
        if (!matches) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var whitespace_before = matches.shift() || '';
        var content = (matches.shift() || '').trim();
        var remaining = matches.shift() || '';

        // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+whitespace_before+'~~~'+content+'~~~'+remaining+'|------\n');

        var space_content = whitespace_before.length;

        if (!content.trim().length) {
            result = remaining;
            break;
        }

        content = content.replace(new RegExp('^ *', 'gm'), get_indent());
        content = content.replace(new RegExp('^[\\s]*$', 'gm'), '');
        content = content.replace(new RegExp('^ *'), '');

        g_ELEMENT_STACK.push(k_CONTENT_TOKEN);

        var indent = '';

        var top_element_info = get_top_element_info();
        if (space_content) {
            if (top_element_info.had_content || top_element_info.had_comment || top_element_info.had_xml_header || !top_element_info.top_element_is_inline_element) {
                if (top_element_info.top_element_is_inline_element && g_FORCE_INLINE_WHITESPACE_FORMATTING) {
                    indent = ' ';
                } else {
                    if (whitespace_before.match(/^ +$/)) {
                        indent = ' ';
                    } else {
                        indent = t_NL + get_indent();
                    }
                }
            } else {
                if (whitespace_before.match(/^ +$/)) {
                    indent = ' ';
                } else {
                    indent = t_NL + get_indent();
                }
            }
        }

        if (g_HTML_CONTENT.length) {
            g_HTML_CONTENT += indent;
        }

        g_HTML_CONTENT += content;

        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function parse_temporary_content(in_html_content, in_indent_count) {
    var result = false;

    do {
        var state = get_html_variables_state();
        reset_html_variables();

        var contents;
        try {
            var html_content = in_html_content || '';

            if (in_indent_count > 0) {
                g_INDENT_COUNT = in_indent_count;
            }

            if (!parse_html(html_content)) {
                throw new Error('get out');
            }

            while (g_ELEMENT_STACK.length) {
                var top_element = g_ELEMENT_STACK.pop();
                if ([k_COMMENT_TOKEN, k_XML_HEADER_TOKEN].indexOf(top_element) >= 0) {
                    continue;
                }
                throw new Error('get out');
            }

            contents = '';
            if (in_indent_count > 0) {
                contents += get_indent();
            }
            contents += g_HTML_CONTENT;
        } catch (err) {
            contents = false;
        }

        reset_html_variables();
        set_html_variables_state(state);

        result = contents;
    } while (FALSE);

    return result;
}

// ******************************

function parse_comment(in_html_content) {
    var result = false;

    do {
        var matches = in_html_content.match(new RegExp('^' + r_v(r_W) + g_REGEX_HTML_COMMENT + r_v(r_AG), 'i'));
        if (!matches) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var whitespace_before = !!(matches.shift() || '').length;
        var comment = (matches.shift() || '').trim();
        var remaining = matches.shift() || '';

        var multi_line_comment = comment.match(new RegExp('\\n'));

        g_ELEMENT_STACK.push(k_COMMENT_TOKEN);

        var indent = '';

        var top_element_info = get_top_element_info();
        if (top_element_info.top_element_is_block_element && g_FORCE_BLOCK_WHITESPACE_FORMATTING) {
            indent = t_NL + get_indent();
        } else if (whitespace_before) {
            if (top_element_info.top_element_is_inline_element && g_FORCE_INLINE_WHITESPACE_FORMATTING) {
                indent = ' ';
            } else {
                indent = t_NL + get_indent();
            }
        }

        if (g_HTML_CONTENT.length > 0) {
            g_HTML_CONTENT += indent;
        }

        var formatted_comment = false;
        if (comment) {
            formatted_comment = parse_temporary_content(comment, g_INDENT_COUNT + 1);
        }

        if (multi_line_comment || formatted_comment) {
            inc_indent(1);
            g_HTML_CONTENT += '<!--';
            g_HTML_CONTENT += t_NL;

            if (formatted_comment) {
                g_HTML_CONTENT += formatted_comment;
            } else {
                var indented_comment = comment;
                indented_comment = indented_comment.replace(new RegExp('^ *', 'gm'), get_indent());
                indented_comment = indented_comment.replace(new RegExp('^[\\s]*$', 'gm'), '');
                g_HTML_CONTENT += indented_comment;
            }

            inc_indent(-1);
            g_HTML_CONTENT += t_NL + get_indent();
            g_HTML_CONTENT += '-->';
        } else if (!comment) {
            g_HTML_CONTENT += '<!-- -->';
        } else {
            g_HTML_CONTENT += '<!-- ' + comment + ' -->';
        }

        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function parse_xml_header(in_html_content) {
    var result = false;

    do {
        var matches = in_html_content.match(new RegExp('^' + r_v(r_W) + g_REGEX_XML_HEADER + r_v(r_AG), 'i'));
        if (!matches) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        matches.shift();
        var xml_header = (matches.shift() || '').trim();
        var remaining = matches.shift() || '';

        g_ELEMENT_STACK.push(k_XML_HEADER_TOKEN);
        g_HTML_CONTENT += xml_header;
        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function parse_style(in_html_content) {
    var result = false;

    do {
        var matches = in_html_content.match(new RegExp('^' + r_v(r_W) + g_REGEX_HTML_STYLE + r_v(r_AG) + '$', 'i'));
        if (!matches) {
            break;
        }

        matches.shift(); // First idx in match is the complete match string
        var whitespace_before = !!(matches.shift() || '').length;
        var css = (matches.shift() || '').trim();
        var remaining = matches.shift() || '';

        // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+whitespace_before+'~~~'+css+'~~~'+remaining+'|------\n');

        var output = '';
        var indent = '';

        var top_element_info = get_top_element_info();
        if (top_element_info.top_element_is_block_element && g_FORCE_BLOCK_WHITESPACE_FORMATTING) {
            indent = t_NL + get_indent();
        } else if (whitespace_before) {
            if (top_element_info.top_element_is_inline_element && g_FORCE_INLINE_WHITESPACE_FORMATTING) {
                indent = '';
            } else {
                indent = t_NL + get_indent();
            }
        }

        if (g_REMOVE_CSS) {
            output += '<!-- REMOVED CSS FROM TEMPLATE -->';
            g_ELEMENT_STACK.push(k_COMMENT_TOKEN);
            result = remaining;
        } else if (css.trim().length) {
            output += '<style type="text/css">';
            inc_indent(1);

            css = formatter.format_contents(css, {
                convert_line_endings: g_CONVERT_LINE_ENDINGS,
                definition_type: parser.k_DEFINITION_TYPE_SCSS,
                indent: g_INDENT,
                indent_count: g_INDENT_COUNT,
                line_ending: t_NL,
            });

            output += t_NL + get_indent() + css;
            inc_indent(-1);
            output += t_NL + get_indent() + '</style>';
        }

        if (output) {
            if (g_HTML_CONTENT.length > 0 && whitespace_before) {
                g_HTML_CONTENT += indent;
            }

            g_HTML_CONTENT += output;
        }

        result = remaining;
    } while (FALSE);

    return result;
}

// ******************************

function reset_html_variables() {
    do {
        g_HTML_CONTENT = '';
        g_HTML_INVALID = '';
        g_HTML_LINE_NUMBER = 1;
        g_INDENT_COUNT = 0;
        g_ELEMENT_STACK = [];
        g_CURRENT_ELEMENT = '';
        g_CURRENT_ELEMENT_ATTRIBUTES = [];
        g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT = [];
        g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE = '';
        g_CURRENT_ELEMENT_CLASSES = [];
        g_CURRENT_ELEMENT_CLASSES_CLASS_NAME = '';
        g_CURRENT_ELEMENT_WHITESPACE_BEFORE = false;
    } while (FALSE);
}

// ******************************

function get_html_variables_state() {
    do {
        return {
            HTML_CONTENT: g_HTML_CONTENT,
            HTML_INVALID: g_HTML_INVALID,
            HTML_LINE_NUMBER: g_HTML_LINE_NUMBER,
            INDENT_COUNT: g_INDENT_COUNT,
            ELEMENT_STACK: g_ELEMENT_STACK,
            CURRENT_ELEMENT: g_CURRENT_ELEMENT,
            CURRENT_ELEMENT_ATTRIBUTES: g_CURRENT_ELEMENT_ATTRIBUTES,
            CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT: g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT,
            CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE: g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE,
            CURRENT_ELEMENT_CLASSES: g_CURRENT_ELEMENT_CLASSES,
            CURRENT_ELEMENT_CLASSES_CLASS_NAME: g_CURRENT_ELEMENT_CLASSES_CLASS_NAME,
            CURRENT_ELEMENT_WHITESPACE_BEFORE: g_CURRENT_ELEMENT_WHITESPACE_BEFORE,
        };
    } while (FALSE);
}

// ******************************

function set_html_variables_state(in_state) {
    do {
        g_HTML_CONTENT = in_state.HTML_CONTENT || '';
        g_HTML_INVALID = in_state.HTML_INVALID || '';
        g_HTML_LINE_NUMBER = in_state.HTML_LINE_NUMBER || 1;
        g_INDENT_COUNT = in_state.INDENT_COUNT || 0;
        g_ELEMENT_STACK = in_state.ELEMENT_STACK || [];
        g_CURRENT_ELEMENT = in_state.CURRENT_ELEMENT || '';
        g_CURRENT_ELEMENT_ATTRIBUTES = in_state.CURRENT_ELEMENT_ATTRIBUTES || [];
        g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT = in_state.CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT || [];
        g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE = in_state.CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE || '';
        g_CURRENT_ELEMENT_CLASSES = in_state.CURRENT_ELEMENT_CLASSES || [];
        g_CURRENT_ELEMENT_CLASSES_CLASS_NAME = in_state.CURRENT_ELEMENT_CLASSES_CLASS_NAME || '';
        g_CURRENT_ELEMENT_WHITESPACE_BEFORE = in_state.CURRENT_ELEMENT_WHITESPACE_BEFORE || false;
    } while (FALSE);
}

// ******************************

function get_top_element_info(in_pop) {
    var result = false;

    do {
        var had_content = false;
        var had_comment = false;
        var had_xml_header = false;
        var top_element_idx = g_ELEMENT_STACK.length - 1;
        var top_element = '';

        var found_signal_element = true;
        while (found_signal_element && top_element_idx >= 0) {
            found_signal_element = false;

            if (in_pop) {
                top_element = g_ELEMENT_STACK.pop();
            } else {
                top_element = g_ELEMENT_STACK[top_element_idx];
            }

            if (top_element === k_CONTENT_TOKEN) {
                top_element_idx--;
                had_content = true;
                found_signal_element = true;
                continue;
            }

            if (top_element === k_COMMENT_TOKEN) {
                top_element_idx--;
                had_comment = true;
                found_signal_element = true;
                continue;
            }

            if (top_element === k_XML_HEADER_TOKEN) {
                top_element_idx--;
                had_xml_header = true;
                found_signal_element = true;
                continue;
            }
        }

        result = {
            had_comment,
            had_content,
            had_xml_header,
            top_element,
            top_element_is_inline_element: g_INLINE_ELEMENTS.indexOf(top_element) >= 0,
            top_element_is_block_element: g_BLOCK_ELEMENTS.indexOf(top_element) >= 0,
        };
    } while (FALSE);

    return result;
}

// ******************************

function num_lines(in_content) {
    if (!in_content) {
        return 0;
    }
    return (in_content || '').replace(new RegExp('\\n', 'g'), '\n').split('\n').length;
}

// ******************************

function get_indent() {
    return str_repeat(g_INDENT, g_INDENT_COUNT);
}

// ******************************

function inc_indent(in_inc) {
    g_INDENT_COUNT = Math.max(0, g_INDENT_COUNT + in_inc);
}

// ******************************

function is_numeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// ******************************

function str_repeat(s, n) {
    return Array(n + 1).join(s);
}

// ******************************
// Exports:
// ******************************

module.exports['setup'] = setup;
module.exports['format_html_contents'] = format_html_contents; // TODO: Deprecate
module.exports['format_html_file'] = format_html_contents; // TODO: Deprecate

// ******************************
