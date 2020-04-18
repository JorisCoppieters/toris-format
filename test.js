'use strict'; // JS: ES5

// ******************************
// Requires:
// ******************************

var cprint = require('color-print');
var fs = require('fs');
var minimist = require('minimist');
var path = require('path');
var torisFormat = require('./index.js');

// ******************************
// Arguments:
// ******************************

var g_ARGV = minimist(process.argv.slice(2));
var g_PS1 = g_ARGV['ps1'] !== false;
var g_SCSS = g_ARGV['scss'] !== false;
var g_HTML = g_ARGV['html'] !== false;
var g_DEBUG = g_ARGV['debug'];
var g_PRINT_TREE = g_ARGV['print-tree'];
var g_RUN_CHECKS = g_ARGV['run-checks'];
var g_CREATE_TEST = g_ARGV['create'];
var g_NAME = g_ARGV['name'];
var g_TYPE = g_ARGV['type'];

// ******************************
// Script:
// ******************************

if (g_CREATE_TEST) {
    createTest();
} else {
    runTests();
}

// ******************************
// Functions:
// ******************************

function createTest() {
    if (!g_NAME) {
        cprint.yellow('Please specify a name');
        return;
    }

    if (!g_TYPE) {
        cprint.yellow('Please specify a type');
        return;
    }

    let folder = path.resolve('./test', g_TYPE);
    if (!fs.existsSync(folder)) {
        cprint.yellow(`Invalid folder : ${folder}`);
        return;
    }

    let latestTestNumber = fs
        .readdirSync(folder)
        .filter((file) => file.match(/format-test-.*-conf.json/))
        .map((file) => file.replace(/format-test-([0-9]+)-.*/, '$1'))
        .reduce((max, v) => Math.max(max, parseInt(v)), 0);

    let nextTestNumber = latestTestNumber + 1;
    let nextTestNumberStr = ('000' + nextTestNumber).substr(-3);

    let testName = `format-test-${nextTestNumberStr}-${g_NAME}`;
    let configFile = `${testName}-conf.json`;
    let formattedFile = `${testName}-formatted.${g_TYPE}`;
    let preformattedFile = `${testName}-preformatted.${g_TYPE}`;

    let config = {
        inputFile: preformattedFile,
        outputFile: formattedFile,
        setup: {
            definition_type: g_TYPE,
            line_ending: '\n',
            convert_line_endings: true,
        },
        testName: g_NAME,
    };

    fs.writeFileSync(`${folder}/${configFile}`, JSON.stringify(config, null, 4));
    fs.writeFileSync(`${folder}/${formattedFile}`, '');
    fs.writeFileSync(`${folder}/${preformattedFile}`, '');
}

// ******************************

function runTests() {
    torisFormat.setupTest({
        debug: g_DEBUG,
        print_tree: g_PRINT_TREE,
        run_checks: g_RUN_CHECKS,
    });

    if (g_PS1) {
        torisFormat.formatTests('test/ps1');
        torisFormat.printTests('test/ps1');
    }

    if (g_SCSS) {
        torisFormat.formatTests('test/scss');
        torisFormat.printTests('test/scss');
    }

    if (g_HTML) {
        torisFormat.formatTests('test/html');
        torisFormat.printTests('test/html');
    }
}

// ******************************
