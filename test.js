'use strict'; // JS: ES5

// ******************************
// Requires:
// ******************************

var cprint = require('color-print');
var fs = require('fs');
var fsp = require('fs-process');
var minimist = require('minimist');
var path = require('path');
var torisFormat = require('./index.js');
var utils = require('./src/utils.js');

// ******************************
// Arguments:
// ******************************

var g_ARGV = minimist(process.argv.slice(2));
var g_SCSS = g_ARGV['scss'] !== false;
var g_HTML = g_ARGV['html'] !== false;
var g_DEBUG = g_ARGV['debug'];
var g_PRINT_TREE = g_ARGV['print-tree'];
var g_RUN_CHECKS = g_ARGV['run-checks'];

// ******************************
// Script:
// ******************************

runTests();

// ******************************
// Functions:
// ******************************

function runTests () {
    torisFormat.setupTest(
        {
            debug: g_DEBUG,
            print_tree: g_PRINT_TREE,
            run_checks: g_RUN_CHECKS
        }
    );

    if (g_SCSS) {
        torisFormat.formatTests('test/scss');
        torisFormat.printTests('test/scss');
    }

    if (g_HTML) {
        torisFormat.formatTests('test/html');
    }
}

// ******************************

