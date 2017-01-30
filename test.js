'use strict';

var torisFormat = require('./index.js');
var path = require('path');
var print = require('./utilities/print');
var fileUtil = require('./utilities/file');

// ******************************

formatTest();

// ******************************

function setupTorisFormat () {
    torisFormat.setup({
        line_ending: '\r\n',
        inline_elements: [],
        block_elements: ['tg-icon'],
        one_time_bound_element_prefixes: ['tg-', 'tm-'],
        none_one_time_bound_elements: ['tg-row', 'tg-col', 'tg-mini-grid-pattern-item', 'tg-mini-grid-item'],
        ng1_attributes_order: [
            'ng-.*',
            'tg-sm.*',
            'tg-sd.*',
            'tg-md.*',
            'tg-mg.*',
            'tg-lg.*',
            'tg-ll.*',
            'tg-xl.*',
            'tg-.*',
            'tm-.*'
        ],
        ng2_attributes_order: [
            'ng-.*',
            'tg-sm.*',
            'tg-sd.*',
            'tg-md.*',
            'tg-mg.*',
            'tg-lg.*',
            'tg-ll.*',
            'tg-xl.*',
            'tg-.*',
            'tm-.*'
        ],
        ng2_attributes_order_pre_native: [
            '\\*.*',
            '\\#.*',
            '\\[\\(.*\\)\\]',
            '\\(.*\\)',
            '\\[.*\\]'
        ],
        remove_css: true
    });
}

// ******************************

function formatTest () {
    setupTorisFormat();
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
        remove_css: true
    });

    // Test base style formatting
    fileUtil.read(path.resolve(__dirname, './test/format-test-base-preformatted.html'), function (preformattedHtmlTemplate) {
        fileUtil.read(path.resolve(__dirname, './test/format-test-base-formatted.html'), function (formattedHtmlTemplate) {
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
        angular_version: 1.0
    });

    // Test NG1 style formatting
    fileUtil.read(path.resolve(__dirname, './test/format-test-ng1-preformatted.html'), function (preformattedHtmlTemplate) {
        fileUtil.read(path.resolve(__dirname, './test/format-test-ng1-formatted.html'), function (formattedHtmlTemplate) {
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
        angular_version: 2.0
    });

    // Test NG2 style formatting
    fileUtil.read(path.resolve(__dirname, './test/format-test-ng2-preformatted.html'), function (preformattedHtmlTemplate) {
        fileUtil.read(path.resolve(__dirname, './test/format-test-ng2-formatted.html'), function (formattedHtmlTemplate) {
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
        print.magenta('Testing ' + testName + ' formatting preformatted html outputs to formatted html');

        var inputHtml = preformattedHtmlTemplate;
        var expectedOutputHtml = formattedHtmlTemplate;

        var outputHtml = torisFormat.format_html_file(inputHtml);
        if (outputHtml && expectedOutputHtml && outputHtml.trim() == expectedOutputHtml.trim()) {
            print.green('Success!');
        } else if (outputHtml) {
            print.red('Unexpected HTML');
            fileUtil.write('_formatTest_' + testName + '_expectedOutput.txt', expectedOutputHtml);
            fileUtil.write('_formatTest_' + testName + '_output.txt', outputHtml);
            return;
        }
    } catch (err) {
        print.red('Couldn\'t parse preformatted HTML template');
        print.red(err);
    }

    try {
        print.magenta('Testing ' + testName + ' formatting already formatted html still outputs to formatted html');

        var inputHtml = formattedHtmlTemplate;
        var expectedOutputHtml = formattedHtmlTemplate;

        var outputHtml = torisFormat.format_html_file(inputHtml);
        if (outputHtml && expectedOutputHtml && outputHtml.trim() == expectedOutputHtml.trim()) {
            print.green('Success!');
        } else if (outputHtml) {
            print.red('Unexpected HTML');
            fileUtil.write('_formatTest_' + testName + '_expectedOutput.txt', expectedOutputHtml);
            fileUtil.write('_formatTest_' + testName + '_output.txt', outputHtml);
            return;
        }

    } catch (err) {
        print.red('Couldn\'t parse preformatted HTML template');
        print.red(err);
    }

    return true;
}

// ******************************
