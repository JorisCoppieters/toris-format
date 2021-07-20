'use strict'; // JS: ES5

// ******************************
// Requires:
// ******************************

var fs = require('fs');
var minimist = require('minimist');
var path = require('path');
var parser = require('./src/parser_html.js');
var logger = require('./src/logger');

// ******************************
// Arguments:
// ******************************

var g_ARGV = minimist(process.argv.slice(2));

// ******************************
// Script:
// ******************************

logger.CONFIG.logColour = true;
logger.CONFIG.logLevel = 5;

runDiff();

// ******************************
// Functions:
// ******************************

function runDiff() {
    const htmlFile = path.join('test/html/format-test-001-base-preformatted.html');
    const unformattedHTML = fs.readFileSync(htmlFile).toString();

    const config = {
        definition_type: 'HTML'
    }

    parser.setup(config);
    const tree = parser.get_html_content_tree(unformattedHTML);

    console.log(tree);
}

// ******************************
