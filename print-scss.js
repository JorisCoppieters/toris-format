'use strict'; // JS: ES5

var torisFormat = require('./index.js');
var path = require('path');
var cprint = require('color-print');
var minimist = require('minimist');
var fs = require('fs');

// ******************************

var g_ARGV = minimist(process.argv.slice(2));
var g_FILE = g_ARGV['file'];
var g_RUN_CHECKS = g_ARGV['run-checks'];

// ******************************

printTestSCSS();

// ******************************

function printTestSCSS () {
    if (!g_FILE) {
      cprint.red('Please specify a file');
      return;
    }

    torisFormat.setup({
      definition_type: torisFormat.k_DEFINITION_TYPE_SCSS,
      debug: true,
      run_checks: g_RUN_CHECKS
    });

    let file = g_FILE;
    let fileExtension = 'scss';
    let dirname = path.dirname(file);
    let basename = path.basename(file);

    let regexp1 = new RegExp('(format-test-(.*))-(?:pre)?formatted.' + fileExtension);
    let regexp2 = new RegExp('(print-test-(.*)).' + fileExtension);

    let matches = basename.match(regexp1);
    if (!matches) {
      matches = basename.match(regexp2);
    }

    if (!matches) {
        return;
    }

    let basenamePrefix = matches[1];
    let testName = matches[2];
    let sassContents = fs.readFileSync(file, 'utf8');
    let configFile = path.resolve(__dirname, dirname, basenamePrefix + '-conf.json');
    if (fs.existsSync(configFile)) {
        let config = require(configFile);
        torisFormat.setup(config);
    }

    torisFormat.print_sass_contents(sassContents, 0, true);
}

// ******************************

