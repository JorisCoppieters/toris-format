'use strict';

// ******************************
//
//
// TORIS FORMAT v1.5.0
//
// Version History:
//
// 1.5.0
// - Refactored attribute value object parsing
// - Added proper class name parsing
// - Fixed bug with object values not being able to contain commas
//
// 1.4.5
// - Replaced g_ORDER_MULTI_CLASSES_ALPHABETICALLY config key with g_MULTI_CLASSES_ORDER
//
// 1.4.4
// - Added g_ORDER_MULTI_CLASSES_ALPHABETICALLY config key
//
// 1.4.3
// - Fixed config issue in get_setup_property
//
// 1.4.2
// - Deprecated Config keys: NG1_ATTRIBUTES_ORDER, NG1_ATTRIBUTES_ORDER_PRE_NATIVE, NG2_ATTRIBUTES_ORDER, NG2_ATTRIBUTES_ORDER_PRE_NATIVE
// - Added g_NG_ATTRIBUTES_ORDER, g_NG_ATTRIBUTES_ORDER_PRE_NATIVE and require angular_version to be set
// - Added g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST opttion
// - Fixed object binding values not being able to have '<' & '>' characters
// - Split base test into NG1/non-NG1 tests
// - Improved tests
// - Some clean up
//
// 1.4.1
// - Fixed key regex for binding property
// - Fixed key regex for binding two way property
// - Fixed key regex for binding event
// - Fixed key regex for binding custom directive
// - Added <div> wrapping as fallback to HTML content with multiple parent nodes
// - Added option to allow empty files
//
// 1.4.0
// - Stable release
//
// ******************************

// ******************************
// Constants:
// ******************************

const k_VERSION = '1.5.0';
const k_COMMENT_TOKEN = '[COMMENT]';
const k_CONTENT_TOKEN = '[CONTENT]';
const k_NO_VALUE_TOKEN = '[NOVALUE]';

const k_ATTRIBUTE_NAME_CLASS = "class";

const k_ATTRIBUTE_TYPE_VALUE_BOOLEAN = '[ATTRIBUTE_TYPE_VALUE_BOOLEAN]';
const k_ATTRIBUTE_TYPE_VALUE_NUMERIC = '[ATTRIBUTE_TYPE_VALUE_NUMERIC]';
const k_ATTRIBUTE_TYPE_VALUE_CONDITIONAL = '[ATTRIBUTE_TYPE_VALUE_CONDITIONAL]';
const k_ATTRIBUTE_TYPE_VALUE_BLOCK = '[ATTRIBUTE_TYPE_VALUE_BLOCK]';
const k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED = '[ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED]';
const k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED = '[ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED]';
const k_ATTRIBUTE_TYPE_VALUE_ACCESSOR = '[ATTRIBUTE_TYPE_VALUE_ACCESSOR]';
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
// Exports:
// ******************************

module.exports['k_VERSION'] = k_VERSION;
module.exports['format_html_file'] = format_html_file;
module.exports['setup'] = setup;

// ******************************
// RegEx Shorthand:
// ******************************

let r_A = '[\\s\\S]*?'; // RegEx: Any (Not Greedy)
let r_AG = '[\\s\\S]*'; // RegEx: Any (Greedy)
let r_W = '[\\s]*'; // RegEx: Optional Whitepsace
let r_S = '[\\s]+'; // RegEx: Whitepsace

// ******************************

function r_w (in_re) { // RegEx: Whitespace around
  return r_W + in_re + r_W;
}

// ******************************

function r_g (in_re) { // RegEx: Group
  return '(?:' + in_re + ')';
}

// ******************************

function r_v (in_re) { // RegEx: Variable
  return '(' + in_re + ')';
}

// ******************************

function r_dq (in_re) { // RegEx: Double Quote
  return r_W + '"' + r_W + in_re + r_W + '"';
}

// ******************************

function r_sq (in_re) { // RegEx: Single Quote
  return r_W + '\'' + r_W + in_re + r_W + '\'';
}

// ******************************
// Globals:
// ******************************

// State:
let g_ELEMENT_STACK = [];
let g_CURRENT_ELEMENT = '';
let g_CURRENT_ELEMENT_ATTRIBUTES = [];
let g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT = [];
let g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE = '';
let g_CURRENT_ELEMENT_CLASSES = [];
let g_CURRENT_ELEMENT_CLASSES_CLASS_NAME = '';
let g_CURRENT_ELEMENT_WHITESPACE_BEFORE = false;

let g_HTML_CONTENT = '';
let g_HTML_INVALID = '';
let g_HTML_LINE_NUMBER = 1;

// Config - Base:
let g_BLOCK_ELEMENTS_BASE = ['address', 'blockquote', 'center', 'dir', 'div', 'dl', 'fieldset', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'isindex', 'menu', 'noframes', 'noscript', 'ol', 'p', 'pre', 'table', 'ul'];
let g_INLINE_ELEMENTS_BASE = ['a', 'abbr', 'acronym', 'b', 'basefont', 'bdo', 'big', 'br', 'cite', 'code', 'dfn', 'em', 'font', 'i', 'img', 'input', 'kbd', 'label', 'q', 's', 'samp', 'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'textarea', 'tt', 'u', 'var'];
let g_ONE_TIME_BOUND_ELEMENT_PREFIXES_BASE = ['ng-'];
let g_SELF_CLOSING_HTML_TAGS_BASE = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

// Config:
let g_ALLOW_EMPTY_FILES = false;
let g_ANGULAR_VERSION = 1;
let g_BLOCK_ELEMENTS = g_BLOCK_ELEMENTS_BASE;
let g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST = 3;
let g_INLINE_ELEMENTS = g_INLINE_ELEMENTS_BASE;
let g_MULTI_CLASSES_ORDER = [];
let g_NG_ATTRIBUTES_ORDER = [];
let g_NG_ATTRIBUTES_ORDER_PRE_NATIVE = [];
let g_NONE_ONE_TIME_BOUND_ELEMENTS = [];
let g_ONE_TIME_BOUND_ELEMENT_PREFIXES = g_ONE_TIME_BOUND_ELEMENT_PREFIXES_BASE;
let g_REMOVE_CSS = true;
let g_SELF_CLOSING_HTML_TAGS = g_SELF_CLOSING_HTML_TAGS_BASE;

// Config - Indenting:
let g_INDENT_COUNT = 0;
let g_INDENT = '    ';

// Config - Deprecated
let g__DEPRECATED__NG1_ATTRIBUTES_ORDER = [];
let g__DEPRECATED__NG1_ATTRIBUTES_ORDER_PRE_NATIVE = [];
let g__DEPRECATED__NG2_ATTRIBUTES_ORDER = [];
let g__DEPRECATED__NG2_ATTRIBUTES_ORDER_PRE_NATIVE = [];

// RegEx:
let t_NL = '\n';
let g_NL = '\r\n';
let g_REGEX_NL = r_g('\\r\\n|\\r|\\n');
let g_REGEX_HTML_STYLE = '<style' + r_A + '>' + r_v(r_A) + '<\/style>';
let g_REGEX_HTML_COMMENT = '<!--' + r_W + r_v(r_A) + r_W + '-->';
let g_REGEX_HTML_CONTENT = '[^<]+?';
let g_REGEX_HTML_ELEMENT = '[a-z0-9_-]+';
let g_REGEX_HTML_ATTRIBUTE_KEY = '[:a-z0-9_-]+';
let g_REGEX_HTML_ATTRIBUTE_VALUE = r_A;

// ******************************
// Setup Functions:
// ******************************

function setup (in_config) {
  if (!in_config) {
    return;
  }

  g_ALLOW_EMPTY_FILES = get_setup_property(in_config, "allow_empty_files", g_ALLOW_EMPTY_FILES);
  g_ANGULAR_VERSION = get_setup_property(in_config, ["angular_version", "ng_version"], g_ANGULAR_VERSION);
  g_BLOCK_ELEMENTS = get_setup_property(in_config, "block_elements", g_BLOCK_ELEMENTS, g_BLOCK_ELEMENTS_BASE);
  g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST = get_setup_property(in_config, "format_multi_classes_with_at_least", g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST);
  g_INDENT = get_setup_property(in_config, "indent", g_INDENT);
  g_INLINE_ELEMENTS = get_setup_property(in_config, "inline_elements", g_INLINE_ELEMENTS, g_INLINE_ELEMENTS_BASE);
  g_MULTI_CLASSES_ORDER = get_setup_property(in_config, "multi_classes_order", g_MULTI_CLASSES_ORDER);
  g_NG_ATTRIBUTES_ORDER = get_setup_property(in_config, "ng_attributes_order", g_NG_ATTRIBUTES_ORDER);
  g_NG_ATTRIBUTES_ORDER_PRE_NATIVE = get_setup_property(in_config, "ng_attributes_order_pre_native", g_NG_ATTRIBUTES_ORDER_PRE_NATIVE);
  g_NL = get_setup_property(in_config, "line_ending", g_NL);
  g_NONE_ONE_TIME_BOUND_ELEMENTS = get_setup_property(in_config, "none_one_time_bound_elements", g_NONE_ONE_TIME_BOUND_ELEMENTS);
  g_ONE_TIME_BOUND_ELEMENT_PREFIXES = get_setup_property(in_config, "one_time_bound_element_prefixes", g_ONE_TIME_BOUND_ELEMENT_PREFIXES, g_ONE_TIME_BOUND_ELEMENT_PREFIXES_BASE);
  g_REMOVE_CSS = get_setup_property(in_config, "remove_css", g_REMOVE_CSS);
  g_SELF_CLOSING_HTML_TAGS = get_setup_property(in_config, "self_closing_tags", g_SELF_CLOSING_HTML_TAGS, g_SELF_CLOSING_HTML_TAGS_BASE);

  // DEPRECATE: OLD ATTRIBUTE ORDERING CONFIG
  setup_attribute_ordering(in_config);
}

// ******************************
// DEPRECATE: OLD ATTRIBUTE ORDERING CONFIG
// ******************************
function setup_attribute_ordering(in_config) {
  if (!in_config) {
    return;
  }

  let has_old_attributes_order_configs = false;

  if (get_setup_property(in_config, "ng1_attributes_order", false)) {
    has_old_attributes_order_configs = true;
    console.warn('Using old config key "ng1_attributes_order" use "ng_attributes_order" instead and specifiy the angular_version');
  }

  if (get_setup_property(in_config, "ng1_attributes_order_pre_native", false)) {
    has_old_attributes_order_configs = true;
    console.warn('Using old config key "ng1_attributes_order_pre_native" use "ng_attributes_order_pre_native" instead and specifiy the angular_version');
  }

  if (get_setup_property(in_config, "ng2_attributes_order", false)) {
    has_old_attributes_order_configs = true;
    console.warn('Using old config key "ng2_attributes_order" use "ng_attributes_order" instead and specifiy the angular_version');
  }

  if (get_setup_property(in_config, "ng2_attributes_order_pre_native", false)) {
    has_old_attributes_order_configs = true;
    console.warn('Using old config key "ng2_attributes_order_pre_native" use "ng_attributes_order_pre_native" instead and specifiy the angular_version');
  }

  if (g__DEPRECATED__NG1_ATTRIBUTES_ORDER
      || g__DEPRECATED__NG1_ATTRIBUTES_ORDER_PRE_NATIVE
      || g__DEPRECATED__NG2_ATTRIBUTES_ORDER
      || g__DEPRECATED__NG2_ATTRIBUTES_ORDER_PRE_NATIVE) {
    has_old_attributes_order_configs = true;
  }

  if (!has_old_attributes_order_configs) {
    return;
  }

  g__DEPRECATED__NG1_ATTRIBUTES_ORDER = get_setup_property(in_config, "ng1_attributes_order", g__DEPRECATED__NG1_ATTRIBUTES_ORDER);
  g__DEPRECATED__NG1_ATTRIBUTES_ORDER_PRE_NATIVE = get_setup_property(in_config, "ng1_attributes_order_pre_native", g__DEPRECATED__NG1_ATTRIBUTES_ORDER_PRE_NATIVE);
  g__DEPRECATED__NG2_ATTRIBUTES_ORDER = get_setup_property(in_config, "ng2_attributes_order", g__DEPRECATED__NG2_ATTRIBUTES_ORDER);
  g__DEPRECATED__NG2_ATTRIBUTES_ORDER_PRE_NATIVE = get_setup_property(in_config, "ng2_attributes_order_pre_native", g__DEPRECATED__NG2_ATTRIBUTES_ORDER_PRE_NATIVE);

  let ng1_attributes_order = g_NG_ATTRIBUTES_ORDER.concat(g__DEPRECATED__NG1_ATTRIBUTES_ORDER);
  let ng1_attributes_order_pre_native = g_NG_ATTRIBUTES_ORDER_PRE_NATIVE.concat(g__DEPRECATED__NG1_ATTRIBUTES_ORDER_PRE_NATIVE);
  let ng2_attributes_order = g_NG_ATTRIBUTES_ORDER.concat(g__DEPRECATED__NG2_ATTRIBUTES_ORDER);
  let ng2_attributes_order_pre_native = g_NG_ATTRIBUTES_ORDER_PRE_NATIVE.concat(g__DEPRECATED__NG2_ATTRIBUTES_ORDER_PRE_NATIVE);

  if (g_ANGULAR_VERSION >= 2.0 && g_ANGULAR_VERSION < 3.0) {
    g_NG_ATTRIBUTES_ORDER = ng2_attributes_order;
    g_NG_ATTRIBUTES_ORDER_PRE_NATIVE = ng2_attributes_order_pre_native;
  } else if (g_ANGULAR_VERSION < 2.0) {
    g_NG_ATTRIBUTES_ORDER = ng1_attributes_order;
    g_NG_ATTRIBUTES_ORDER_PRE_NATIVE = ng1_attributes_order_pre_native;
  }
}

// ******************************

function get_setup_property (in_config, in_field, in_default_value, in_base_value) {
  if (!in_config) {
    return in_default_value;
  }

  if (Array.isArray(in_field)) {
    let valid_fields = in_field.filter((field) => {return typeof(in_config[field]) !== "undefined";});
    if (!valid_fields || !valid_fields.length) {
      return in_default_value;
    }
    let field = valid_fields[0];
    return in_config[field];
  }

  if (typeof(in_config[in_field]) === "undefined") {
    return in_default_value;
  }
  let val = in_config[in_field];

  if (Array.isArray(in_base_value) && Array.isArray(val)) {
    val = in_base_value.concat(val);
  }

  return val;
}

// ******************************
// Functions:
// ******************************

function format_html_file (in_file_contents, in_indent_count, in_wrap_with_divs) {
  let result = false;

  do {
    let html_content = in_file_contents || '';
    if (html_content.trim().length === 0) {
      if (g_ALLOW_EMPTY_FILES) {
        return '';
      }
      throw 'Empty file!';
    }

    reset_html_variables();

    if (in_indent_count > 0) {
      g_INDENT_COUNT = in_indent_count;
    }

    html_content = html_content.replace(new RegExp(g_REGEX_NL, 'g'), t_NL);

    if (!parse_html(html_content)) {
      if (!in_wrap_with_divs) {
        return format_html_file('<div>'+in_file_contents+'</div>', in_indent_count, true);
      }

      throw 'Unrecognised HTML #' + g_HTML_LINE_NUMBER + ': \n' + g_HTML_INVALID.substr(0, 100) + ' ... ';
    }

    while(g_ELEMENT_STACK.length) {
      let top_element = g_ELEMENT_STACK.pop();
      if (top_element === k_COMMENT_TOKEN) {
        continue;
      }

      if (!in_wrap_with_divs) {
        return format_html_file('<div>'+in_file_contents+'</div>', in_indent_count, true);
      }

      throw 'HTML stack still contained element: ' + top_element;
    }

    result = '';

    if (in_indent_count > 0) {
      result += get_indent();
    }

    result += g_HTML_CONTENT;

    result = result.replace(new RegExp(t_NL, 'g'), g_NL);

    reset_html_variables();
  }
  while (false);

  return result;
}

// ******************************

function parse_html (in_html_content) {
  let result = false;

  let html_content = in_html_content || '';

  let functions = [
    parse_style,
    parse_html_open_element,
    parse_html_close_element,
    parse_comment,
    parse_content,
  ];

  let parse_run = 0;
  let max_parse_runs = 5000;

  try {

    let parsed = true;
    while (parsed) {
      parsed = false;
      parse_run++;

      if (html_content.trim().length === 0) {
        result = true;
        break;
      }

      functions.forEach(function(fn) {
        if (parsed) {
          return;
        }

        let remaining = fn(html_content);
        if (remaining !== false) {
          g_HTML_LINE_NUMBER += num_lines(html_content) - num_lines(remaining);
          html_content = remaining;
          parsed = true;
        }
      });

      if (parse_run > max_parse_runs) {
        throw('Too many parse runs!');
      }
    }

  } catch (err) {
    g_HTML_INVALID = html_content.substr(0, 200);
    throw('Invalid HTML #' + g_HTML_LINE_NUMBER + ': ' + err);
  }

  return result;
}

// ******************************

function parse_html_open_element (in_html_content) {
  let result = false;

  do {
    let html_content = in_html_content;
    let remaining = parse_html_open_element_start(html_content);
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
  }
  while (false);

  return result;
}

// ******************************

function parse_html_open_element_start (in_html_content) {
  let result = false;

  do {
    let matches = in_html_content.match(new RegExp('^' + r_v(r_W) + '<' + r_W + r_v(g_REGEX_HTML_ELEMENT) + r_v(r_AG) + '$', 'i'));
    if (!matches) {
      break;
    }

    matches.shift(); // First idx in match is the complete match string
    let whitespace_before = matches.shift() || '';
    let element = (matches.shift() || '').trim();
    let remaining = matches.shift() || '';

    // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+whitespace_before+'~~~'+element+'~~~'+remaining.substr(0,100)+'|------\n');

    g_CURRENT_ELEMENT = element;
    g_CURRENT_ELEMENT_ATTRIBUTES = [];
    g_CURRENT_ELEMENT_WHITESPACE_BEFORE = whitespace_before;

    result = remaining;
  }
  while (false);

  return result;
}

// ******************************

function parse_html_open_element_attributes (in_html_content) {
  let result = false;

  let html_content = in_html_content || '';

  let functions = [
    function (in_html_content) { return parse_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED); },
    function (in_html_content) { return parse_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED); },
    function (in_html_content) { return parse_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_EMPTY); },
    function (in_html_content) { return parse_attribute(in_html_content, k_ATTRIBUTE_TYPE_NO_VALUE); },
  ];

  if (g_ANGULAR_VERSION >= 2.0 && g_ANGULAR_VERSION < 3.0) {
    functions = functions.concat([
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_REFERENCE); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_REFERENCE); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_EMPTY, k_NG2_ATTRIBUTE_TYPE_REFERENCE); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_NO_VALUE, k_NG2_ATTRIBUTE_TYPE_REFERENCE); },

      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_EMPTY, k_NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_NO_VALUE, k_NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY); },

      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_EMPTY, k_NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_NO_VALUE, k_NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY); },

      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_EVENT); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_EVENT); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_EMPTY, k_NG2_ATTRIBUTE_TYPE_BINDING_EVENT); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_NO_VALUE, k_NG2_ATTRIBUTE_TYPE_BINDING_EVENT); },

      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED, k_NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_VALUE_EMPTY, k_NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE); },
      function (in_html_content) { return parse_ng2_attribute(in_html_content, k_ATTRIBUTE_TYPE_NO_VALUE, k_NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE); },
    ]);
  }

  let parsed = true;
  while (parsed) {
    parsed = false;

    if (html_content.trim().length === 0) {
      result = true;
      break;
    }

    functions.forEach(function(fn) {
      if (parsed) {
        return;
      }

      let remaining = fn(html_content);
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

function parse_attribute (in_html_content, in_attribute_type) {
  let result = false;

  do {

    let regExpString = '^' + r_W + r_v(g_REGEX_HTML_ATTRIBUTE_KEY);

    switch (in_attribute_type)
    {
      case k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED:
        regExpString += r_W + '=' + r_dq(r_v('\:\:') + '?' + r_W + r_v(g_REGEX_HTML_ATTRIBUTE_VALUE));
        break;

      case k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED:
        regExpString += r_W + '=' + r_sq(r_v('\:\:') + '?' + r_W + r_v(g_REGEX_HTML_ATTRIBUTE_VALUE));
        break;

      case k_ATTRIBUTE_TYPE_VALUE_EMPTY:
        regExpString += r_W + '=' + r_dq('');
        break;

      case k_ATTRIBUTE_TYPE_NO_VALUE:
        break;
    }

    regExpString += r_v(r_AG) + '$';

    let matches = in_html_content.match(new RegExp(regExpString, 'i'));
    if (!matches) {
      break;
    }

    matches.shift(); // First idx in match is the complete match string
    let key = matches.shift() || '';
    let val;
    let already_one_time_bound;

    switch (in_attribute_type)
    {
      case k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED:
      case k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED:
        already_one_time_bound = matches.shift() === '::';
        val = matches.shift() || '';

        let should_be_one_time_bound = key.match(new RegExp('('+g_ONE_TIME_BOUND_ELEMENT_PREFIXES.join('|')+').*?'));
        let should_not_be_one_time_bound = g_CURRENT_ELEMENT.match(new RegExp('('+g_NONE_ONE_TIME_BOUND_ELEMENTS.join('|')+')'));
        let binding = ((should_be_one_time_bound && !should_not_be_one_time_bound) || already_one_time_bound) ? '::' : '';

        if (val === '"true"' || val === '\'true\'' || val === 'true') {
          val = binding + 'true';
        } else if (val === '"false"' || val === '\'false\'' || val === 'false') {
          val = binding + 'false';
        } else if (is_numeric(val)) {
          val = binding + val;
        } else if (already_one_time_bound) {
          val = binding + val;
        } else if (val === '\'\'' || val.match(/^'[^']+'$/)) {
          val = binding + val;
        }
        break;

      case k_ATTRIBUTE_TYPE_VALUE_EMPTY:
        val = '';
        break;

      case k_ATTRIBUTE_TYPE_NO_VALUE:
        val = k_NO_VALUE_TOKEN;
        break;
    }

    g_CURRENT_ELEMENT_ATTRIBUTES[key] = val;
    let remaining = matches.shift() || '';

    // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+regExpString+'~~~'+key+'~~~'+already_one_time_bound+'~~~'+val+'~~~'+remaining.substr(0,100)+'|------\n');

    result = remaining;

  } while (false);

  return result;
}

// ******************************

function parse_ng2_attribute (in_html_content, in_attribute_type, in_ng2_binding_type) {
  let result = false;

  do {
    let regExpString = '^' + r_W;

    switch (in_ng2_binding_type)
    {
      case k_NG2_ATTRIBUTE_TYPE_REFERENCE:
        regExpString += r_v('#[@:a-z]+');
        break;

      case k_NG2_ATTRIBUTE_TYPE_BINDING_PROPERTY:
        regExpString += r_v('\[' + '[@:a-zA-Z._-]+' + '\]');
        break;

      case k_NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY:
        regExpString += r_v('\[\\(' + '[@:a-zA-Z._-]+' + '\\)\]');
        break;

      case k_NG2_ATTRIBUTE_TYPE_BINDING_EVENT:
        regExpString += r_v('\\(' + '[@:a-zA-Z._-]+' + '\\)');
        break;

      case k_NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE:
        regExpString += r_v('\\*' + '[@:a-zA-Z._-]+');
        break;
    }

    switch (in_attribute_type)
    {
      case k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED:
        regExpString += r_W + '=' + r_dq(r_v(g_REGEX_HTML_ATTRIBUTE_VALUE));
        break;

      case k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED:
        regExpString += r_W + '=' + r_sq(r_v(g_REGEX_HTML_ATTRIBUTE_VALUE));
        break;

      case k_ATTRIBUTE_TYPE_VALUE_EMPTY:
        regExpString += r_W + '=' + r_dq('');
        break;

      case k_ATTRIBUTE_TYPE_NO_VALUE:
        regExpString += ''; // Add nothing
        break;
    }

    regExpString += r_v(r_AG) + '$';

    let matches = in_html_content.match(new RegExp(regExpString, 'i'));
    if (!matches) {
      break;
    }

    matches.shift(); // First idx in match is the complete match string
    let key = matches.shift() || '';
    let val;

    switch (in_attribute_type)
    {
      case k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED:
      case k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED:
        val = matches.shift() || '';

        if (val === '"true"' || val === '\'true\'' || val === 'true') {
          val = 'true';
        } else if (val === '"false"' || val === '\'false\'' || val === 'false') {
          val = 'false';
        }

        break;

      case k_ATTRIBUTE_TYPE_VALUE_EMPTY:
        val = '';
        break;

      case k_ATTRIBUTE_TYPE_NO_VALUE:
        val = k_NO_VALUE_TOKEN;
        break;
    }

    g_CURRENT_ELEMENT_ATTRIBUTES[key] = val;
    let remaining = matches.shift() || '';

    // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+key+'~~~'+val+'~~~'+remaining.substr(0,100)+'|------\n');

    result = remaining;

  } while (false);

  return result;
}

// ******************************

function parse_html_open_element_end (in_html_content) {
  let result = false;

  do {
    let matches = in_html_content.match(new RegExp('^' + r_W + r_v('/') + '?>' + r_v(r_AG) + '$', 'i'));
    if (!matches) {
      break;
    }

    matches.shift(); // First idx in match is the complete match string
    let self_closing_tag = matches.shift() === '/';
    let remaining = matches.shift() || '';

    // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+self_closing_tag+'~~~'+remaining.substr(0,100)+'|------\n');

    let error = false;
    let output = '';
    let indent = '';
    let space_content = g_CURRENT_ELEMENT_WHITESPACE_BEFORE.length;

    if (self_closing_tag) {
      if (g_SELF_CLOSING_HTML_TAGS.indexOf(g_CURRENT_ELEMENT) >= 0) {
        output = '<' + g_CURRENT_ELEMENT + sort_attributes(g_CURRENT_ELEMENT_ATTRIBUTES) + '>';
        indent = t_NL + get_indent();
      } else {
        throw('Not a self closing HTML tag: ' + g_CURRENT_ELEMENT);
      }

    } else if (g_SELF_CLOSING_HTML_TAGS.indexOf(g_CURRENT_ELEMENT) >= 0) {
      output = '<' + g_CURRENT_ELEMENT + sort_attributes(g_CURRENT_ELEMENT_ATTRIBUTES) + '>';
      indent = t_NL + get_indent();

    } else {
      let top_element_info = get_top_element_info();

      output = '<' + g_CURRENT_ELEMENT + sort_attributes(g_CURRENT_ELEMENT_ATTRIBUTES) + '>';

      if (top_element_info.top_element_is_block_element) {
        indent = t_NL + get_indent();

      } else if (space_content) {
        if (top_element_info.had_content || top_element_info.had_comment || !top_element_info.top_element_is_inline_element) {
          if (top_element_info.top_element_is_inline_element) {
            indent = ' ';
          } else {
            if (g_CURRENT_ELEMENT_WHITESPACE_BEFORE.match(/^ +$/)) {
              indent = ' ';
            } else {
              indent = t_NL + get_indent();
            }
          }
        } else {
          indent = ' ';
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
  }
  while (false);

  return result;
}

// ******************************

function sort_attributes (in_attributes) {
  let result = '';

  do {
    if (!in_attributes) {
      break;
    }

    let attribute_keys = Object.keys(in_attributes);
    attribute_keys.sort();

    let attributes_order_pre_native = [];
    g_NG_ATTRIBUTES_ORDER_PRE_NATIVE.forEach((attribute) => {
      attributes_order_pre_native.push('^' + attribute + '$');
    })

    let attributes_order_post_native = [];
    g_NG_ATTRIBUTES_ORDER.forEach((attribute) => {
      attributes_order_post_native.push('^' + attribute + '$');
    })

    let sorted_attribute_keys = [];

    attributes_order_pre_native.forEach((special_order) => {
      attribute_keys.forEach((key) => {
        if (!key.match(new RegExp(special_order))) {
          return;
        }

        if (sorted_attribute_keys.indexOf(key) >= 0) {
          return;
        }

        sorted_attribute_keys.push(key);
      });
    });

    attribute_keys.forEach((key) => {
      let special_order_match = attributes_order_post_native.filter((special_order) => {
        let matches = key.match(new RegExp(special_order));
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

    attributes_order_post_native.forEach((special_order) => {
      attribute_keys.forEach((key) => {
        if (!key.match(new RegExp(special_order))) {
          return;
        }

        if (sorted_attribute_keys.indexOf(key) >= 0) {
          return;
        }

        sorted_attribute_keys.push(key);
      });
    });

    let indent = str_repeat(g_INDENT, g_INDENT_COUNT + 1);

    sorted_attribute_keys.forEach((key) => {

      let val = in_attributes[key];
      val = val.replace(/[\s]+/, ' ');

      if (val === k_NO_VALUE_TOKEN) {
        result += t_NL + indent + key;
        return;
      }

      let inline_variable = val.match(new RegExp('^(\:\:)?\{\{' + r_v(r_A) + '\}\}$', 'i'));
      if (!inline_variable) {

        let inline_block = val.match(new RegExp('^(\:\:)?\{' + r_v(r_AG) + '\}$', 'i'));
        if (inline_block) {
          let attribute_block_object_parse_result = parse_attribute_block_content(val);
          let binding = attribute_block_object_parse_result.binding;
          let attribute_block_object = attribute_block_object_parse_result.object;
          val = attribute_block_object_to_string(binding, attribute_block_object);
        }
      }

      if (key === k_ATTRIBUTE_NAME_CLASS) {
        let val_indent = str_repeat(g_INDENT, g_INDENT_COUNT + 2);

        if (g_MULTI_CLASSES_ORDER) {
          let classes = parse_classes_content(val);
          classes = sort_classes(classes);

          if (classes.length > g_FORMAT_MULTI_CLASSES_WITH_AT_LEAST) {
            val = t_NL + val_indent + classes.filter((val) => {return val.trim().length}).join(t_NL + val_indent);
          } else {
            val = classes.filter((val) => {return val.trim().length}).join(' ');
          }
        }
      }

      result += t_NL + indent + key + '="' + val + '"';
    });
  }
  while (false);

  return result;
}

// ******************************

function parse_classes_content (in_classes_content) {
  var result = false;

  do {
    let classes_content = in_classes_content || '';
    let classes_content_remaining = classes_content;

    g_CURRENT_ELEMENT_CLASSES = [];
    g_CURRENT_ELEMENT_CLASSES_CLASS_NAME = '';

    while (true) {
      let remaining = parse_classes_content_class_name(classes_content_remaining);
      if (remaining === false) {
        break;
      }
      classes_content_remaining = remaining;

      remaining = parse_classes_content_space(classes_content_remaining)
      if (remaining === false) {
        break;
      }
      classes_content_remaining = remaining;
    }

    if (classes_content_remaining) {
      throw 'Cannot parse classes: ' + classes_content.substr(0, 100).trim() + '...\n@' + classes_content_remaining.substr(0, 100).trim() + '...';
    }

    result = g_CURRENT_ELEMENT_CLASSES;
    g_CURRENT_ELEMENT_CLASSES = [];
    g_CURRENT_ELEMENT_CLASSES_CLASS_NAME = '';
  }
  while ( false );

  return result;
}

// ******************************

function parse_classes_content_space (in_classes_content) {
  let result = false;

  do {
    let classes_content = in_classes_content || '';

    let matches;
    if (!(matches = classes_content.match(new RegExp('^' + r_S + r_v(r_AG) + '$', 'i')))) {
      break;
    }

    matches.shift(); // First idx in match is the complete match string
    let remaining = matches.shift() || '';

    // console.log('[SPACE]"'+classes_content.substr(0,100)+'" => ~~~'+' '+'~~~'+remaining.substr(0,100)+'|------\n');

    result = remaining;

  } while (false);

  return result;
}

// ******************************

function parse_classes_content_class_name (in_classes_content) {
  let result = false;

  do {
    let classes_content = in_classes_content || '';

    let functions = [
      function (in_classes_content) { return parse_classes_content_class_name_type(in_classes_content, k_CLASS_TYPE_BINDING); },
      function (in_classes_content) { return parse_classes_content_class_name_type(in_classes_content, k_CLASS_TYPE_NORMAL); },
    ];

    let matched_value = false;
    functions.forEach(function(fn) {
      if (matched_value) {
        return;
      }
      let remaining = fn(classes_content);
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
  } while (false);

  return result;
}

// ******************************

function parse_classes_content_class_name_type (in_classes_content, in_class_name_type) {
  let result = false;

  do {
    let regExpString = '^';

    switch (in_class_name_type)
    {
      case k_CLASS_TYPE_BINDING:
        regExpString += r_W + r_v('[A-Z0-9a-z-_]*(?:\\{\\{.*?\\}\\}[A-Z0-9a-z-_]*)+');
        break;

      case k_CLASS_TYPE_NORMAL:
        regExpString += r_W + r_v('[A-Z0-9a-z-_]+');
        break;
    }

    regExpString += r_v(r_AG) + '$';

    let matches = in_classes_content.match(new RegExp(regExpString, 'i'));
    if (!matches) {
      break;
    }

    matches.shift(); // First idx in match is the complete match string
    let class_name = matches.shift() || '';
    let remaining = matches.shift() || '';

    g_CURRENT_ELEMENT_CLASSES_CLASS_NAME = class_name;

    // console.log(in_class_name_type+'"'+in_classes_content.substr(0,100)+'" => ~~~'+class_name+'~~~'+remaining.substr(0,100)+'|------\n');

    result = remaining;

  } while (false);

  return result;
}

// ******************************

function sort_classes (in_class_names) {
  var result = false;

  do {

    let class_names = in_class_names.sort();
    let sorted_class_names = [];

    g_MULTI_CLASSES_ORDER.forEach((class_order_regexp) => {
      class_names.forEach((class_name) => {
        if (!class_name.match(new RegExp(class_order_regexp))) {
          return;
        }

        if (sorted_class_names.indexOf(class_name) >= 0) {
          return;
        }

        sorted_class_names.push(class_name);
      });
    });

    class_names.forEach((class_name) => {
      let class_order_regexp_match = g_MULTI_CLASSES_ORDER.filter((class_order_regexp) => {
        let matches = class_name.match(new RegExp(class_order_regexp));
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
  }
  while ( false );

  return result;
}

// ******************************

function parse_attribute_block_content (in_attribute_block_content) {
  let result = false;

  do {
    let matches;
    if (!(matches = in_attribute_block_content.match(new RegExp('^(\:\:)?\{' + r_v(r_AG) + '\}$', 'i')))) {
      break;
    }

    g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT = [];
    g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE = '';

    matches.shift(); // First idx in match is the complete match string
    let binding = matches.shift() || '';
    let attribute_block_content = matches.shift() || '';
    let attribute_block_content_remaining = attribute_block_content;

    while (true) {
      let remaining = parse_attribute_block_content_entry(attribute_block_content_remaining);
      if (remaining === false) {
        break;
      }
      attribute_block_content_remaining = remaining;

      remaining = parse_attribute_block_content_comma(attribute_block_content_remaining)
      if (remaining === false) {
        break;
      }
      attribute_block_content_remaining = remaining;
    }

    if (attribute_block_content_remaining) {
      throw 'Cannot parse attribute object: ' + attribute_block_content.substr(0, 1000).trim() + '...\n@' + attribute_block_content_remaining.substr(0, 1000).trim() + '...';
    }

    result = {
      binding,
      object: g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT
    };
    g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT = [];
    g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE = '';

  }
  while (false);

  return result;
}

// ******************************

function parse_attribute_block_content_comma (in_attribute_block_content) {
  let result = false;

  do {
    let attribute_block_content = in_attribute_block_content || '';

    let matches;
    if (!(matches = attribute_block_content.match(new RegExp('^' + r_W + ',' + r_W + r_v(r_AG) + '$', 'i')))) {
      break;
    }

    matches.shift(); // First idx in match is the complete match string
    let remaining = matches.shift() || '';

    // console.log('[COMMA]"'+attribute_block_content.substr(0,100)+'" => ~~~'+','+'~~~'+remaining.substr(0,100)+'|------\n');

    result = remaining;

  } while (false);

  return result;
}

// ******************************

function parse_attribute_block_content_entry (in_attribute_block_content) {
  let result = false;

  do {
    let attribute_block_content = in_attribute_block_content || '';

    let matches;
    if (!(matches = attribute_block_content.match(new RegExp('^' + r_W + r_v('\'?[$A-Za-z0-9 _-]+\'?') + r_W + ':' + r_W + r_v(r_AG) + '$', 'i')))) {
      break;
    }

    matches.shift(); // First idx in match is the complete match string
    let key = matches.shift() || '';
    let val = matches.shift() || '';

    key = key.trim();

    // console.log('[KEY]"'+attribute_block_content.substr(0,100)+'" => ~~~'+key+'|------\n');

    result = parse_attribute_block_content_entry_key_value_pair(key, val);
  } while (false);

  return result;
}

// ******************************

function parse_attribute_block_content_entry_key_value_pair (in_attribute_block_content_entry_key, in_attribute_block_content_entry_value, in_aggregate) {
  let result = false;

  do {
    let key = in_attribute_block_content_entry_key || '';
    let val = in_attribute_block_content_entry_value || '';

    let functions = [
      function (in_key, in_val) { return parse_attribute_block_content_entry_key_value_pair_type(in_key, in_val, k_ATTRIBUTE_TYPE_VALUE_BOOLEAN); },
      function (in_key, in_val) { return parse_attribute_block_content_entry_key_value_pair_type(in_key, in_val, k_ATTRIBUTE_TYPE_VALUE_NUMERIC); },
      function (in_key, in_val) { return parse_attribute_block_content_entry_key_value_pair_type(in_key, in_val, k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED); },
      function (in_key, in_val) { return parse_attribute_block_content_entry_key_value_pair_type(in_key, in_val, k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED); },
      function (in_key, in_val) { return parse_attribute_block_content_entry_key_value_pair_type(in_key, in_val, k_ATTRIBUTE_TYPE_VALUE_ACCESSOR); },
      function (in_key, in_val) { return parse_attribute_block_content_entry_key_value_pair_type(in_key, in_val, k_ATTRIBUTE_TYPE_VALUE_BLOCK); },
    ];

    let matched_value = false;
    functions.forEach(function(fn) {
      if (matched_value) {
        return;
      }
      let remaining = fn(key, val);
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

    let matches;
    if (!(matches = result.match(new RegExp('^' + r_W + r_v('[+=!&|<>-]+') + r_W + r_v(r_AG) + '$', 'i')))) {
      break;
    }

    matches.shift(); // First idx in match is the complete match string
    let condition = matches.shift() || '';
    let remaining = matches.shift() || '';

    // console.log('[CONDITION]"'+result.substr(0,100)+'" => ~~~'+condition+'~~~'+remaining.substr(0,100)+'|------\n');

    g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT[key] += ' ' + condition;

    remaining = parse_attribute_block_content_entry_key_value_pair(in_attribute_block_content_entry_key, remaining, true);

    result = remaining;

  } while (false);

  return result;
}

// ******************************

function parse_attribute_block_content_entry_key_value_pair_type (in_attribute_block_content_entry_key, in_attribute_block_content_entry_value, in_attribute_type) {
  let result = false;

  do {
    let regExpString = '^';

    switch (in_attribute_type)
    {
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

      case k_ATTRIBUTE_TYPE_VALUE_ACCESSOR:
        regExpString += r_W + r_v('[!$a-zA-Z_]+(?:\\.[a-zA-Z_]+\\(?[a-zA-Z0-9_"\'-]*\\)?)*');
        break;
    }

    regExpString += r_W + r_v(r_AG) + '$';

    let matches = in_attribute_block_content_entry_value.match(new RegExp(regExpString, 'i'));
    if (!matches) {
      break;
    }

    let key = in_attribute_block_content_entry_key;

    matches.shift(); // First idx in match is the complete match string
    let val = matches.shift() || '';
    let remaining = matches.shift() || '';

    if (in_attribute_type === k_ATTRIBUTE_TYPE_VALUE_BLOCK) {
      let tmp_CURRENT_ELEMENT_ATTRIBUTE_OBJECT = g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT;
      let attribute_block_object_parse_result = parse_attribute_block_content(val);
      let binding = attribute_block_object_parse_result.binding;
      let attribute_block_object = attribute_block_object_parse_result.object;
      g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT = tmp_CURRENT_ELEMENT_ATTRIBUTE_OBJECT;

      val = attribute_block_object;
    }

    g_CURRENT_ELEMENT_ATTRIBUTE_BLOCK_OBJECT_ENTRY_VALUE = val;

    // console.log(in_attribute_type+'['+key+']"'+in_attribute_block_content_entry_value.substr(0,100)+'" => ~~~'+val+'~~~'+remaining.substr(0,100)+'|------\n');

    result = remaining;

  } while (false);

  return result;
}

// ******************************

function attribute_block_object_to_string (in_binding, in_attribute_block_object) {
  let result = false;

  do {
    inc_indent(1);
    let indent = get_indent();

    let attribute_block_object_formatted = '{';

    let attribute_block_object_entry_keys = Object.keys(in_attribute_block_object);
    attribute_block_object_entry_keys.sort();

    attribute_block_object_entry_keys.forEach((attribute_block_object_entry_key) => {
      let attribute_block_object_entry_value = in_attribute_block_object[attribute_block_object_entry_key];
      if (typeof(attribute_block_object_entry_value) === "object") {
        attribute_block_object_entry_value = attribute_block_object_to_string( '', attribute_block_object_entry_value );
      }
      attribute_block_object_formatted += t_NL + indent + g_INDENT + attribute_block_object_entry_key + ': ' + attribute_block_object_entry_value + ',';
    });

    if (attribute_block_object_entry_keys.length > 0) {
      attribute_block_object_formatted = attribute_block_object_formatted.substr(0, attribute_block_object_formatted.length - 1) + t_NL + indent;
    }

    attribute_block_object_formatted += '}';
    inc_indent(-1);

    result = in_binding + attribute_block_object_formatted;
  }
  while (false);

  return result;
}

// ******************************

function parse_html_close_element (in_html_content) {
  let result = false;

  do {
    let matches = in_html_content.match(new RegExp('^' + r_v(r_W) + '</' + r_W + r_v(g_REGEX_HTML_ELEMENT) + r_W + '>' + r_v(r_AG) + '$', 'i'));
    if (!matches) {
      break;
    }

    matches.shift(); // First idx in match is the complete match string
    let whitespace_before = matches.shift() || '';
    let element = (matches.shift() || '').trim();
    let remaining = matches.shift() || '';

    // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+whitespace_before+'~~~'+element+'~~~'+remaining.substr(0,100)+'|------\n');

    let space_content = whitespace_before.length;

    let output = '';
    let indent = '';

    inc_indent(-1);

    let top_element_info = get_top_element_info(true);
    if (!top_element_info.top_element) {
      throw('Closing "' + element + '" but there is no matching open element');
    }

    if (top_element_info.top_element !== element) {
      throw('expected "' + top_element_info.top_element + '" but got "' + element + '"');
    }

    let top_element_is_empty = (
      !top_element_info.had_content &&
      !top_element_info.had_comment &&
      top_element_info.top_element === g_CURRENT_ELEMENT);

    output = '</' + element + '>';

    if (top_element_info.top_element_is_block_element) {
      indent = t_NL + get_indent();
    } else if (space_content) {
      if (top_element_is_empty && top_element_info.top_element_is_inline_element) {
        indent = '';
      } else if (top_element_info.had_content || top_element_info.had_comment || !top_element_info.top_element_is_inline_element) {
        if (top_element_info.top_element_is_inline_element) {
          indent = ' ';
        } else {
          if (whitespace_before.match(/^ +$/)) {
            indent = ' ';
          } else {
            indent = t_NL + get_indent();
          }
        }
      } else {
        indent = ' ';
      }
    }

    if (g_HTML_CONTENT.length) {
      g_HTML_CONTENT += indent;
    }

    g_HTML_CONTENT += output;

    result = remaining;
  }
  while (false);

  return result;
}

// ******************************

function parse_content (in_html_content) {
  let result = false;

  do {
    let matches = in_html_content.match(new RegExp('^' + r_v(r_W) + r_v(g_REGEX_HTML_CONTENT) + r_v(r_W + '<' + r_AG) + '$', 'i'));
    if (!matches) {
      break;
    }

    matches.shift(); // First idx in match is the complete match string
    let whitespace_before = matches.shift() || '';
    let content = (matches.shift() || '').trim();
    let remaining = matches.shift() || '';

    // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+whitespace_before+'~~~'+content+'~~~'+remaining+'|------\n');

    let space_content = whitespace_before.length;

    if (!content.trim().length) {
      result = remaining;
      break;
    }

    content = content.replace(new RegExp('^ *', 'gm'), get_indent());
    content = content.replace(new RegExp('^[\\s]*$', 'gm'), '');
    content = content.replace(new RegExp('^ *'), '');

    g_ELEMENT_STACK.push(k_CONTENT_TOKEN);

    let indent = '';

    let top_element_info = get_top_element_info();
    if (top_element_info.top_element_is_block_element) {
      indent = t_NL + get_indent();
    } else if (space_content) {
      if (top_element_info.had_content || top_element_info.had_comment || !top_element_info.top_element_is_inline_element) {
        if (top_element_info.top_element_is_inline_element) {
          indent = ' ';
        } else {
          if (whitespace_before.match(/^ +$/)) {
            indent = ' ';
          } else {
            indent = t_NL + get_indent();
          }
        }
      } else {
        indent = ' ';
      }
    }

    if (g_HTML_CONTENT.length) {
      g_HTML_CONTENT += indent;
    }

    g_HTML_CONTENT += content;

    result = remaining;
  }
  while (false);

  return result;
}

// ******************************

function parse_comment (in_html_content) {
  let result = false;

  do {
    let matches = in_html_content.match(new RegExp('^' + r_v(r_W) + g_REGEX_HTML_COMMENT + r_v(r_AG), 'i'));
    if (!matches) {
      break;
    }

    matches.shift(); // First idx in match is the complete match string
    let whitespace_before = !!(matches.shift() || '').length;
    let comment = (matches.shift() || '').trim();
    let remaining = matches.shift() || '';

    let multi_line_comment = comment.match(new RegExp('\\n'));

    g_ELEMENT_STACK.push(k_COMMENT_TOKEN);

    let indent = '';

    let top_element_info = get_top_element_info();
    if (top_element_info.top_element_is_block_element) {
      indent = t_NL + get_indent();
    } else if (whitespace_before) {
      if (top_element_info.top_element_is_inline_element) {
        indent = ' ';
      } else {
        indent = t_NL + get_indent();
      }
    }

    if (g_HTML_CONTENT.length > 0) {
      g_HTML_CONTENT += indent;
    }

    if (multi_line_comment) {
      inc_indent(1);
      g_HTML_CONTENT += '<!--';
      g_HTML_CONTENT += t_NL;

      let indented_comment = comment;
      indented_comment = indented_comment.replace(new RegExp('^ *', 'gm'), get_indent());
      indented_comment = indented_comment.replace(new RegExp('^[\\s]*$', 'gm'), '');

      g_HTML_CONTENT += indented_comment;
      inc_indent(-1);
      g_HTML_CONTENT += t_NL + get_indent();
      g_HTML_CONTENT += '-->';
    } else {
      g_HTML_CONTENT += '<!-- ' + comment + ' -->';
    }

    result = remaining;
  }
  while (false);

  return result;
}

// ******************************

function parse_style (in_html_content) {
  let result = false;

  do {
    let matches = in_html_content.match(new RegExp('^' + r_v(r_W) + g_REGEX_HTML_STYLE + r_v(r_AG) + '$', 'i'));
    if (!matches) {
      break;
    }

    matches.shift(); // First idx in match is the complete match string
    let whitespace_before = !!(matches.shift() || '').length;
    let css = (matches.shift() || '').trim();
    let remaining = matches.shift() || '';

    // console.log('"'+in_html_content.substr(0,100)+'" => ~~~'+whitespace_before+'~~~'+css+'~~~'+remaining+'|------\n');

    let output = '';
    let indent = '';

    let top_element_info = get_top_element_info();
    if (top_element_info.top_element_is_block_element) {
      indent = t_NL + get_indent();
    } else if (whitespace_before) {
      if (top_element_info.top_element_is_inline_element) {
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
      css = css.replace(/([\r][\n]|[\r]|[\n])/g, t_NL);
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
  }
  while (false);

  return result;
}

// ******************************

function reset_html_variables () {
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
  }
  while (false);
}

// ******************************

function get_top_element_info (in_pop) {
  var result = false;

  do
  {
    let had_content = false;
    let had_comment = false;
    let top_element_idx = g_ELEMENT_STACK.length - 1;
    let top_element = '';

    let found_signal_element = true;
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
    }

    result = {
      had_comment,
      had_content,
      top_element,
      top_element_is_inline_element: (g_INLINE_ELEMENTS.indexOf(top_element) >= 0),
      top_element_is_block_element: (g_BLOCK_ELEMENTS.indexOf(top_element) >= 0)
    };
  }
  while ( false );

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

function get_indent () {
  return str_repeat(g_INDENT, g_INDENT_COUNT);
}

// ******************************

function inc_indent (in_inc) {
  g_INDENT_COUNT = Math.max(0, g_INDENT_COUNT + in_inc);
}

// ******************************

function is_numeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// ******************************

function str_repeat (s, n) {
  return Array(n+1).join(s);
}

// ******************************
