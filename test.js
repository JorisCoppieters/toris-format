'use strict';

var torisFormat = require('./index.js');
var path = require('path');
var cprint = require('color-print');
var fs = require('fs');
var fsp = require('fs-process');

// ******************************

formatTest();

// ******************************

function formatTest () {
    formatTestBase(function () {
        formatTestNG1();
        formatTestNG2();
    });
}

// ******************************

function formatTestBase (cbSuccess) {
    torisFormat.setup({
        line_ending: '\r\n',
        inline_elements: ['whitespace', 'force-inline'],
        block_elements: ['force-block'],
        one_time_bound_element_prefixes: ['my-'],
        none_one_time_bound_elements: ['do-not-add-one-time-bindings'],
        format_multi_classes_with_at_least: 1,
        order_multi_classes_alphabetically: true,
        multi_classes_order: [
            'z-.*'
        ],
        remove_css: true
    });

    // Test base style formatting
    fsp.read(path.resolve(__dirname, './test/format-test-base-preformatted.html'), function (preformattedHtmlTemplate) {
        fsp.read(path.resolve(__dirname, './test/format-test-base-formatted.html'), function (formattedHtmlTemplate) {
            var testsPassed = formatTestFiles("base", preformattedHtmlTemplate, formattedHtmlTemplate);
            if (testsPassed && cbSuccess) {
                cbSuccess();
            }
        });
    });
}

// ******************************

function formatTestNG1 (cbSuccess) {
    torisFormat.setup({
        ng_version: 1.4,
        ng_attributes_order: [
            'my-z-.*',
            'my-a-.*',
            'my-.*'
        ]
    });

    // Test NG1 style formatting
    fsp.read(path.resolve(__dirname, './test/format-test-ng1-preformatted.html'), function (preformattedHtmlTemplate) {
        fsp.read(path.resolve(__dirname, './test/format-test-ng1-formatted.html'), function (formattedHtmlTemplate) {
            var testsPassed = formatTestFiles("NG1", preformattedHtmlTemplate, formattedHtmlTemplate);
            if (testsPassed && cbSuccess) {
                cbSuccess();
            }
        });
    });
}

// ******************************

function formatTestNG2 (cbSuccess) {
    torisFormat.setup({
        ng_version: 2.0,
        ng_attributes_order_pre_native: [
            '\\*.*',
            '\\#.*',
            '\\[\\(.*\\)\\]',
            '\\(.*\\)',
            '\\[.*\\]'
        ],
    });

    // Test NG2 style formatting
    fsp.read(path.resolve(__dirname, './test/format-test-ng2-preformatted.html'), function (preformattedHtmlTemplate) {
        fsp.read(path.resolve(__dirname, './test/format-test-ng2-formatted.html'), function (formattedHtmlTemplate) {
            var testsPassed = formatTestFiles("NG2", preformattedHtmlTemplate, formattedHtmlTemplate);
            if (testsPassed && cbSuccess) {
                cbSuccess();
            }
        });
    });
}

// ******************************

function formatTestFiles (testName, preformattedHtmlTemplate, formattedHtmlTemplate) {
    try {
        cprint.magenta('Testing ' + testName + ' formatting preformatted html outputs to formatted html');

        var inputHtml = preformattedHtmlTemplate;
        var expectedOutputHtml = formattedHtmlTemplate;

        var test1_expectedOutputHtmlFile = '_formatTest_' + testName + '_expectedOutput.txt';
        var test1_outputHtmlFile = '_formatTest_' + testName + '_output.txt';

        var outputHtml = torisFormat.format_html_file(inputHtml);
        if (outputHtml && expectedOutputHtml && outputHtml.trim() == expectedOutputHtml.trim()) {
            cprint.green('Success!');
            fs.exists(test1_expectedOutputHtmlFile, (exists) => { if (exists) { fsp.remove(test1_expectedOutputHtmlFile); } } );
            fs.exists(test1_outputHtmlFile, (exists) => { if (exists) { fsp.remove(test1_outputHtmlFile); } } );
        } else if (outputHtml) {
            cprint.red('Unexpected HTML');
            fsp.write(test1_expectedOutputHtmlFile, expectedOutputHtml);
            fsp.write(test1_outputHtmlFile, outputHtml);
            return;
        }
    } catch (err) {
        cprint.red('Couldn\'t parse preformatted HTML template');
        cprint.red(err);
    }

    try {
        cprint.magenta('Testing ' + testName + ' formatting already formatted html still outputs to formatted html');

        var inputHtml = formattedHtmlTemplate;
        var expectedOutputHtml = formattedHtmlTemplate;

        var test2_expectedOutputHtmlFile = '_alreadyFormattedTest_' + testName + '_expectedOutput.txt';
        var test2_outputHtmlFile = '_alreadyFormattedTest_' + testName + '_output.txt';

        var outputHtml = torisFormat.format_html_file(inputHtml);
        if (outputHtml && expectedOutputHtml && outputHtml.trim() == expectedOutputHtml.trim()) {
            cprint.green('Success!');
            fs.exists(test2_expectedOutputHtmlFile, (exists) => { if (exists) { fsp.remove(test2_expectedOutputHtmlFile); } } );
            fs.exists(test2_outputHtmlFile, (exists) => { if (exists) { fsp.remove(test2_outputHtmlFile); } } );
        } else if (outputHtml) {
            cprint.red('Unexpected HTML');
            fsp.write(test2_expectedOutputHtmlFile, expectedOutputHtml);
            fsp.write(test2_outputHtmlFile, outputHtml);
            return;
        }

    } catch (err) {
        cprint.red('Couldn\'t parse preformatted HTML template');
        cprint.red(err);
    }

    return true;
}

// ******************************
