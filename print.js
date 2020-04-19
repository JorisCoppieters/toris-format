'use strict'; // JS: ES5

// ******************************
// Requires:
// ******************************

var fs = require('fs');
var minimist = require('minimist');
var path = require('path');
var torisFormat = require('./index.js');
var utils = require('./src/utils');
var logger = require('./src/logger');

// ******************************
// Arguments:
// ******************************

var g_ARGV = minimist(process.argv.slice(2));
var g_DEBUG = g_ARGV['debug'];
var g_FILE = g_ARGV['file'];
var g_PRINT_TREE = g_ARGV['print-tree'];
var g_PRINT_TREE_CONSTRUCTION = g_ARGV['print-tree-construction'];
var g_RUN_CHECKS = g_ARGV['run-checks'];

// ******************************
// Script:
// ******************************

logger.CONFIG.logColour = true;
logger.CONFIG.logLevel = 5;

printTestFile();

// ******************************
// Functions:
// ******************************

function printTestFile () {
    if (!g_FILE) {
        logger.error('Please specify a file');
        return;
    }

    if (!fs.existsSync(g_FILE)){
        logger.error('File doesn\'t exist');
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

    var config = {};
    if (matches) {
        var basenamePrefix = matches[1];
        var configFile = path.resolve(__dirname, dirname, basenamePrefix + '-conf.json');
        config = loadConfigFile(configFile);
    } else {
        config = loadConfigFile();
    }

    torisFormat.printFile(file, config.setup);
}

// ******************************

function loadConfigFile (configFile) {
    if (fs.existsSync(configFile)) {
        var config = require(configFile);
        config.setup = config.setup || {};
        config.setup.debug = config.setup.debug || !!g_DEBUG;
        config.setup.print_tree = config.setup.print_tree || !!g_PRINT_TREE;
        config.setup.print_tree_construction = config.setup.print_tree_construction || !!g_PRINT_TREE_CONSTRUCTION;
        config.setup.run_checks = config.setup.run_checks || !!g_RUN_CHECKS;
        return config;
    }
    return {
        setup: {
            debug: !!g_DEBUG,
            print_tree: !!g_PRINT_TREE,
            print_tree_construction: !!g_PRINT_TREE_CONSTRUCTION,
            run_checks: !!g_RUN_CHECKS
        }
    };
}

// ******************************

