'use strict';

var torisFormat = require('./index.js');
var path = require('path');
var cprint = require('color-print');
var fs = require('fs');

// ******************************

printTestSCSS();

// ******************************

function printTestSCSS () {
    var contents = fs.readFileSync(path.resolve(__dirname, './test/format-test-base-preformatted.scss'), 'utf8');
    torisFormat.print_sass_contents(contents);
    return true;
}

// ******************************

