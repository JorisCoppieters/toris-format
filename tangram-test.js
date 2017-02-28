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
    var testFile = './test/tangram_api/structure-test-001.ts';
    var testFileContents = fs.readFileSync(testFile, 'utf8');
    var parser = torisFormat.parser;

    parser.setup({
        definition_type: parser.k_DEFINITION_TYPE_TANGRAM_API,
        debug: false
    });

    var info = {};

    var tree = parser.parse_contents(testFileContents || '');
    if (tree.FAILED) {
        cprint.red('Tree Failed!');
    }
    outputNode(tree);

    var componentDeclarationEntries = findComponents(findFirstComponent(tree, 'COMPONENT_DECLARATION'), 'COMPONENT_DECLARATION_ENTRY');
    componentDeclarationEntries.forEach(function (entry) {
        var key = collapseValues(findFirstComponent(entry, 'VAL__LETTERS'));
        if (key === 'selector') {
            var valNode = findFirstComponent(entry, 'COMPONENT_DECLARATION_ENTRY_VALUE');
            var stringValNode = findFirstComponent(valNode, 'STRING_VALUE');
            if (stringValNode) {
                var stringVal = getStringValue(stringValNode);
                info.selector = stringVal;
            }
        }
    });

    var boundDeclarationEntries = findComponents(tree, 'CLASS_BOUND_DECLARATION');
    boundDeclarationEntries.forEach(function (entry) {
        var bindingType = collapseValues(findFirstComponent(entry, 'CLASS_BINDING_TOKEN'));
        var bindingTokenStringValNode = findFirstComponent(entry, 'CLASS_BINDING_TOKEN_CONTENTS');
        var bindingTokenStringVal = getStringValue(bindingTokenStringValNode);

        var bindingName;
        var bindingAccessorNameNode = findFirstComponent(entry, 'CLASS_ACCESSOR_DECLARATION');
        if (bindingAccessorNameNode) {
            bindingName = collapseValues(findFirstComponent(bindingAccessorNameNode, 'VAL__LETTERS'));
        }

        var bindingValueNode = findFirstComponent(entry, 'CLASS_BINDING_VALUE');
        if (bindingValueNode) {
            bindingName = collapseValues(findFirstComponent(bindingValueNode, 'VAL__LETTERS'));
        }

        console.log(bindingType + ":" + bindingName);
    });

    console.log(info);
}

// ******************************

function outputNode(node, indent) {
    if (!node.DEFINITION_KEY)
        return;

    indent = indent || '';
    var definitionKey = node.DEFINITION_KEY;
    var definitionVal = (node.VALUE || '').trim();

    if (definitionVal && definitionVal.length > 50)
        cprint.yellow(indent + definitionKey + '===>' + definitionVal.substr(0, 50) + '...');
    else if (definitionVal)
        cprint.green(indent + definitionKey + '===>' + definitionVal);
    else
        cprint.cyan(indent + definitionKey);

    (node.CHILDREN || []).forEach(function (child) {  outputNode(child, indent + '  '); });
}

// ******************************

function getStringValue (stringValueNode) {
    var singleQuotedStringVal = findFirstComponent(stringValueNode, 'VAL__SQUOTED_STRING');
    var doubleQuotedStringVal = findFirstComponent(stringValueNode, 'VAL__DQUOTED_STRING');
    if (singleQuotedStringVal && singleQuotedStringVal.VALUE) {
        return singleQuotedStringVal.VALUE.trim().replace(/^\'(.*)\'$/, "$1"); // Strip single quotes
    } else if (doubleQuotedStringVal && doubleQuotedStringVal.VALUE) {
        return doubleQuotedStringVal.VALUE.trim().replace(/^"(.*)"$/, "$1"); // Strip double quotes
    }
    return '';
}

// ******************************

function collapseValues (node) {
    if (node.CHILDREN && node.CHILDREN.length) {
        return node.CHILDREN.reduce(function (total, child) { return total + collapseValues(child); }, '');
    }
    return (node.VALUE || '').trim();
}

// ******************************

function firstChild (node) {
    if (node.CHILDREN && node.CHILDREN.length) {
        return node.CHILDREN[0];
    }
    return false;
}

// ******************************

function findFirstComponent (node, definitionKey) {
    var components = findComponents(node, definitionKey);
    return (components && components.length) ? components[0] : false;
}

// ******************************

function findComponents (node, definitionKey) {
    if (!node) {
        return [];
    }

    if (node.DEFINITION_KEY === definitionKey) {
        return node;
    }

    var matched = [];
    (node.CHILDREN || []).forEach(function (child) {
        matched = matched.concat(findComponents(child, definitionKey));
    });

    return matched;
}

// ******************************
