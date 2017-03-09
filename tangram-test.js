'use strict'; // JS: ES5

var torisFormat = require('./index.js');
var path = require('path');
var cprint = require('color-print');
var fs = require('fs');
var fsp = require('fs-process');

// ******************************

var g_TEST_FAILED = false;

// ******************************

runTests();

// ******************************

function runTests () {
    structureTest();
}

// ******************************

function structureTest () {
    var testFile = './test/tangram_api/format-test-001-simple-preformatted.ts';
    var testFileContents = fs.readFileSync(testFile, 'utf8');
    var parser = torisFormat.parser;
    var debug = false;

    parser.setup({
        definition_type: parser.k_DEFINITION_TYPE_TANGRAM_API,
        debug
    });

    if (debug) {
        cprint.magenta('--------');
        cprint.magenta('Parsing:');
        cprint.magenta('--------');
    }

    var tree = parser.parse_contents(testFileContents || '');
    var tree_output = parser.get_tree_output(tree);

    if (debug) {
        fsp.write('./_debug_ast_structure.txt', tree_output.values);
    }

    cprint.magenta('-----');
    cprint.magenta('Tree:');
    cprint.magenta('-----');

    // parser.print_tree(tree);

    if (tree.FAILED) {
        cprint.yellow('----------');
        cprint.yellow('Failed on:');
        cprint.yellow('----------');

        parser.print_recognized_chunk(tree);
    }

    cprint.magenta('----------');
    cprint.magenta('Structure:');
    cprint.magenta('----------');

    var structure = parser.get_tree_output_structure(tree);
    var json = JSON.stringify(structure, null, 4);
    console.log(json);
}

// ******************************
