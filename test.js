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
    if (!formatTestBaseSCSS()) { return };
    if (!formatTestBase()) { return };
    if (!formatTestNG1()) { return };
    if (!formatTestNG2()) { return };
    if (!formatTestForceFormatting()) { return };
    if (!formatTestOneTimeBinding()) { return };
    if (!formatTestMacOSXLineEndings()) { return };
    if (!formatTestWindowsLineEndings()) { return };
    if (!formatTestLinuxLineEndings()) { return };
    if (!formatTestRemoveCSS()) { return };
    if (!formatTestMultiClassFormatting()) { return };
    if (!printTestSCSS()) { return };
}

// ******************************

function formatTestBaseSCSS () {
    torisFormat.setup({
    });

    // Test base style formatting
    let preformattedSassTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-base-preformatted.scss'), 'utf8');
    let formattedSassTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-base-formatted.scss'), 'utf8');
    return formatTestSassFiles("base", preformattedSassTemplate, formattedSassTemplate);
}

// ******************************

function formatTestBase () {
    torisFormat.setup({
    });

    // Test base style formatting
    let preformattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-base-preformatted.html'), 'utf8');
    let formattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-base-formatted.html'), 'utf8');
    return formatTestFiles("base", preformattedHtmlTemplate, formattedHtmlTemplate);
}

// ******************************

function formatTestNG1 () {
    torisFormat.setup({
        ng_version: 1.5,
        ng_attributes_order: [
            'my-z-.*',
            'my-a-.*',
            'my-.*'
        ]
    });

    // Test NG1 style formatting
    let preformattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-ng1-preformatted.html'), 'utf8');
    let formattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-ng1-formatted.html'), 'utf8');
    return formatTestFiles("NG1", preformattedHtmlTemplate, formattedHtmlTemplate);
}

// ******************************

function formatTestNG2 () {
    torisFormat.setup({
        ng_version: 2.0,
        ng_attributes_order_pre_native: [
            '\\*.*',
            '\\#.*',
            '\\[\\(.*\\)\\]',
            '\\(.*\\)',
            '\\[.*\\]'
        ]
    });

    // Test NG2 style formatting
    let preformattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-ng2-preformatted.html'), 'utf8');
    let formattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-ng2-formatted.html'), 'utf8');
    return formatTestFiles("NG2", preformattedHtmlTemplate, formattedHtmlTemplate);
}

// ******************************

function formatTestOneTimeBinding () {
    torisFormat.setup({
        none_one_time_bound_elements: ['do-not-add-one-time-bindings'],
        one_time_bound_element_prefixes: ['my-']
    });

    // Test one time binding
    let preformattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-one-time-binding-preformatted.html'), 'utf8');
    let formattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-one-time-binding-formatted.html'), 'utf8');
    return formatTestFiles("OneTimeBinding", preformattedHtmlTemplate, formattedHtmlTemplate);
}

// ******************************

function formatTestForceFormatting () {
    torisFormat.setup({
        block_elements: ['force-block'],
        force_block_whitespace_formatting: true,
        force_inline_whitespace_formatting: true,
        inline_elements: ['whitespace', 'force-inline']
    });

    // Test forcing block/inline formatting
    let preformattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-block-inline-formatting-preformatted.html'), 'utf8');
    let formattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-block-inline-formatting-formatted.html'), 'utf8');
    return formatTestFiles("ForceFormatting", preformattedHtmlTemplate, formattedHtmlTemplate);
}

// ******************************

function formatTestMacOSXLineEndings () {
    torisFormat.setup({
        line_ending: '\r'
    });

    // Test NG2 MacOSX Line Endings
    let preformattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-macosx-line-endings-preformatted.html'), 'utf8');
    let formattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-macosx-line-endings-formatted.html'), 'utf8');
    return formatTestFiles("MacOSXLineEndings", preformattedHtmlTemplate, formattedHtmlTemplate);
}

// ******************************

function formatTestWindowsLineEndings () {
    torisFormat.setup({
        line_ending: '\r\n'
    });

    // Test NG2 Windows Line Endings
    let preformattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-windows-line-endings-preformatted.html'), 'utf8');
    let formattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-windows-line-endings-formatted.html'), 'utf8');
    return formatTestFiles("WindowsLineEndings", preformattedHtmlTemplate, formattedHtmlTemplate);
}

// ******************************

function formatTestLinuxLineEndings () {
    torisFormat.setup({
        line_ending: '\n'
    });

    // Test NG2 Linux Line Endings
    let preformattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-linux-line-endings-preformatted.html'), 'utf8');
    let formattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-linux-line-endings-formatted.html'), 'utf8');
    return formatTestFiles("LinuxLineEndings", preformattedHtmlTemplate, formattedHtmlTemplate);
}

// ***********************************

function formatTestRemoveCSS () {
    torisFormat.setup({
        remove_css: true
    });

    // Test removing CSS
    let preformattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-remove-css-preformatted.html'), 'utf8');
    let formattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-remove-css-formatted.html'), 'utf8');
    return formatTestFiles("RemoveCSS", preformattedHtmlTemplate, formattedHtmlTemplate);
}

// ******************************

function formatTestMultiClassFormatting () {
    torisFormat.setup({
        format_multi_classes_with_at_least: 1,
        multi_classes_order: [
            'z-.*'
        ]
    });

    // Test formatting multi classes
    let preformattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-multi-class-preformatted.html'), 'utf8');
    let formattedHtmlTemplate = fs.readFileSync(path.resolve(__dirname, './test/format-test-multi-class-formatted.html'), 'utf8');
    return formatTestFiles("MultiClassFormatting", preformattedHtmlTemplate, formattedHtmlTemplate);
}

// ******************************

function formatTestFiles (testName, preformattedHtmlTemplate, formattedHtmlTemplate) {
    try {
        cprint.magenta('Testing ' + testName + ' formatting preformatted html outputs to formatted html');

        var inputHtml = preformattedHtmlTemplate;
        var expectedOutputHtml = formattedHtmlTemplate;

        var test1_expectedOutputHtmlFile = '_formatTest_html_' + testName + '_expectedOutput.txt';
        var test1_outputHtmlFile = '_formatTest_html_' + testName + '_output.txt';

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

        var test2_expectedOutputHtmlFile = '_formatTest_alreadyFormattedHTML_' + testName + '_expectedOutput.txt';
        var test2_outputHtmlFile = '_formatTest_alreadyFormattedHTML_' + testName + '_output.txt';

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

function formatTestSassFiles (testName, preformattedSassTemplate, formattedSassTemplate) {
    try {
        cprint.magenta('Testing ' + testName + ' formatting preformatted sass outputs to formatted sass');

        var inputSass = preformattedSassTemplate;
        var expectedOutputSass = formattedSassTemplate;

        var test1_expectedOutputSassFile = '_formatTest_sass_' + testName + '_expectedOutput.txt';
        var test1_outputSassFile = '_formatTest_sass_' + testName + '_output.txt';

        var outputSass = torisFormat.format_sass_contents(inputSass, 0, true);
        if (outputSass && expectedOutputSass && outputSass.trim() == expectedOutputSass.trim()) {
            cprint.green('Success!');
            fs.exists(test1_expectedOutputSassFile, (exists) => { if (exists) { fsp.remove(test1_expectedOutputSassFile); } } );
            fs.exists(test1_outputSassFile, (exists) => { if (exists) { fsp.remove(test1_outputSassFile); } } );
        } else if (outputSass) {
            cprint.red('Unexpected Sass');
            fsp.write(test1_expectedOutputSassFile, expectedOutputSass);
            fsp.write(test1_outputSassFile, outputSass);
            return;
        }
    } catch (err) {
        cprint.red('Couldn\'t parse preformatted Sass template');
        cprint.red(err);
    }

    try {
        cprint.magenta('Testing ' + testName + ' formatting already formatted sass still outputs to formatted sass');

        var inputSass = formattedSassTemplate;
        var expectedOutputSass = formattedSassTemplate;

        var test2_expectedOutputSassFile = '_formatTest_alreadyFormattedSass_' + testName + '_expectedOutput.txt';
        var test2_outputSassFile = '_formatTest_alreadyFormattedSass_' + testName + '_output.txt';

        var outputSass = torisFormat.format_sass_contents(inputSass, 0, true);
        if (outputSass && expectedOutputSass && outputSass.trim() == expectedOutputSass.trim()) {
            cprint.green('Success!');
            fs.exists(test2_expectedOutputSassFile, (exists) => { if (exists) { fsp.remove(test2_expectedOutputSassFile); } } );
            fs.exists(test2_outputSassFile, (exists) => { if (exists) { fsp.remove(test2_outputSassFile); } } );
        } else if (outputSass) {
            cprint.red('Unexpected Sass');
            fsp.write(test2_expectedOutputSassFile, expectedOutputSass);
            fsp.write(test2_outputSassFile, outputSass);
            return;
        }

    } catch (err) {
        cprint.red('Couldn\'t parse preformatted Sass template');
        cprint.red(err);
    }

    return true;
}

// ******************************

function printTestSCSS () {
    torisFormat.setup({
    });

    cprint.magenta('Testing printing of formatted Sass output');
    // Test printing;
    torisFormat.print_sass_contents('.class{position:relative;width:35px}', 0, true);
    return true;
}

// ******************************

