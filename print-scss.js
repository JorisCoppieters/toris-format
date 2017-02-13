'use strict';

var torisFormat = require('./index.js');
var path = require('path');
var cprint = require('color-print');
var minimist = require('minimist');
var fs = require('fs');

// ******************************

var g_ARGV = minimist(process.argv.slice(2));
var g_FILE = g_ARGV['file'];

// ******************************

printTestSCSS();

// ******************************

function printTestSCSS () {
    if (!g_FILE) {
      cprint.red('Please specify a file');
      return;
    }

    var contents = fs.readFileSync(path.resolve(__dirname, g_FILE), 'utf8');
    torisFormat.print_sass_contents(contents, 0, true);
    return true;
}

// ******************************

