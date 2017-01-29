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
        remove_css: true
    });
}

// ******************************

function formatTest () {
    fileUtil.read(path.resolve(__dirname, './format-test-1-preformatted.html'), function (preformattedHtmlTemplate) {
        fileUtil.read(path.resolve(__dirname, './format-test-1-formatted.html'), function (formattedHtmlTemplate) {
            formatTestFiles(preformattedHtmlTemplate, formattedHtmlTemplate);
        });
    });
}

function formatTestFiles (preformattedHtmlTemplate, formattedHtmlTemplate) {
    torisFormat.setup({
        line_ending: '\r\n',
        inline_elements: ['whitespace', 'force-inline'],
        block_elements: ['force-block'],
        remove_css: true
    });

    try {
        print.blue('Testing formatting preformatted html outputs to formatted html');

        var inputHtml = preformattedHtmlTemplate;
        var expectedOutputHtml = formattedHtmlTemplate;

        var outputHtml = torisFormat.format_html_file(inputHtml);
        if (outputHtml && expectedOutputHtml && outputHtml.trim() == expectedOutputHtml.trim()) {
            print.green('Success!');
        } else if (outputHtml) {
            print.red('Unexpected HTML: Run vdiff tmp1.tx tmp2.txt');
            fileUtil.write('tmp1.txt', expectedOutputHtml);
            fileUtil.write('tmp2.txt', outputHtml);
            return;
        }
    } catch (err) {
        print.red('Couldn\'t parse preformatted HTML template');
        print.red(err);
    }

    try {
        print.blue('Test formatting already formatted html still outputs to formatted html');

        var inputHtml = formattedHtmlTemplate;
        var expectedOutputHtml = formattedHtmlTemplate;

        var outputHtml = torisFormat.format_html_file(inputHtml);
        if (outputHtml && expectedOutputHtml && outputHtml.trim() == expectedOutputHtml.trim()) {
            print.green('Success!');
        } else if (outputHtml) {
            print.red('Unexpected HTML: Run vdiff tmp1.tx tmp2.txt');
            fileUtil.write('tmp1.txt', expectedOutputHtml);
            fileUtil.write('tmp2.txt', outputHtml);
            return;
        }

    } catch (err) {
        print.red('Couldn\'t parse preformatted HTML template');
        print.red(err);
    }
}

// ******************************
