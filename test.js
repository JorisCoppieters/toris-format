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
// Globals:
// ******************************

var g_TEST_FAILED = false;

// ******************************
// Script:
// ******************************

runTests();

// ******************************
// Functions:
// ******************************

function runTests () {
    if (g_SCSS) {
        formatTests('scss');
        printTests('scss');
    }

    if (g_HTML) {
        formatTests('html');
    }
}

// ******************************

function formatTests (testFolder) {
    var filter = 'format-test-.*\\-conf.json';
    fsp.list('./test/' + testFolder, filter).then(function (files) {
        files.sort();
        files.forEach(function (file) {
            if (g_TEST_FAILED) {
                return;
            }

            var dirname = path.dirname(file);

            var configFile = file;
            var config = loadConfigFile(configFile);
            if (config.ignore) {
                return;
            }

            var testName = config.testName;
            var inputFile = path.resolve(__dirname, dirname, config.inputFile);
            var outputFile = path.resolve(__dirname, dirname, config.outputFile);
            var setupConfig = config.setup;

            formatTestFiles(testFolder + '-' + testName, inputFile, outputFile, setupConfig);
        })
    });
}

// ******************************

function printTests (testFolder) {
    var filter = 'print-test-.*\\-conf.json';
    fsp.list('./test/' + testFolder, filter).then(function (files) {
        files.sort();
        files.forEach(function (file) {
            if (g_TEST_FAILED) {
                return;
            }

            var dirname = path.dirname(file);

            var configFile = file;
            var config = loadConfigFile(configFile);
            if (config.ignore) {
                return;
            }

            var testName = config.testName;
            var inputFile = path.resolve(__dirname, dirname, config.inputFile);
            var setupConfig = config.setup;

            printTestContents(testFolder + '-' + testName, inputFile, setupConfig);
        })
    });
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
//
//
// TESTER FUNCTIONS
//
//
// ******************************

function formatTestFiles (testName, inputFile, outputFile, setupConfig) {
    var fileExtension = utils.getFileExtension(inputFile);
    var testIdentifier = cprint.toWhite(' : ') + cprint.toCyan(testName) + cprint.toWhite(' : ') + cprint.toMagenta('Formatting preformatted ' + fileExtension + ' outputs to formatted ' + fileExtension);

    try {
        var expectedOutput = fs.readFileSync(outputFile, 'utf8');

        var test1_expectedOutputFile = '_formatTest_' + testName + '_expectedOutput.txt';
        var test1_outputFile = '_formatTest_' + testName + '_output.txt';

        var output = torisFormat.formatFile(inputFile, setupConfig);

        if (output && expectedOutput && output.trim() == expectedOutput.trim()) {
            console.log(cprint.toGreen('✔ Test') + testIdentifier);
            fs.exists(test1_expectedOutputFile, function (exists) { if (exists) { fsp.remove(test1_expectedOutputFile); } } );
            fs.exists(test1_outputFile, function (exists) { if (exists) { fsp.remove(test1_outputFile); } } );
        } else if (output) {
            console.log(cprint.toRed('✘ Test') + testIdentifier + '\n' + cprint.toRed('Unexpected ' + fileExtension));
            torisFormat.print_contents_diff(expectedOutput, output);
            fsp.write(test1_expectedOutputFile, expectedOutput);
            fsp.write(test1_outputFile, output);
            g_TEST_FAILED = true;
            return false;
        } else {
            console.log(cprint.toRed('✘ Test') + testIdentifier + '\n' + cprint.toRed('Format function failed'));
            g_TEST_FAILED = true;
            return false;
        }
    } catch (err) {
        console.log(cprint.toRed('✘ Test') + testIdentifier + '\n' + cprint.toRed('Couldn\'t parse preformatted ' + fileExtension + '\n'));
        cprint.red(err);
        g_TEST_FAILED = true;
        return false;
    }

    return true;
}

// ******************************

function printTestContents (testName, inputFile, setupConfig) {
    var fileExtension = utils.getFileExtension(inputFile);
    var testIdentifier = cprint.toWhite(' : ') + cprint.toCyan(testName) + cprint.toWhite(' : ') + cprint.toMagenta('Printing of formatted ' + fileExtension + ' output');

    console.log(cprint.toYellow(cprint.toBold('? Visual-Test', true)) + testIdentifier + cprint.toBold(cprint.toYellow(' - Does this look good?', true)));
    torisFormat.printFile(inputFile, setupConfig);

    return true;
}

// ******************************

