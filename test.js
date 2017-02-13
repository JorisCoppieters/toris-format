'use strict';

var torisFormat = require('./index.js');
var path = require('path');
var cprint = require('color-print');
var fs = require('fs');
var fsp = require('fs-process');

// ******************************

runTests();

// ******************************

function runTests () {
    if (!formatTestBaseSass()) { return };
    if (!formatTestSingleCommentSass()) { return };
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

    if (!printTestBaseSass()) { return };
}

// ******************************

function formatTestBaseSass () {
    torisFormat.setup({
        line_ending: '\r\n'
    });

    // Test base formatting
    let preformattedSassContents = fs.readFileSync(path.resolve(__dirname, './test/scss/format-test-base-preformatted.scss'), 'utf8');
    let formattedSassContents = fs.readFileSync(path.resolve(__dirname, './test/scss/format-test-base-formatted.scss'), 'utf8');
    return formatTestSassFiles('Base', preformattedSassContents, formattedSassContents);
}

// ******************************

function formatTestSingleCommentSass () {
    torisFormat.setup({
        line_ending: '\r\n'
    });

    // Test single comment formatting
    let preformattedSassContents = fs.readFileSync(path.resolve(__dirname, './test/scss/format-test-single-comment-preformatted.scss'), 'utf8');
    let formattedSassContents = fs.readFileSync(path.resolve(__dirname, './test/scss/format-test-single-comment-formatted.scss'), 'utf8');
    return formatTestSassFiles('SingleComment', preformattedSassContents, formattedSassContents);
}

// ******************************

function formatTestSinglePseudoSelectorSass () {
    torisFormat.setup({
        line_ending: '\r\n'
    });

    // Test single pseudo selector formatting
    let preformattedSassContents = fs.readFileSync(path.resolve(__dirname, './test/scss/format-test-single-pseudo-selector-preformatted.scss'), 'utf8');
    let formattedSassContents = fs.readFileSync(path.resolve(__dirname, './test/scss/format-test-single-pseudo-selector-formatted.scss'), 'utf8');
    return formatTestSassFiles('SinglePseudoSelector', preformattedSassContents, formattedSassContents);
}

// ******************************

function formatTestBase () {
    torisFormat.setup({
        line_ending: '\r\n'
    });

    // Test base style formatting
    let preformattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-base-preformatted.html'), 'utf8');
    let formattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-base-formatted.html'), 'utf8');
    return formatTestHTMLFiles('Base', preformattedHtmlContents, formattedHtmlContents);
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
    let preformattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-ng1-preformatted.html'), 'utf8');
    let formattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-ng1-formatted.html'), 'utf8');
    return formatTestHTMLFiles('NG1', preformattedHtmlContents, formattedHtmlContents);
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
    let preformattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-ng2-preformatted.html'), 'utf8');
    let formattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-ng2-formatted.html'), 'utf8');
    return formatTestHTMLFiles('NG2', preformattedHtmlContents, formattedHtmlContents);
}

// ******************************

function formatTestOneTimeBinding () {
    torisFormat.setup({
        none_one_time_bound_elements: ['do-not-add-one-time-bindings'],
        one_time_bound_element_prefixes: ['my-']
    });

    // Test one time binding
    let preformattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-one-time-binding-preformatted.html'), 'utf8');
    let formattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-one-time-binding-formatted.html'), 'utf8');
    return formatTestHTMLFiles('OneTimeBinding', preformattedHtmlContents, formattedHtmlContents);
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
    let preformattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-block-inline-formatting-preformatted.html'), 'utf8');
    let formattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-block-inline-formatting-formatted.html'), 'utf8');
    return formatTestHTMLFiles('ForceFormatting', preformattedHtmlContents, formattedHtmlContents);
}

// ******************************

function formatTestMacOSXLineEndings () {
    torisFormat.setup({
        line_ending: '\r'
    });

    // Test NG2 MacOSX Line Endings
    let preformattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-macosx-line-endings-preformatted.html'), 'utf8');
    let formattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-macosx-line-endings-formatted.html'), 'utf8');
    return formatTestHTMLFiles('MacOSXLineEndings', preformattedHtmlContents, formattedHtmlContents);
}

// ******************************

function formatTestWindowsLineEndings () {
    torisFormat.setup({
        line_ending: '\r\n'
    });

    // Test NG2 Windows Line Endings
    let preformattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-windows-line-endings-preformatted.html'), 'utf8');
    let formattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-windows-line-endings-formatted.html'), 'utf8');
    return formatTestHTMLFiles('WindowsLineEndings', preformattedHtmlContents, formattedHtmlContents);
}

// ******************************

function formatTestLinuxLineEndings () {
    torisFormat.setup({
        line_ending: '\n'
    });

    // Test NG2 Linux Line Endings
    let preformattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-linux-line-endings-preformatted.html'), 'utf8');
    let formattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-linux-line-endings-formatted.html'), 'utf8');
    return formatTestHTMLFiles('LinuxLineEndings', preformattedHtmlContents, formattedHtmlContents);
}

// ***********************************

function formatTestRemoveCSS () {
    torisFormat.setup({
        remove_css: true
    });

    // Test removing CSS
    let preformattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-remove-css-preformatted.html'), 'utf8');
    let formattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-remove-css-formatted.html'), 'utf8');
    return formatTestHTMLFiles('RemoveCSS', preformattedHtmlContents, formattedHtmlContents);
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
    let preformattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-multi-class-preformatted.html'), 'utf8');
    let formattedHtmlContents = fs.readFileSync(path.resolve(__dirname, './test/html/format-test-multi-class-formatted.html'), 'utf8');
    return formatTestHTMLFiles('MultiClassFormatting', preformattedHtmlContents, formattedHtmlContents);
}

// ******************************

function printTestBaseSass () {
    torisFormat.setup({
        line_ending: '\r\n'
    });

    // Test printing base
    return printTestSassContents('Base', '.class{position:relative;width:35px}');
}

// ******************************
//
//
// TESTER FUNCTIONS
//
//
// ******************************

function formatTestHTMLFiles (testName, preformattedHtmlContents, formattedHtmlContents) {
    return formatTestFiles(testName, 'HTML', torisFormat.format_html_contents, preformattedHtmlContents, formattedHtmlContents);
}

// ******************************

function formatTestSassFiles (testName, preformattedSassContents, formattedSassContents) {
    return formatTestFiles(testName, 'Sass', (contents) => { return torisFormat.format_sass_contents(contents, 0, true); }, preformattedSassContents, formattedSassContents);
}

// ******************************

function formatTestFiles (testName, fileType, formatFunction, preformattedContents, formattedContents) {
    try {
        var testIdentifier = '[Test] ' + testName + ' formatting preformatted ' + fileType + ' outputs to formatted ' + fileType;

        var input = preformattedContents;
        var expectedOutput = formattedContents;

        var test1_expectedOutputFile = '_formatTest_' + fileType + '_' + testName + '_expectedOutput.txt';
        var test1_outputFile = '_formatTest_' + fileType + '_' + testName + '_output.txt';

        var output = formatFunction(input);
        if (output && expectedOutput && output.trim() == expectedOutput.trim()) {
            console.log(cprint.toGreen('✔') + ' ' + cprint.toMagenta(testIdentifier));
            fs.exists(test1_expectedOutputFile, (exists) => { if (exists) { fsp.remove(test1_expectedOutputFile); } } );
            fs.exists(test1_outputFile, (exists) => { if (exists) { fsp.remove(test1_outputFile); } } );
        } else if (output) {
            console.log(cprint.toRed('✘') + ' ' + cprint.toMagenta(testIdentifier) + '\n' + cprint.toRed('Unexpected ' + fileType));
            fsp.write(test1_expectedOutputFile, expectedOutput);
            fsp.write(test1_outputFile, output);
            return;
        }
    } catch (err) {
        console.log(cprint.toRed('✘') + ' ' + cprint.toMagenta(testIdentifier) + '\n' + cprint.toRed('Couldn\'t parse preformatted ' + fileType + '\n'));
        cprint.red(err);
    }

    try {
        var testIdentifier = '[Test] ' + testName + ' formatting already formatted ' + fileType + ' still outputs to formatted ' + fileType;

        var input = formattedContents;
        var expectedOutput = formattedContents;

        var test2_expectedOutputFile = '_formatTest_alreadyFormatted_' + fileType + '_' + testName + '_expectedOutput.txt';
        var test2_outputFile = '_formatTest_alreadyFormatted_' + fileType + '_' + testName + '_output.txt';

        var output = formatFunction(input);
        if (output && expectedOutput && output.trim() == expectedOutput.trim()) {
            console.log(cprint.toGreen('✔') + ' ' + cprint.toMagenta(testIdentifier));
            fs.exists(test2_expectedOutputFile, (exists) => { if (exists) { fsp.remove(test2_expectedOutputFile); } } );
            fs.exists(test2_outputFile, (exists) => { if (exists) { fsp.remove(test2_outputFile); } } );
        } else if (output) {
            console.log(cprint.toRed('✘') + ' ' + cprint.toMagenta(testIdentifier) + '\n' + cprint.toRed('Unexpected ' + fileType));
            fsp.write(test2_expectedOutputFile, expectedOutput);
            fsp.write(test2_outputFile, output);
            return;
        }

    } catch (err) {
        console.log(cprint.toRed('✘') + ' ' + cprint.toMagenta(testIdentifier) + '\n' + cprint.toRed('Couldn\'t parse preformatted ' + fileType + '\n'));
        cprint.red(err);
    }

    return true;
}

// ******************************

function printTestSassContents (testName, contents) {
    return printTestContents(testName, 'Sass', (contents) => { return torisFormat.print_sass_contents(contents, 0, true); }, contents);
}

// ******************************

function printTestContents (testName, fileType, printFunction, contents) {
    torisFormat.setup({
    });

    var testIdentifier = '[Visual Test] Printing of formatted ' + fileType + ' output';

    console.log(cprint.toYellow(cprint.toBold('?', true)) + ' ' + cprint.toMagenta(testIdentifier) + cprint.toBold(cprint.toYellow(' - Does this look good?', true)));
    printFunction(contents);

    return true;
}

// ******************************

