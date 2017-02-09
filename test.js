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
    formatTestBaseSCSS();

    // formatTestBase(function () {
    // formatTestNG1(function () {
    // formatTestNG2(function () {
    // formatTestForceFormatting(function () {
    // formatTestOneTimeBinding(function () {
    // formatTestMacOSXLineEndings(function () {
    // formatTestWindowsLineEndings(function () {
    // formatTestLinuxLineEndings(function () {
    // formatTestRemoveCSS(function () {
    // formatTestMultiClassFormatting(function () {
    // })})})})})})})})})});
}

// ******************************

function formatTestBaseSCSS (cbSuccess) {
    torisFormat.setup({
    });

    // Test base style formatting
    fsp.read(path.resolve(__dirname, './test/format-test-base-preformatted.scss'), function (preformattedSassTemplate) {
        fsp.read(path.resolve(__dirname, './test/format-test-base-formatted.scss'), function (formattedSassTemplate) {
            var testsPassed = formatTestSassFiles("base", preformattedSassTemplate, formattedSassTemplate);
            if (testsPassed && cbSuccess) {
                cbSuccess();
            }
        });
    });
}

// ******************************

function formatTestBase (cbSuccess) {
    torisFormat.setup({
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
        ng_version: 1.5,
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
        ]
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

function formatTestOneTimeBinding (cbSuccess) {
    torisFormat.setup({
        none_one_time_bound_elements: ['do-not-add-one-time-bindings'],
        one_time_bound_element_prefixes: ['my-']
    });

    // Test one time binding
    fsp.read(path.resolve(__dirname, './test/format-test-one-time-binding-preformatted.html'), function (preformattedHtmlTemplate) {
        fsp.read(path.resolve(__dirname, './test/format-test-one-time-binding-formatted.html'), function (formattedHtmlTemplate) {
            var testsPassed = formatTestFiles("OneTimeBinding", preformattedHtmlTemplate, formattedHtmlTemplate);
            if (testsPassed && cbSuccess) {
                cbSuccess();
            }
        });
    });
}

// ******************************

function formatTestForceFormatting (cbSuccess) {
    torisFormat.setup({
        block_elements: ['force-block'],
        force_block_whitespace_formatting: true,
        force_inline_whitespace_formatting: true,
        inline_elements: ['whitespace', 'force-inline']
    });

    // Test forcing block/inline formatting
    fsp.read(path.resolve(__dirname, './test/format-test-block-inline-formatting-preformatted.html'), function (preformattedHtmlTemplate) {
        fsp.read(path.resolve(__dirname, './test/format-test-block-inline-formatting-formatted.html'), function (formattedHtmlTemplate) {
            var testsPassed = formatTestFiles("ForceFormatting", preformattedHtmlTemplate, formattedHtmlTemplate);
            if (testsPassed && cbSuccess) {
                cbSuccess();
            }
        });
    });
}

// ******************************

function formatTestMacOSXLineEndings (cbSuccess) {
    torisFormat.setup({
        line_ending: '\r'
    });

    // Test NG2 MacOSX Line Endings
    fsp.read(path.resolve(__dirname, './test/format-test-macosx-line-endings-preformatted.html'), function (preformattedHtmlTemplate) {
        fsp.read(path.resolve(__dirname, './test/format-test-macosx-line-endings-formatted.html'), function (formattedHtmlTemplate) {
            var testsPassed = formatTestFiles("MacOSXLineEndings", preformattedHtmlTemplate, formattedHtmlTemplate);
            if (testsPassed && cbSuccess) {
                cbSuccess();
            }
        });
    });
}

// ******************************

function formatTestWindowsLineEndings (cbSuccess) {
    torisFormat.setup({
        line_ending: '\r\n'
    });

    // Test NG2 Windows Line Endings
    fsp.read(path.resolve(__dirname, './test/format-test-windows-line-endings-preformatted.html'), function (preformattedHtmlTemplate) {
        fsp.read(path.resolve(__dirname, './test/format-test-windows-line-endings-formatted.html'), function (formattedHtmlTemplate) {
            var testsPassed = formatTestFiles("WindowsLineEndings", preformattedHtmlTemplate, formattedHtmlTemplate);
            if (testsPassed && cbSuccess) {
                cbSuccess();
            }
        });
    });
}

// ******************************

function formatTestLinuxLineEndings (cbSuccess) {
    torisFormat.setup({
        line_ending: '\n'
    });

    // Test NG2 Linux Line Endings
    fsp.read(path.resolve(__dirname, './test/format-test-linux-line-endings-preformatted.html'), function (preformattedHtmlTemplate) {
        fsp.read(path.resolve(__dirname, './test/format-test-linux-line-endings-formatted.html'), function (formattedHtmlTemplate) {
            var testsPassed = formatTestFiles("LinuxLineEndings", preformattedHtmlTemplate, formattedHtmlTemplate);
            if (testsPassed && cbSuccess) {
                cbSuccess();
            }
        });
    });
}

// ***********************************

function formatTestRemoveCSS (cbSuccess) {
    torisFormat.setup({
        remove_css: true
    });

    // Test removing CSS
    fsp.read(path.resolve(__dirname, './test/format-test-remove-css-preformatted.html'), function (preformattedHtmlTemplate) {
        fsp.read(path.resolve(__dirname, './test/format-test-remove-css-formatted.html'), function (formattedHtmlTemplate) {
            var testsPassed = formatTestFiles("RemoveCSS", preformattedHtmlTemplate, formattedHtmlTemplate);
            if (testsPassed && cbSuccess) {
                cbSuccess();
            }
        });
    });
}

// ******************************

function formatTestMultiClassFormatting (cbSuccess) {
    torisFormat.setup({
        format_multi_classes_with_at_least: 1,
        multi_classes_order: [
            'z-.*'
        ]
    });

    // Test formatting multi classes
    fsp.read(path.resolve(__dirname, './test/format-test-multi-class-preformatted.html'), function (preformattedHtmlTemplate) {
        fsp.read(path.resolve(__dirname, './test/format-test-multi-class-formatted.html'), function (formattedHtmlTemplate) {
            var testsPassed = formatTestFiles("MultiClassFormatting", preformattedHtmlTemplate, formattedHtmlTemplate);
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

function formatTestSassFiles (testName, preformattedSassTemplate, formattedSassTemplate) {
    try {
        cprint.magenta('Testing ' + testName + ' formatting preformatted sass outputs to formatted sass');

        var inputSass = preformattedSassTemplate;
        var expectedOutputSass = formattedSassTemplate;

        var test1_expectedOutputSassFile = '_formatTest_' + testName + '_expectedOutput.txt';
        var test1_outputSassFile = '_formatTest_' + testName + '_output.txt';

        var outputSass = torisFormat.format_sass_file(inputSass);
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

        var test2_expectedOutputSassFile = '_alreadyFormattedTest_' + testName + '_expectedOutput.txt';
        var test2_outputSassFile = '_alreadyFormattedTest_' + testName + '_output.txt';

        var outputSass = torisFormat.format_sass_file(inputSass);
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
