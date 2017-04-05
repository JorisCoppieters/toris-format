'use strict'; // JS: ES5

// ******************************
//
//
// TEST
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var cprint = require('color-print');
var formatter = require('./formatter');
var fs = require('fs');
var fsp = require('fs-process');
var path = require('path');
var printer = require('./printer');
var utils = require('./utils.js');

// ******************************
// Globals:
// ******************************

var g_TEST_FAILED = false;

var g_BASE_PATH = path.resolve(__dirname, '../');
var g_DEBUG = false;
var g_PRINT_TREE = false;
var g_RUN_CHECKS = false;

// ******************************
// Setup Functions:
// ******************************

function setup (in_config) {
    if (!in_config) {
        return;
    }

    g_BASE_PATH = utils.get_setup_property(in_config, "base_path", g_BASE_PATH);
    g_DEBUG = utils.get_setup_property(in_config, "debug", g_DEBUG);
    g_PRINT_TREE = utils.get_setup_property(in_config, "print_tree", g_PRINT_TREE);
    g_RUN_CHECKS = utils.get_setup_property(in_config, "run_checks", g_RUN_CHECKS);
}

// ******************************
// Test Functions:
// ******************************

function format_tests (tests_folder, format_function) {
    var filter = 'format-test-.*\\-conf.json';
    var test_folder_name = path.basename(tests_folder);
    fsp.list(tests_folder, filter).then(function (files) {
        files.sort();
        files.forEach(function (file) {
            if (g_TEST_FAILED) {
                return;
            }

            var dirname = path.dirname(file);

            var config_file = path.resolve(g_BASE_PATH, file);
            var config = _load_config_file(config_file);

            var test_name = config.testName;
            var input_file = path.resolve(g_BASE_PATH, dirname, config.inputFile);
            var output_file = path.resolve(g_BASE_PATH, dirname, config.outputFile);
            var setup_config = config.setup;

            _format_test_files(test_folder_name + '-' + test_name, config.ignore, input_file, output_file, setup_config, format_function);
        })
    });
}

// ******************************

function structure_tests (tests_folder, structure_function) {
    var filter = 'structure-test-.*\\-conf.json';
    var test_folder_name = path.basename(tests_folder);
    fsp.list(tests_folder, filter).then(function (files) {
        files.sort();
        files.forEach(function (file) {
            if (g_TEST_FAILED) {
                return;
            }

            var dirname = path.dirname(file);

            var config_file = path.resolve(g_BASE_PATH, file);
            var config = _load_config_file(config_file);

            var test_name = config.testName;
            var input_file = path.resolve(g_BASE_PATH, dirname, config.inputFile);
            var output_file = path.resolve(g_BASE_PATH, dirname, config.outputFile);
            var setup_config = config.setup;

            _structure_test_files(test_folder_name + '-' + test_name, config.ignore, input_file, output_file, setup_config, structure_function);
        })
    });
}

// ******************************

function print_tests (tests_folder, print_function) {
    var filter = 'print-test-.*\\-conf.json';
    var test_folder_name = path.basename(tests_folder);
    fsp.list(tests_folder, filter).then(function (files) {
        files.sort();
        files.forEach(function (file) {
            if (g_TEST_FAILED) {
                return;
            }

            var dirname = path.dirname(file);

            var config_file = path.resolve(g_BASE_PATH, file);
            var config = _load_config_file(config_file);

            var test_name = config.testName;
            var input_file = path.resolve(g_BASE_PATH, dirname, config.inputFile);
            var setup_config = config.setup;

            _print_test_contents(test_folder_name + '-' + test_name, config.ignore, input_file, setup_config, print_function);
        })
    });
}

// ******************************

function _load_config_file (config_file) {
    if (fs.existsSync(config_file)) {
        var config = require(config_file);
        config.setup = config.setup || {};
        config.setup.debug = config.setup.debug || !!g_DEBUG;
        config.setup.print_tree = config.setup.print_tree || !!g_PRINT_TREE;
        config.setup.run_checks = config.setup.run_checks || !!g_RUN_CHECKS;
        return config;
    }
    return {};
}

// ******************************

function _format_test_files (test_name, ignore, input_file, output_file, setup_config, format_function) {
    var file_extension = utils.get_file_extension(input_file);
    var test_identifier = cprint.toWhite(' : ') + cprint.toCyan(test_name) + cprint.toWhite(' : ') + cprint.toMagenta('Formatting preformatted ' + file_extension + ' outputs to formatted ' + file_extension);

    try {
        var expected_output = fs.readFileSync(output_file, 'utf8');

        var test_expected_output_file = '_formatTest_' + test_name + '_expected_output.txt';
        var test_output_file = '_formatTest_' + test_name + '_output.txt';

        var output;
        if (format_function) {
            output = format_function(input_file, setup_config);
        } else {
            output = formatter.format_file(input_file, setup_config);
        }

        if (ignore) {
            console.log(cprint.toDarkGrey('~ Ignored') + test_identifier);
            return true;
        }

        if (output && expected_output && output.trim() == expected_output.trim()) {
            console.log(cprint.toGreen('✔ Test') + test_identifier);
            fs.exists(test_expected_output_file, function (exists) { if (exists) { fsp.remove(test_expected_output_file); } } );
            fs.exists(test_output_file, function (exists) { if (exists) { fsp.remove(test_output_file); } } );
        } else if (output) {
            console.log(cprint.toRed('✘ Test') + test_identifier + '\n' + cprint.toRed('Unexpected ' + file_extension));
            printer.print_contents_diff(expected_output, output);
            fsp.write(test_expected_output_file, expected_output);
            fsp.write(test_output_file, output);
            g_TEST_FAILED = true;
            return false;
        } else {
            console.log(cprint.toRed('✘ Test') + test_identifier + '\n' + cprint.toRed('Format function failed'));
            g_TEST_FAILED = true;
            return false;
        }
    } catch (err) {
        console.log(cprint.toRed('✘ Test') + test_identifier + '\n' + cprint.toRed('Couldn\'t parse preformatted ' + file_extension + '\n'));
        cprint.red(err);
        g_TEST_FAILED = true;
        return false;
    }

    return true;
}

// ******************************

function _structure_test_files (test_name, ignore, input_file, output_file, setup_config, structure_function) {
    var file_extension = utils.get_file_extension(input_file);
    var test_identifier = cprint.toWhite(' : ') + cprint.toCyan(test_name) + cprint.toWhite(' : ') + cprint.toMagenta('Source ' + file_extension + ' outputs to correct structure');

    try {
        var expected_output = fs.readFileSync(output_file, 'utf8');

        var test_expected_output_file = '_structureTest_' + test_name + '_expected_output.txt';
        var test_output_file = '_structureTest_' + test_name + '_output.txt';

        var output;
        if (structure_function) {
            output = structure_function(input_file, setup_config);
        } else {
            output = formatter.structure_file(input_file, setup_config);
        }

        if (ignore) {
            console.log(cprint.toDarkGrey('~ Ignored') + test_identifier);
            return true;
        }

        if (output && expected_output && output.trim() == expected_output.trim()) {
            console.log(cprint.toGreen('✔ Test') + test_identifier);
            fs.exists(test_expected_output_file, function (exists) { if (exists) { fsp.remove(test_expected_output_file); } } );
            fs.exists(test_output_file, function (exists) { if (exists) { fsp.remove(test_output_file); } } );
        } else if (output) {
            console.log(cprint.toRed('✘ Test') + test_identifier + '\n' + cprint.toRed('Unexpected ' + file_extension));
            printer.print_contents_diff(expected_output, output);
            fsp.write(test_expected_output_file, expected_output);
            fsp.write(test_output_file, output);
            g_TEST_FAILED = true;
            return false;
        } else {
            console.log(cprint.toRed('✘ Test') + test_identifier + '\n' + cprint.toRed('Structure function failed'));
            g_TEST_FAILED = true;
            return false;
        }
    } catch (err) {
        console.log(cprint.toRed('✘ Test') + test_identifier + '\n' + cprint.toRed('Couldn\'t parse ' + file_extension + '\n'));
        cprint.red(err);
        g_TEST_FAILED = true;
        return false;
    }

    return true;
}

// ******************************

function _print_test_contents (test_name, ignore, input_file, setup_config, print_function) {
    var file_extension = utils.get_file_extension(input_file);
    var test_identifier = cprint.toWhite(' : ') + cprint.toCyan(test_name) + cprint.toWhite(' : ') + cprint.toMagenta('Printing of formatted ' + file_extension + ' output');

    if (ignore) {
        console.log(cprint.toDarkGrey('~ Ignored') + test_identifier);
        return true;
    }

    console.log(cprint.toYellow(cprint.toBold('? Visual-Test', true)) + test_identifier + cprint.toBold(cprint.toYellow(' - Does this look good?', true)));

    if (print_function) {
        print_function(input_file, setup_config);
    } else {
        printer.print_file(input_file, setup_config);
    }

    return true;
}

// ******************************
// Exports:
// ******************************

module.exports['setup'] = setup;
module.exports['format_tests'] = format_tests;
module.exports['formatTests'] = format_tests;
module.exports['structure_tests'] = structure_tests;
module.exports['structureTests'] = structure_tests;
module.exports['print_tests'] = print_tests;
module.exports['printTests'] = print_tests;

// ******************************