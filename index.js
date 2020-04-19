'use strict'; // JS: ES5

// ******************************
//
//
// TORIS FORMAT v1.7.16-powershell-to-python-grammar
//
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
var test = require('./src/test');
var logger = require('./src/logger');

// ******************************
// Constants:
// ******************************

const k_VERSION = '1.7.16-powershell-to-python-grammar';

// ******************************
// TODO: DEPRECATE
// ******************************

function setup (in_config) {
    logger.CONFIG.logColour = typeof(in_config.log_colour) === 'undefined' ? true : !!in_config.log_colour;
    logger.CONFIG.logLevel = typeof(in_config.log_level) === 'undefined' ? logger.c_LOG_LEVEL_ERROR : in_config.log_level;

    formatter.setup(in_config);
    printer.setup(in_config);
    tree.setup(in_config);
    parserHtml.setup(Object.assign({}, in_config, {
        convert_line_endings: true
    }));
    require('./formatters/scss').setup(in_config);
}

// ******************************
// Exports:
// ******************************

module.exports['k_VERSION'] = k_VERSION;
module.exports['k_DEFINITION_TYPE_SCSS'] = parser.k_DEFINITION_TYPE_SCSS;
module.exports['k_DEFINITION_TYPE_HTML'] = parser.k_DEFINITION_TYPE_HTML;
module.exports['k_DEFINITION_TYPE_PS1'] = parser.k_DEFINITION_TYPE_PS1;

module.exports['setup_parser'] = parser.setup;
module.exports['setupParser'] = parser.setup;
module.exports['format_file'] = formatter.format_file;
module.exports['formatFile'] = formatter.format_file;
module.exports['format_contents'] = formatter.format_contents;
module.exports['formatContents'] = formatter.format_contents;

module.exports['print_file'] = printer.print_file;
module.exports['printFile'] = printer.print_file;
module.exports['print_contents'] = printer.print_contents;
module.exports['printContents'] = printer.print_contents;
module.exports['print_contents_diff'] = printer.print_contents_diff;
module.exports['printContentsDiff'] = printer.print_contents_diff;

module.exports['setup_test'] = test.setup;
module.exports['setupTest'] = test.setup;

module.exports['format_tests'] = test.format_tests;
module.exports['formatTests'] = test.format_tests;
module.exports['structure_tests'] = test.structure_tests;
module.exports['structureTests'] = test.structure_tests;
module.exports['print_tests'] = test.print_tests;
module.exports['printTests'] = test.print_tests;

module.exports['setup'] = setup; // TODO: Deprecate
module.exports['format_sass_contents'] = formatter.format_sass_contents; // TODO: Deprecate
module.exports['print_sass_contents'] = printer.print_sass_contents; // TODO: Deprecate
module.exports['format_html_contents'] = parserHtml.format_html_contents; // TODO: Deprecate
module.exports['format_html_file'] = parserHtml.format_html_contents; // TODO: Deprecate

// ******************************