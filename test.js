'use strict'; // JS: ES5

var cprint = require('color-print');
var fs = require('fs');
var fsp = require('fs-process');
var minimist = require('minimist');
var path = require('path');
var torisFormat = require('./index.js');

// ******************************

var g_ARGV = minimist(process.argv.slice(2));
var g_SCSS = g_ARGV['scss'] !== false;
var g_HTML = g_ARGV['html'] !== false;
var g_DEBUG = g_ARGV['debug'];
var g_PRINT_TREE = g_ARGV['print-tree'];
var g_RUN_CHECKS = g_ARGV['run-checks'];

var g_TEST_FAILED = false;

// ******************************

runTests();

// ******************************

function runTests () {
  if (g_SCSS) {
    formatTests('scss', 'Sass', function (contents) { return torisFormat.format_sass_contents(contents, 0, true); });
    printTests('scss', 'Sass', function (contents) { return torisFormat.print_sass_contents(contents, 0, true); });
  }

  if (g_HTML) {
    formatTests('html', 'HTML', torisFormat.format_html_contents);
  }
}

// ******************************

function formatTests (fileExtension, fileType, formatFunction) {
  var filter = 'format-test-.*-preformatted\\.' + fileExtension;
  fsp.list('./test/' + fileExtension, filter).then(function (files) {
    files.sort();
    files.forEach(function (file) {
      if (g_TEST_FAILED) {
        return;
      }

      var dirname = path.dirname(file);
      var basename = path.basename(file);

      var matches = basename.match(new RegExp('(format-test-(.*))-preformatted.' + fileExtension));
      if (!matches) {
        return;
      }

      var basenamePrefix = matches[1];
      var testName = matches[2];
      var preformattedSassContents = fs.readFileSync(path.resolve(__dirname, dirname, basenamePrefix + '-preformatted.' + fileExtension), 'utf8');
      var formattedSassContents = fs.readFileSync(path.resolve(__dirname, dirname, basenamePrefix + '-formatted.' + fileExtension), 'utf8');
      var configFile = path.resolve(__dirname, dirname, basenamePrefix + '-conf.json');
      var config = loadConfigFile(configFile);
      if (config.ignore) {
        return;
      }
      formatTestFiles(fileExtension + '-' + testName, fileType, formatFunction, preformattedSassContents, formattedSassContents);
    })
  });
}

// ******************************

function printTests (fileExtension, fileType, formatFunction) {
  var filter = 'print-test-.*\\.' + fileExtension;
  fsp.list('./test/' + fileExtension, filter).then(function (files) {
    files.sort();
    files.forEach(function (file) {
      if (g_TEST_FAILED) {
        return;
      }

      var dirname = path.dirname(file);
      var basename = path.basename(file);

      var matches = basename.match(new RegExp('(print-test-(.*)).' + fileExtension));
      if (!matches) {
        return;
      }

      var basenamePrefix = matches[1];
      var testName = matches[2];
      var sassContents = fs.readFileSync(path.resolve(__dirname, dirname, basenamePrefix + '.' + fileExtension), 'utf8');
      var configFile = path.resolve(__dirname, dirname, basenamePrefix + '-conf.json');
      var config = loadConfigFile(configFile);
      if (config.ignore) {
        return;
      }
      printTestContents(fileExtension + '-' + testName, fileType, formatFunction, sassContents);
    })
  });
}

// ******************************

function loadConfigFile (configFile) {
  if (fs.existsSync(configFile)) {
    var config = require(configFile);
    config.debug = config.debug || g_DEBUG;
    config.print_tree = config.print_tree || g_PRINT_TREE;
    config.run_checks = config.run_checks || g_RUN_CHECKS;

    torisFormat.setup(config);
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

  testIdentifier = cprint.toWhite(' : ') + cprint.toCyan(testName) + cprint.toWhite(' : ') + cprint.toMagenta('Formatting already formatted ' + fileType + ' still outputs to formatted ' + fileType);
  try {

    var input = formattedContents;
    var expectedOutput = formattedContents;

    var test2_expectedOutputFile = '_formatTest_alreadyFormatted_' + testName + '_expectedOutput.txt';
    var test2_outputFile = '_formatTest_alreadyFormatted_' + testName + '_output.txt';

    var output = formatFunction(input);
    if (output && expectedOutput && output.trim() == expectedOutput.trim()) {
      console.log(cprint.toGreen('✔ Test') + testIdentifier);
      fs.exists(test2_expectedOutputFile, function (exists) { if (exists) { fsp.remove(test2_expectedOutputFile); } } );
      fs.exists(test2_outputFile, function (exists) { if (exists) { fsp.remove(test2_outputFile); } } );
    } else if (output) {
      console.log(cprint.toRed('✘ Test') + testIdentifier + '\n' + cprint.toRed('Unexpected ' + fileType));
      torisFormat.print_contents_diff(expectedOutput, output);
      fsp.write(test2_expectedOutputFile, expectedOutput);
      fsp.write(test2_outputFile, output);
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

