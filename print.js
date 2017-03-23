'use strict'; // JS: ES5

// ******************************
// Requires:
// ******************************

var cprint = require('color-print');
var fs = require('fs');
var minimist = require('minimist');
var path = require('path');
var torisFormat = require('./index.js');
var utils = require('./src/utils');

// ******************************
// Arguments:
// ******************************

var g_ARGV = minimist(process.argv.slice(2));
var g_DEBUG = g_ARGV['debug'];
var g_FILE = g_ARGV['file'];
var g_PRINT_TREE = g_ARGV['print-tree'];
var g_RUN_CHECKS = g_ARGV['run-checks'];

// ******************************
// Script:
// ******************************

printTestFile();

// ******************************
// Functions:
// ******************************

function printTestFile () {
    if (!g_FILE) {
        cprint.red('Please specify a file');
        return;
    }

    if (!fs.existsSync(g_FILE)){
        cprint.red('File doesn\'t exist');
        return;
    }

    var file = g_FILE;
    var fileExtension = utils.getFileExtension(file);
    var dirname = path.dirname(file);
    var basename = path.basename(file);

    var matches = basename.match(new RegExp('(format-test-(.*))-(?:pre)?formatted.' + fileExtension));
    if (!matches) {
        matches = basename.match(new RegExp('(print-test-(.*)).' + fileExtension));
    }

    if (!matches) {
        return;
    }

    var basenamePrefix = matches[1];
    var configFile = path.resolve(__dirname, dirname, basenamePrefix + '-conf.json');
    var config = loadConfigFile(configFile);

    torisFormat.printFile(file, config.setup);
}

// ******************************

function loadConfigFile (configFile) {
    if (fs.existsSync(configFile)) {
        var config = require(configFile);
        config.setup = config.setup || {};
        config.setup.debug = config.setup.debug || !!g_DEBUG;
        config.setup.print_tree = config.setup.print_tree || !!g_PRINT_TREE;
        config.setup.run_checks = config.setup.run_checks || !!g_RUN_CHECKS;
        return config;
    }
    return {};
}

// ******************************

