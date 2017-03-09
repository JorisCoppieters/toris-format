'use strict'; // JS: ES5

// ******************************
//
//
// TANGRAM API OUTPUT FILE
//
//
// ******************************

// ******************************
// Output:
// ******************************

function get_tree_output_structure (in_tree, in_options) {
  var selector = '';

  var componentDeclarationEntries = findComponents(findFirstComponent(in_tree, 'COMPONENT_DECLARATION'), 'COMPONENT_DECLARATION_ENTRY');
  componentDeclarationEntries.forEach(function (entry) {
      var key = collapseValues(findFirstComponent(entry, 'VAL__LETTERS'));
      if (key === 'selector') {
          var valNode = findFirstComponent(entry, 'COMPONENT_DECLARATION_ENTRY_VALUE');
          var stringValNode = findFirstComponent(valNode, 'STRING_VALUE');
          if (stringValNode) {
              var stringVal = getStringValue(stringValNode);
              selector = stringVal;
          }
      }
  });

  var bindings = [];
  var context = {};

  var boundDeclarationEntries = findComponents(in_tree, 'CLASS_BOUND_DECLARATION');
  boundDeclarationEntries.forEach(function (entry) {
      var bindingType = collapseValues(findFirstComponent(entry, 'CLASS_BINDING_TOKEN'));
      var bindingTokenStringValNode = findFirstComponent(entry, 'CLASS_BINDING_TOKEN_CONTENTS');
      var bindingTokenStringVal = getStringValue(bindingTokenStringValNode);

      var bindingValueType = 'any';

      var classNamedFieldDeclaration = findFirstComponent(entry, 'CLASS_NAMED_FIELD_DECLARATION');
      if (classNamedFieldDeclaration) {
          bindingValueType = collapseValues(findFirstComponent(classNamedFieldDeclaration, 'VAL__LETTERS'));
      }

      var classNamedFunctionDeclaration = findFirstComponent(entry, 'CLASS_NAMED_FUNCTION_DECLARATION');
      if (classNamedFunctionDeclaration) {
          var functionReturnType = findFirstComponent(classNamedFunctionDeclaration, 'FUNCTION_RETURN_TYPE');
          bindingValueType = collapseValues(findFirstComponent(functionReturnType, 'VAL__LETTERS'));
      }

      var bindingName;
      var bindingAccessorNameNode = findFirstComponent(entry, 'CLASS_ACCESSOR_DECLARATION');
      if (bindingAccessorNameNode) {
          bindingName = collapseValues(findFirstComponent(bindingAccessorNameNode, 'VAL__LETTERS'));
      }

      var bindingValueNode = findFirstComponent(entry, 'CLASS_BINDING_VALUE');
      if (bindingValueNode) {
          bindingName = collapseValues(findFirstComponent(bindingValueNode, 'VAL__LETTERS'));
      }

      if (['@Input', '@Output'].indexOf(bindingType) < 0)
        return;

      var binding = {
        isInput: bindingType === '@Input',
        isOutput: bindingType === '@Output',
        name: bindingTokenStringVal || bindingName,
        type: bindingValueType
      };

      bindings.push(binding);
      // console.log(bindingType + ":" + bindingTokenStringVal + ":" + bindingName + ":" + bindingValueType);
  });

  var api = {
    bindings,
    context
  };

  var structure = {};
  structure["api"] = api;

  var result = {};
  result[selector] = structure;

  return result;
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
// Exports:
// ******************************

module.exports['get_tree_output_structure'] = get_tree_output_structure;

// ******************************