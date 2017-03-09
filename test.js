'use strict'; // JS: ES5

var cprint = require('color-print');
var fs = require('fs');
var fsp = require('fs-process');
var path = require('path');
var torisFormat = require('./index.js');
var utils = require('./src/utils.js');

// ******************************

var g_TEST_FAILED = false;

// ******************************

runTests();

// ******************************

function runTests () {
    // formatTests('scss', 'Sass', function (contents) { return torisFormat.format_sass_contents(contents, 0, true); });
    // printTests('scss', 'Sass', function (contents) { return torisFormat.print_sass_contents(contents, 0, true); });

    // formatTests('html', 'HTML', torisFormat.format_html_contents);

    formatTests('tangram_api', 'TypeScript', function (contents) { return torisFormat.format_tangram_api_contents(contents); });
}

// ******************************

function formatTests (testFolder, fileType, formatFunction) {
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

            var inputContents = fs.readFileSync(path.resolve(__dirname, dirname, config.inputFile), 'utf8');
            var outputContents = fs.readFileSync(path.resolve(__dirname, dirname, config.outputFile), 'utf8');
            var testName = config.testName;

            formatTestFiles(testFolder + '-' + testName, fileType, formatFunction, inputContents, outputContents);
        })
    });
}

// ******************************

function printTests (testFolder, fileType, formatFunction) {
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

            var inputContents = fs.readFileSync(path.resolve(__dirname, dirname, config.inputFile), 'utf8');
            var testName = config.testName;

            printTestContents(testFolder + '-' + testName, fileType, formatFunction, inputContents);
        })
    });
}

// ******************************

function loadConfigFile (configFile) {
    if (fs.existsSync(configFile)) {
        var config = require(configFile);
        torisFormat.setup(config.setup || {});
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

function formatTestFiles (testName, fileType, formatFunction, preformattedContents, formattedContents) {
    var testIdentifier = cprint.toWhite(' : ') + cprint.toCyan(testName) + cprint.toWhite(' : ') + cprint.toMagenta('Formatting preformatted ' + fileType + ' outputs to formatted ' + fileType);

    try {

        var input = preformattedContents;
        var expectedOutput = formattedContents;

        var test1_expectedOutputFile = '_formatTest_' + testName + '_expectedOutput.txt';
        var test1_outputFile = '_formatTest_' + testName + '_output.txt';

        var output = formatFunction(input);
        if (output && expectedOutput && output.trim() == expectedOutput.trim()) {
            console.log(cprint.toGreen('✔ Test') + testIdentifier);
            fs.exists(test1_expectedOutputFile, function (exists) { if (exists) { fsp.remove(test1_expectedOutputFile); } } );
            fs.exists(test1_outputFile, function (exists) { if (exists) { fsp.remove(test1_outputFile); } } );
        } else if (output) {
            console.log(cprint.toRed('✘ Test') + testIdentifier + '\n' + cprint.toRed('Unexpected ' + fileType));
            torisFormat.print_contents_diff(expectedOutput, output);
            fsp.write(test1_expectedOutputFile, expectedOutput);
            fsp.write(test1_outputFile, output);
            g_TEST_FAILED = true;
            return false;
        }
    } catch (err) {
        console.log(cprint.toRed('✘ Test') + testIdentifier + '\n' + cprint.toRed('Couldn\'t parse preformatted ' + fileType + '\n'));
        cprint.red(err);
        g_TEST_FAILED = true;
        return false;
    }
    return true;
}

// ******************************

function printTestContents (testName, fileType, printFunction, contents) {
    var testIdentifier = cprint.toWhite(' : ') + cprint.toCyan(testName) + cprint.toWhite(' : ') + cprint.toMagenta('Printing of formatted ' + fileType + ' output');

    console.log(cprint.toYellow(cprint.toBold('? Visual-Test', true)) + testIdentifier + cprint.toBold(cprint.toYellow(' - Does this look good?', true)));
    printFunction(contents);

    return true;
}

// ******************************

