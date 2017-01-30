'use strict';

// ******************************
//
//
// TORIS FORMAT v1.4.0
//
//
// ******************************

// ******************************
// Constants:
// ******************************

const k_VERSION = '1.4.0';
const k_COMMENT_TOKEN = '[COMMENT]';
const k_CONTENT_TOKEN = '[CONTENT]';
const k_NO_VALUE_TOKEN = '[NOVALUE]';

const k_ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED = '[ATTRIBUTE_TYPE_VALUE_SINGLE_QUOTED]';
const k_ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED = '[ATTRIBUTE_TYPE_VALUE_DOUBLE_QUOTED]';
const k_ATTRIBUTE_TYPE_VALUE_EMPTY = '[ATTRIBUTE_TYPE_VALUE_EMPTY]';
const k_ATTRIBUTE_TYPE_NO_VALUE = '[ATTRIBUTE_TYPE_NO_VALUE]';

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

let g_ELEMENT_STACK = [];
let g_CURRENT_ELEMENT = '';
let g_CURRENT_ELEMENT_ATTRIBUTES = [];
let g_CURRENT_ELEMENT_WHITESPACE_BEFORE = false;

let g_HTML_CONTENT = '';
let g_HTML_INVALID = '';
let g_HTML_LINE_NUMBER = 1;

let g_INDENT_COUNT = 0;
let g_INDENT = '    ';

let g_SELF_CLOSING_HTML_TAGS = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
let g_INLINE_ELEMENTS = ['a', 'abbr', 'acronym', 'b', 'basefont', 'bdo', 'big', 'br', 'cite', 'code', 'dfn', 'em', 'font', 'i', 'img', 'input', 'kbd', 'label', 'q', 's', 'samp', 'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'textarea', 'tt', 'u', 'var'];
let g_BLOCK_ELEMENTS = ['address', 'blockquote', 'center', 'dir', 'div', 'dl', 'fieldset', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'isindex', 'menu', 'noframes', 'noscript', 'ol', 'p', 'pre', 'table', 'ul'];

let g_ONE_TIME_BOUND_ELEMENT_PREFIXES = ['ng-'];
let g_NONE_ONE_TIME_BOUND_ELEMENTS = [];

let g_REMOVE_CSS = true;

let g_ANGULAR_VERSION = 1;

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

  g_NL                     = get_setup_property(in_config, "line_ending", g_NL);
  g_INDENT                 = get_setup_property(in_config, "indent", g_INDENT);
  g_SELF_CLOSING_HTML_TAGS = get_setup_property(in_config, "self_closing_tags", g_SELF_CLOSING_HTML_TAGS);
  g_REMOVE_CSS             = get_setup_property(in_config, "remove_css", g_REMOVE_CSS);
  g_ANGULAR_VERSION        = get_setup_property(in_config, "angular_version", g_ANGULAR_VERSION);

  let inline_elements = get_setup_property(in_config, "inline_elements", []);
  g_INLINE_ELEMENTS = g_INLINE_ELEMENTS.concat(inline_elements);

  let block_elements = get_setup_property(in_config, "block_elements", []);
  g_BLOCK_ELEMENTS = g_BLOCK_ELEMENTS.concat(block_elements);

  let one_time_bound_element_prefixes = get_setup_property(in_config, "one_time_bound_element_prefixes", []);
  g_ONE_TIME_BOUND_ELEMENT_PREFIXES = g_ONE_TIME_BOUND_ELEMENT_PREFIXES.concat(one_time_bound_element_prefixes);

  let none_one_time_bound_elements = get_setup_property(in_config, "none_one_time_bound_elements", []);
  g_NONE_ONE_TIME_BOUND_ELEMENTS = g_NONE_ONE_TIME_BOUND_ELEMENTS.concat(none_one_time_bound_elements);
}

// ******************************

function get_setup_property (in_config, in_field, in_default_value) {
  if (!in_config) {
    return in_default_value;
  }
  if (typeof(in_config[in_field]) === "undefined") {
    return in_default_value;
  }
  return in_config[in_field];
}

// ******************************
// Functions:
// ******************************

function format_html_file (in_file_contents, in_indent_count) {
  let result = false;

  do {
    let html_content = in_file_contents || '';
    if (html_content.trim().length === 0) {
      throw 'Empty file!';
    }

    reset_html_variables();

    if (in_indent_count > 0) {
      g_INDENT_COUNT = in_indent_count;
    }

    html_content = html_content.replace(new RegExp(g_REGEX_NL, 'g'), t_NL);

    if (!parse_html(html_content)) {
      throw 'Unrecognised HTML #' + g_HTML_LINE_NUMBER + ': \n' + g_HTML_INVALID.substr(0, 100) + ' ... ';
    }

    while(g_ELEMENT_STACK.length) {
      let top_element = g_ELEMENT_STACK.pop();
      if (top_element === k_COMMENT_TOKEN) {
        continue;
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
    while(parsed) {
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

    let whitespace_before = !!(matches[1] || '').length;
    let element = (matches[2] || '').trim();
    let remaining = matches[3] || '';

    // console.log('"'+in_html_content.substr(0,100)+'" => |'+whitespace_before+'|'+element+'|'+remaining.substr(0,100)+'|------\n');

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
  while(parsed) {
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

    // console.log('"'+in_html_content.substr(0,100)+'" => |'+regExpString+'|'+key+'|'+already_one_time_bound+'|'+val+'|'+remaining.substr(0,100)+'|------\n');

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
        regExpString += r_v('\[' + '[@:a-zA-Z._]+' + '\]');
        break;

      case k_NG2_ATTRIBUTE_TYPE_BINDING_TWO_WAY_PROPERTY:
        regExpString += r_v('\[\\(' + '[@:a-zA-Z._]+' + '\\)\]');
        break;

      case k_NG2_ATTRIBUTE_TYPE_BINDING_EVENT:
        regExpString += r_v('\\(' + '[@:a-zA-Z._]+' + '\\)');
        break;

      case k_NG2_ATTRIBUTE_TYPE_BINDING_CUSTOM_DIRECTIVE:
        regExpString += r_v('\\*' + '[@:a-zA-Z._]+');
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

    // console.log('"'+in_html_content.substr(0,100)+'" => |'+key+'|'+val+'|'+remaining.substr(0,100)+'|------\n');

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

    let self_closing_tag = matches[1] === '/';
    let remaining = matches[2] || '';

    // console.log('"'+in_html_content.substr(0,100)+'" => |'+self_closing_tag+'|'+remaining.substr(0,100)+'|------\n');

    let space_content = g_CURRENT_ELEMENT_WHITESPACE_BEFORE;
    let had_content = false;
    let had_comment = false;
    let error = false;

    let output = '';
    let indent = '';

    if (self_closing_tag) {
      if (g_SELF_CLOSING_HTML_TAGS.indexOf(g_CURRENT_ELEMENT) >= 0) {
        output = '<' + g_CURRENT_ELEMENT + tabbed_attributes(g_CURRENT_ELEMENT_ATTRIBUTES) + '>';
        indent = t_NL + get_indent();
      } else {
        throw('Not a self closing HTML tag: ' + g_CURRENT_ELEMENT);
      }

    } else if (g_SELF_CLOSING_HTML_TAGS.indexOf(g_CURRENT_ELEMENT) >= 0) {
      output = '<' + g_CURRENT_ELEMENT + tabbed_attributes(g_CURRENT_ELEMENT_ATTRIBUTES) + '>';
      indent = t_NL + get_indent();

    } else {
      let previous_element = g_ELEMENT_STACK.length ? g_ELEMENT_STACK[g_ELEMENT_STACK.length - 1] : '';
      had_content = (previous_element === k_CONTENT_TOKEN);
      had_comment = (previous_element === k_COMMENT_TOKEN);

      output = '<' + g_CURRENT_ELEMENT + tabbed_attributes(g_CURRENT_ELEMENT_ATTRIBUTES) + '>';

      if (!had_content && !had_comment) {
        indent = t_NL + get_indent();
      } else if ((had_content || had_comment) && space_content) {
        indent = t_NL + get_indent();
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

function parse_html_close_element (in_html_content) {
  let result = false;

  do {
    let matches = in_html_content.match(new RegExp('^' + r_v(r_W) + '</' + r_W + r_v(g_REGEX_HTML_ELEMENT) + r_W + '>' + r_v(r_AG) + '$', 'i'));
    if (!matches) {
      break;
    }

    let whitespace_before = !!(matches[1] || '').length;
    let element = (matches[2] || '').trim();
    let remaining = matches[3] || '';

    // console.log('"'+in_html_content.substr(0,100)+'" => |'+whitespace_before+'|'+element+'|'+remaining.substr(0,100)+'|------\n');

    let had_content = false;
    let had_comment = false;
    let space_content = whitespace_before;

    let output = '';
    let indent = '';

    inc_indent(-1);

    let top_element = g_ELEMENT_STACK.pop();

    let found_signal_element = true;
    while (found_signal_element) {
      found_signal_element = false;

      if (top_element === k_CONTENT_TOKEN) {
        top_element = g_ELEMENT_STACK.pop();
        had_content = true;
        found_signal_element = true;
        continue;
      }

      if (top_element === k_COMMENT_TOKEN) {
        top_element = g_ELEMENT_STACK.pop();
        had_comment = true;
        found_signal_element = true;
        continue;
      }
    }

    if (!top_element) {
      throw('Closing "' + element + '" but there is no matching open element');
    }

    if (top_element !== element) {
      g_ELEMENT_STACK.push(top_element);
      g_CURRENT_ELEMENT = element;

      if (had_content) {
        g_ELEMENT_STACK.push(k_CONTENT_TOKEN);
      }
      if (had_comment) {
        g_ELEMENT_STACK.push(k_COMMENT_TOKEN);
      }

      throw('expected "' + top_element + '" but got "' + element + '"');
    }

    let child_element = (top_element === g_CURRENT_ELEMENT);
    let inline_element = (g_INLINE_ELEMENTS.indexOf(top_element) >= 0);
    let block_element = (g_BLOCK_ELEMENTS.indexOf(top_element) >= 0);

    output = '</' + element + '>';

    if ((had_content || had_comment || !child_element || !inline_element) && space_content)
      indent = t_NL + get_indent();
    else if (block_element)
      indent = t_NL + get_indent();

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

    let whitespace_before = matches[1] || '';
    let content = (matches[2] || '').trim();
    let remaining = matches[3] || '';

    // console.log('"'+in_html_content+'" => |'+whitespace_before+'|'+content+'|'+remaining+'|------\n');

    let had_comment = false;
    let space_content = !!whitespace_before.length;

    if (!content.trim().length) {
      result = remaining;
      break;
    }

    content = content.replace(new RegExp('^ *', 'gm'), get_indent());
    content = content.replace(new RegExp('^[\\s]*$', 'gm'), '');
    content = content.replace(new RegExp('^ *'), '');

    let top_element = g_ELEMENT_STACK.length ? g_ELEMENT_STACK[g_ELEMENT_STACK.length - 1] : '';
    let top_element_is_block_element = (g_BLOCK_ELEMENTS.indexOf(top_element) >= 0);

    if (top_element === k_COMMENT_TOKEN) {
      had_comment = true;
    }

    if (top_element_is_block_element) {
      space_content = true;
    }

    g_ELEMENT_STACK.push(k_CONTENT_TOKEN);

    if (had_comment) {
      g_HTML_CONTENT += ' ' + content;
    } else if (space_content) {
      g_HTML_CONTENT += t_NL + get_indent() + content;
    } else {
      g_HTML_CONTENT += content;
    }

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

    let whitespace_before = !!(matches[1] || '').length;
    let comment = (matches[2] || '').trim();
    let remaining = matches[3];

    // let top_element = g_ELEMENT_STACK.length ? g_ELEMENT_STACK[g_ELEMENT_STACK.length - 1] : '';
    // if (!top_element) {
    //   throw('Comment doesn\'t have parent element');
    // }

    g_ELEMENT_STACK.push(k_COMMENT_TOKEN);

    if (g_HTML_CONTENT.length > 0 && whitespace_before)
      g_HTML_CONTENT += t_NL + get_indent();

    if (comment.match(new RegExp('\\n'))) {
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
    let matches = in_html_content.match(new RegExp('^' + r_W + g_REGEX_HTML_STYLE + r_W + r_v(r_AG) + '$', 'i'));
    if (!matches) {
      break;
    }

    let css = (matches[1] || '').trim();
    let remaining = (matches[2] || '').trim();

    if (g_REMOVE_CSS) {
      g_HTML_CONTENT += t_NL + get_indent() + '<!-- REMOVED CSS FROM TEMPLATE -->';
      result = remaining;
      break;
    }

    if (css.trim().length) {
      g_HTML_CONTENT += t_NL + get_indent() + '<style type="text/css">';
      inc_indent(1);
      css = css.replace(/([\r][\n]|[\r]|[\n])/g, t_NL);
      g_HTML_CONTENT += t_NL + get_indent() + css;
      inc_indent(-1);
      g_HTML_CONTENT += t_NL + get_indent() + '</style>';
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
    g_CURRENT_ELEMENT_WHITESPACE_BEFORE = false;
  }
  while (false);
}

// ******************************

function tabbed_attributes (in_attributes) {
  let result = '';

  do {
    if (!in_attributes) {
      break;
    }

    let attribute_keys = Object.keys(in_attributes);
    attribute_keys.sort();

    let attributes_order_pre_native = [];

    if (g_ANGULAR_VERSION >= 2.0 && g_ANGULAR_VERSION < 3.0) {
      attributes_order_pre_native = attributes_order_pre_native.concat([
        '^\\*.*$',
        '^\\#.*$',
        '^\\[\\(.*\\)\\]$',
        '^\\(.*\\)$',
        '^\\[.*\\]$'
      ]);
    }

    let attributes_order_post_native = [
      '^ng-.*$',
      '^tg-sm.*$',
      '^tg-sd.*$',
      '^tg-md.*$',
      '^tg-mg.*$',
      '^tg-lg.*$',
      '^tg-ll.*$',
      '^tg-xl.*$',
      '^tg-.*$',
      '^tm-.*$'
    ];

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

        let inline_object = val.match(new RegExp('^(\:\:)?\{' + r_v(r_AG) + '\}$', 'i'));
        if (inline_object) {
          val = parse_attribute_object(val);
        }
      }

      result += t_NL + indent + key + '="' + val + '"';
    });
  }
  while (false);

  return result;
}

// ******************************

function parse_attribute_object (in_val) {
  let result = false;

  do {
    let matches;
    if (!(matches = in_val.match(new RegExp('^(\:\:)?\{' + r_v(r_AG) + '\}$', 'i')))) {
      return;
    }

    let indent = str_repeat(g_INDENT, g_INDENT_COUNT + 1);

    let struct_attributes = [];
    let binding = matches[1] || '';
    let structure = matches[2] || '';

    let re_val = '[!$A-Z0-9.;\(\)\'" +_-]+';
    let re_key = '\'?[$A-Z0-9 _-]+\'?';

    let re_num_val = '[0-9]+';
    let re_quoted_val = '\'' + r_A + '\'';
    let re_conditional_val = re_val + r_g(r_W + '[=!&|]+' + r_W + re_val) + '+';
    let re_block_val = '{' + r_A + '}';

    let re_vals = false;
    ['true', 'false', re_num_val, re_conditional_val, re_quoted_val, re_val].forEach((re_segment) => {
      if (re_vals) {
        re_vals = re_segment + '|' + r_g(re_vals);
      } else {
        re_vals = re_segment;
      }
    });

    re_vals = r_w(r_g(re_vals));

    let re;
    let struct_attribute_key;
    let struct_attribute_val;
    let match = true;

    structure = structure.replace(/  +/g, ' ');

    while (match) {
      match = false;

      re = new RegExp(r_v(r_A) + r_W + r_v(re_key) + r_W + ':' + r_W + r_v(re_block_val) + r_W + ',' + r_W + r_v(r_AG), 'i');
      if (matches = structure.match(re)) {
        // console.log('"'+structure+'" => |==|'+matches.slice(2, 4).join('|==|')+'|==|------\n');

        struct_attribute_key = (matches[2] || '').trim();
        struct_attribute_val = (matches[3] || '').trim();
        inc_indent(1);
        struct_attribute_val = parse_attribute_object(struct_attribute_val);
        inc_indent(-1);

        struct_attributes[struct_attribute_key] = struct_attribute_val;
        structure = (matches[1] + ' ' + matches[matches.length - 1]).trim();
        match = true;
        continue;
      }

      re = new RegExp('^' + r_W + r_v(re_key) + r_W + ':' + r_W + r_v(re_block_val) + r_W + '$', 'i');
      if (matches = structure.match(re)) {
        // console.log('"'+structure+'" => |==|'+matches.slice(1,3).join('|==|')+'|==|------\n');

        struct_attribute_key = (matches[1] || '').trim();
        struct_attribute_val = (matches[2] || '').trim();
        inc_indent(1);
        struct_attribute_val = parse_attribute_object(struct_attribute_val);
        inc_indent(-1);

        struct_attributes[struct_attribute_key] = struct_attribute_val;
        structure = '';
        match = true;
        continue;
      }

      re = new RegExp(r_v(r_A) + r_W + r_v(re_key) + r_W + ':' + r_W + r_v(re_vals) + r_W + ',' + r_W + r_v(r_AG), 'i');
      if (matches = structure.match(re)) {
        // console.log('"'+structure+'" => |==|'+matches.slice(2, 4).join('|==|')+'|==|------\n');

        struct_attribute_key = (matches[2] || '').trim();
        struct_attribute_val = (matches[3] || '').trim();

        struct_attributes[struct_attribute_key] = struct_attribute_val;
        structure = (matches[1] + ' ' + matches[matches.length - 1]).trim();
        match = true;
        continue;
      }

      re = new RegExp(r_v(r_A) + r_W + r_v(re_key) + r_W + ':' + r_W + r_v(re_vals) + r_W + ',' + r_W + r_v(r_AG), 'i');
      if (matches = structure.match(re)) {
        //console.log('|==|'+matches.slice(2).join('|==|')+'|==|------\n');

        struct_attribute_key = (matches[2] || '').trim();
        struct_attribute_val = (matches[3] || '').trim();

        struct_attributes[struct_attribute_key] = struct_attribute_val;
        structure = (matches[1] + ' ' + matches[matches.length - 1]).trim();
        match = true;
        continue;
      }

      re = new RegExp('^' + r_W + r_v(re_key) + r_W + ':' + r_W + r_v(re_vals) + r_W + '$', 'i');
      if (matches = structure.match(re)) {
        //console.log('"'+structure+'" => |==|'+matches.slice(1).join('|==|')+'|==|------\n');

        struct_attribute_key = (matches[1] || '').trim();
        struct_attribute_val = (matches[2] || '').trim();

        struct_attributes[struct_attribute_key] = struct_attribute_val;
        structure = '';
        match = true;
        continue;
      }

      re = new RegExp('^' + r_W + r_v(re_key) + r_W + ':' + r_W + r_v(re_vals) + r_W + '$', 'i');
      if (matches = structure.match(re)) {
        //console.log('"'+structure+'" => |==|'+matches.slice(1).join('|==|')+'|==|------\n');

        struct_attribute_key = (matches[1] || '').trim();
        struct_attribute_val = (matches[2] || '').trim();

        struct_attributes[struct_attribute_key] = struct_attribute_val;
        structure = '';
        match = true;
        continue;
      }
    }

    let struct_val = '{';

    let struct_attributes_keys = Object.keys(struct_attributes);
    struct_attributes_keys.sort();

    struct_attributes_keys.forEach((struct_attribute_key) => {
      let struct_attribute_val = struct_attributes[struct_attribute_key];
      struct_val += t_NL + indent + g_INDENT + struct_attribute_key + ': ' + struct_attribute_val + ',';
    });

    if (struct_attributes_keys.length > 0) {
      struct_val = struct_val.substr(0, struct_val.length - 1) + t_NL + indent;
    }

    struct_val += '}';

    result = binding + struct_val;
  }
  while (false);

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
