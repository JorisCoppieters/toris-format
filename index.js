'use strict'; // JS: ES5

// ******************************
//
//
// TORIS FORMAT v1.6.1
//
// Version History:
//
// 1.6.1
// - Added support for vh as a measurement in CSS grammar
// - Added support for >>> as a selector in CSS grammar
// - Added option to add noopener noreferrer to <a target="_blank"><a/> links
//
// 1.6.0
// - Started work on refactoring into proper AST with Grammar files
// - Added support for scss files
//
// 1.5.1
// - Bug fix around whitespace before content within block elements
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
// Requires:
// ******************************

var formatter = require('./src/formatter');
var parser = require('./src/parser');
var parserHtml = require('./src/parser_html');
var printer = require('./src/printer');
var tree = require('./src/tree');

// ******************************
// Constants:
// ******************************

const k_VERSION = '1.6.1';

// ******************************
// Exports:
// ******************************

module.exports['k_VERSION'] = k_VERSION;
module.exports['k_DEFINITION_TYPE_SCSS'] = parser.k_DEFINITION_TYPE_SCSS;
module.exports['k_DEFINITION_TYPE_HTML'] = parser.k_DEFINITION_TYPE_HTML;

module.exports['format_file'] = formatter.format_file;
module.exports['formatFile'] = formatter.format_file;
module.exports['format_contents'] = formatter.format_contents;
module.exports['formatContents'] = formatter.format_contents;

module.exports['print_file'] = printer.print_file;
module.exports['printFile'] = printer.print_file;
module.exports['print_contents'] = printer.print_contents;
module.exports['print_contents_diff'] = printer.print_contents_diff;

module.exports['format_html_contents'] = parserHtml.format_html_contents; // TODO: Deprecate
module.exports['format_html_file'] = parserHtml.format_html_contents; // TODO: Deprecate

// ******************************