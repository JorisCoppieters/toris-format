'use strict'; // JS: ES5

// ******************************
//
//
// GRAMMAR CHECKS
//
//
// ******************************

// ******************************
// Requires:
// ******************************

var grammar = require('../grammars/_core');

// ******************************
// Constants:
// ******************************

const FALSE = false;

// ******************************
// Functions:
// ******************************

function check_grammar(in_definition) {
    var result = false;

    do {
        var definition_value;

        var definition_keys = Object.keys(in_definition);
        definition_keys = definition_keys.filter(function (definition_key) {
            definition_value = in_definition[definition_key];
            if (!definition_value) {
                throw new Error('Definition key "' + definition_key + '" isn\'t defined');
            }
            return !definition_key.match(/[*+?]$/);
        });

        var used_definition_keys = [];
        definition_keys.forEach(function (definition_key) {
            used_definition_keys = used_definition_keys.concat(in_definition[definition_key].SEGMENTS || []);
        });

        var or_definition_keys = definition_keys.filter(function (definition_key) {
            return in_definition[definition_key].OPERATOR === '||';
        });

        var non_value_definition_keys = definition_keys.filter(function (definition_key) {
            return in_definition[definition_key].VALUE === undefined;
        });

        non_value_definition_keys.forEach(function (definition_key) {
            if (definition_key === grammar.k_DEFINITION_KEY_START) {
                return;
            }
            if (
                used_definition_keys.indexOf(definition_key) < 0 &&
                used_definition_keys.indexOf(definition_key + '+') < 0 &&
                used_definition_keys.indexOf(definition_key + '*') < 0 &&
                used_definition_keys.indexOf(definition_key + '?') < 0
            ) {
                throw new Error('Definition key "' + definition_key + '" is never used');
            }
        });

        or_definition_keys.forEach(function (definition_key) {
            check_left_factored(in_definition, definition_key);
        });
    } while (FALSE);

    return result;
}

// ******************************

function check_left_factored(in_definition, in_definition_key) {
    var result = false;

    do {
        var definition_value = in_definition[in_definition_key];
        if (!definition_value.SEGMENTS) {
            throw new Error('Definition key "' + in_definition_key + '" has no defined SEGMENTS');
        }

        if (!definition_value.SEGMENTS.length) {
            throw new Error('Definition key "' + in_definition_key + '" has 0 SEGMENTS');
        }

        var left_most_definition_values_for_key;
        var left_most_definition_value_seen_key;
        var left_most_definition_values = [];

        definition_value.SEGMENTS.forEach(function (sub_definition_key) {
            left_most_definition_values_for_key = get_left_most_definition_values(in_definition, [sub_definition_key]);
            left_most_definition_values_for_key.forEach(function (left_most_definition_value) {
                if (left_most_definition_value === grammar.k_DEFINITION_KEY_EMPTY) {
                    return;
                }

                left_most_definition_value_seen_key = left_most_definition_values[left_most_definition_value];

                if (left_most_definition_value_seen_key && left_most_definition_value_seen_key !== sub_definition_key) {
                    throw new Error(
                        'Definition keys "' +
                            sub_definition_key +
                            '" and "' +
                            left_most_definition_value_seen_key +
                            '" share left-most definition value "' +
                            left_most_definition_value +
                            '" in the context of "' +
                            in_definition_key +
                            '"'
                    );
                }

                left_most_definition_values[left_most_definition_value] = sub_definition_key;
            });
        });

        result = true;
    } while (FALSE);

    return result;
}

// ******************************

function get_left_most_definition_values(in_definition, in_definition_keys) {
    var result = [];

    do {
        var definition_value;
        var left_most_definition_key;
        var left_most_definition_keys;
        var idx;

        in_definition_keys.forEach(function (definition_key) {
            definition_value = in_definition[definition_key];
            if (!definition_value) {
                throw new Error('Definition key "' + definition_key + '" isn\'t defined');
            }

            if (definition_value.VALUE !== undefined) {
                result.push(definition_key);
                return;
            }

            if (definition_value.OPERATOR === '||') {
                result = result.concat(get_left_most_definition_values(in_definition, definition_value.SEGMENTS || []));
                return;
            }

            if (!definition_value.SEGMENTS) {
                throw new Error('Definition key "' + definition_key + '" has no defined SEGMENTS or VALUE');
            }

            if (!definition_value.SEGMENTS.length) {
                throw new Error('Definition key "' + definition_key + '" has 0 SEGMENTS');
            }

            left_most_definition_key = definition_value.SEGMENTS[0];
            left_most_definition_keys = [left_most_definition_key];

            idx = 0;
            while (left_most_definition_key && left_most_definition_key.match(/[*?]$/)) {
                left_most_definition_key = definition_value.SEGMENTS[++idx];
                if (left_most_definition_key) {
                    left_most_definition_keys.push(left_most_definition_key);
                }
            }

            result = result.concat(get_left_most_definition_values(in_definition, left_most_definition_keys));
        });
    } while (FALSE);

    return result;
}

// ******************************
// Exports:
// ******************************

module.exports['check_grammar'] = check_grammar;

// ******************************
