'use strict';

let torisFormat = require('./index.js');
let path = require('path');
let cprint = require('color-print');
let fs = require('fs');
let fsp = require('fs-process');

// ******************************

runTests();

// ******************************

function runTests () {
    formatTests('scss', 'Sass', (contents) => { return torisFormat.format_sass_contents(contents, 0, true); });
    formatTests('html', 'HTML', torisFormat.format_html_contents);
    printTests('scss', 'Sass', (contents) => { return torisFormat.print_sass_contents(contents, 0, true); });
}

// ******************************

function formatTests (fileExtension, fileType, formatFunction) {
    let filter = 'format-test-.*-preformatted\\.' + fileExtension;
    fsp.list('./test/' + fileExtension, filter).then((files) => {
        files.sort();
        files.forEach((file) => {
            let dirname = path.dirname(file);
            let basename = path.basename(file);

            let matches = basename.match(new RegExp('(format-test-(.*))-preformatted.' + fileExtension));
            if (!matches) {
                return;
            }

            let basenamePrefix = matches[1];
            let testName = matches[2];
            let preformattedSassContents = fs.readFileSync(path.resolve(__dirname, dirname, basenamePrefix + '-preformatted.' + fileExtension), 'utf8');
            let formattedSassContents = fs.readFileSync(path.resolve(__dirname, dirname, basenamePrefix + '-formatted.' + fileExtension), 'utf8');
            let configFile = path.resolve(__dirname, dirname, basenamePrefix + '-conf.json');
            loadConfigFile(configFile);
            return formatTestFiles(fileExtension + '-' + testName, fileType, formatFunction, preformattedSassContents, formattedSassContents);
        })
    });

    return true;
}

// ******************************

function printTests (fileExtension, fileType, formatFunction) {
    let filter = 'print-test-.*\\.' + fileExtension;
    fsp.list('./test/' + fileExtension, filter).then((files) => {
        files.sort();
        files.forEach((file) => {
            let dirname = path.dirname(file);
            let basename = path.basename(file);

            let matches = basename.match(new RegExp('(print-test-(.*)).' + fileExtension));
            if (!matches) {
                return;
            }

            let basenamePrefix = matches[1];
            let testName = matches[2];
            let sassContents = fs.readFileSync(path.resolve(__dirname, dirname, basenamePrefix + '.' + fileExtension), 'utf8');
            let configFile = path.resolve(__dirname, dirname, basenamePrefix + '-conf.json');
            loadConfigFile(configFile);
            return printTestContents(fileExtension + '-' + testName, fileType, formatFunction, sassContents);
        })
    });

    return true;
}

// ******************************

function loadConfigFile (configFile) {
    if (fs.existsSync(configFile)) {
        let config = require(configFile);
        torisFormat.setup(config);
    }
}

// ******************************
//
//
// TESTER FUNCTIONS
//
//
// ******************************

function formatTestFiles (testName, fileType, formatFunction, preformattedContents, formattedContents) {
    let testIdentifier = cprint.toWhite(' : ') + cprint.toCyan(testName) + cprint.toWhite(' : ') + cprint.toMagenta('Formatting preformatted ' + fileType + ' outputs to formatted ' + fileType);

    try {

        let input = preformattedContents;
        let expectedOutput = formattedContents;

        let test1_expectedOutputFile = '_formatTest_' + testName + '_expectedOutput.txt';
        let test1_outputFile = '_formatTest_' + testName + '_output.txt';

        let output = formatFunction(input);
        if (output && expectedOutput && output.trim() == expectedOutput.trim()) {
            console.log(cprint.toGreen('✔ Test') + testIdentifier);
            fs.exists(test1_expectedOutputFile, (exists) => { if (exists) { fsp.remove(test1_expectedOutputFile); } } );
            fs.exists(test1_outputFile, (exists) => { if (exists) { fsp.remove(test1_outputFile); } } );
        } else if (output) {
            console.log(cprint.toRed('✘ Test') + testIdentifier + '\n' + cprint.toRed('Unexpected ' + fileType));
            fsp.write(test1_expectedOutputFile, expectedOutput);
            fsp.write(test1_outputFile, output);
            return;
        }
    } catch (err) {
        console.log(cprint.toRed('✘ Test') + testIdentifier + '\n' + cprint.toRed('Couldn\'t parse preformatted ' + fileType + '\n'));
        cprint.red(err);
    }

    testIdentifier = cprint.toWhite(' : ') + cprint.toCyan(testName) + cprint.toWhite(' : ') + cprint.toMagenta('Formatting already formatted ' + fileType + ' still outputs to formatted ' + fileType);
    try {

        let input = formattedContents;
        let expectedOutput = formattedContents;

        let test2_expectedOutputFile = '_formatTest_alreadyFormatted_' + testName + '_expectedOutput.txt';
        let test2_outputFile = '_formatTest_alreadyFormatted_' + testName + '_output.txt';

        let output = formatFunction(input);
        if (output && expectedOutput && output.trim() == expectedOutput.trim()) {
            console.log(cprint.toGreen('✔ Test') + testIdentifier);
            fs.exists(test2_expectedOutputFile, (exists) => { if (exists) { fsp.remove(test2_expectedOutputFile); } } );
            fs.exists(test2_outputFile, (exists) => { if (exists) { fsp.remove(test2_outputFile); } } );
        } else if (output) {
            console.log(cprint.toRed('✘ Test') + testIdentifier + '\n' + cprint.toRed('Unexpected ' + fileType));
            fsp.write(test2_expectedOutputFile, expectedOutput);
            fsp.write(test2_outputFile, output);
            return;
        }

    } catch (err) {
        console.log(cprint.toRed('✘ Test') + testIdentifier + '\n' + cprint.toRed('Couldn\'t parse preformatted ' + fileType + '\n'));
        cprint.red(err);
    }

    return true;
}

// ******************************

function printTestContents (testName, fileType, printFunction, contents) {
    let testIdentifier = cprint.toWhite(' : ') + cprint.toCyan(testName) + cprint.toWhite(' : ') + cprint.toMagenta('Printing of formatted ' + fileType + ' output');

    console.log(cprint.toYellow(cprint.toBold('? Visual-Test', true)) + testIdentifier + cprint.toBold(cprint.toYellow(' - Does this look good?', true)));
    printFunction(contents);

    return true;
}

// ******************************

