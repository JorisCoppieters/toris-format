'use strict';

// ******************************
//
//
// PRINT LIBRARY
//
//
// ******************************

// ******************************
// Constants:
// ******************************

const c_TERMINAL_COLOR_RESET = '\x1b[0m';
const c_TERMINAL_COLOR_DEFAULT = '\x1b[0;29m';
const c_TERMINAL_COLOR_BLACK = '\x1b[0;30m';
const c_TERMINAL_COLOR_RED = '\x1b[0;31m';
const c_TERMINAL_COLOR_GREEN = '\x1b[0;32m';
const c_TERMINAL_COLOR_YELLOW = '\x1b[0;33m';
const c_TERMINAL_COLOR_BLUE = '\x1b[0;34m';
const c_TERMINAL_COLOR_MAGENTA = '\x1b[0;35m';
const c_TERMINAL_COLOR_CYAN = '\x1b[0;36m';
const c_TERMINAL_COLOR_LIGHT_GRAY = '\x1b[0;37m';
const c_TERMINAL_COLOR_DARK_GRAY = '\x1b[0;90m';
const c_TERMINAL_COLOR_LIGHT_RED = '\x1b[0;91m';
const c_TERMINAL_COLOR_LIGHT_GREEN = '\x1b[0;92m';
const c_TERMINAL_COLOR_LIGHT_YELLOW = '\x1b[0;93m';
const c_TERMINAL_COLOR_LIGHT_BLUE = '\x1b[0;94m';
const c_TERMINAL_COLOR_LIGHT_MAGENTA = '\x1b[0;95m';
const c_TERMINAL_COLOR_LIGHT_CYAN = '\x1b[0;96m';
const c_TERMINAL_COLOR_WHITE = '\x1b[0;97m';

const c_TERMINAL_BACKGROUND_COLOR_DEFAULT = '\x1b[0;49m';
const c_TERMINAL_BACKGROUND_COLOR_BLACK = '\x1b[0;40m';
const c_TERMINAL_BACKGROUND_COLOR_RED = '\x1b[0;41m';
const c_TERMINAL_BACKGROUND_COLOR_GREEN = '\x1b[0;42m';
const c_TERMINAL_BACKGROUND_COLOR_YELLOW = '\x1b[0;43m';
const c_TERMINAL_BACKGROUND_COLOR_BLUE = '\x1b[0;44m';
const c_TERMINAL_BACKGROUND_COLOR_MAGENTA = '\x1b[0;45m';
const c_TERMINAL_BACKGROUND_COLOR_CYAN = '\x1b[0;46m';
const c_TERMINAL_BACKGROUND_COLOR_LIGHT_GRAY = '\x1b[0;47m';
const c_TERMINAL_BACKGROUND_COLOR_DARK_GRAY = '\x1b[0;100m';
const c_TERMINAL_BACKGROUND_COLOR_LIGHT_RED = '\x1b[0;101m';
const c_TERMINAL_BACKGROUND_COLOR_LIGHT_GREEN = '\x1b[0;102m';
const c_TERMINAL_BACKGROUND_COLOR_LIGHT_YELLOW = '\x1b[0;103m';
const c_TERMINAL_BACKGROUND_COLOR_LIGHT_BLUE = '\x1b[0;104m';
const c_TERMINAL_BACKGROUND_COLOR_LIGHT_MAGENTA = '\x1b[0;105m';
const c_TERMINAL_BACKGROUND_COLOR_LIGHT_CYAN = '\x1b[0;106m';
const c_TERMINAL_BACKGROUND_COLOR_WHITE = '\x1b[0;107m';

// ******************************
// Exports:
// ******************************

module.exports = {
    white: printWhite,
    red: printRed,
    yellow: printYellow,
    green: printGreen,
    cyan: printCyan,
    blue: printBlue,
    magenta: printMagenta,
    rainbow: printRainbow,
    toWhite: makeWhite,
    toRed: makeRed,
    toYellow: makeYellow,
    toGreen: makeGreen,
    toCyan: makeCyan,
    toBlue: makeBlue,
    toMagenta: makeMagenta,
    toRainbow: makeRainbow
};

// ******************************
// Functions:
// ******************************

function printWhite (input) {
    console.log(makeWhite(input));
}

// ******************************

function printRed (input) {
    console.log(makeRed(input));
}

// ******************************

function printYellow (input) {
    console.log(makeYellow(input));
}

// ******************************

function printGreen (input) {
    console.log(makeGreen(input));
}

// ******************************

function printCyan (input) {
    console.log(makeCyan(input));
}

// ******************************

function printBlue (input) {
    console.log(makeBlue(input));
}

// ******************************

function printMagenta (input) {
    console.log(makeMagenta(input));
}

// ******************************

function printRainbow (input) {
    console.log(makeRainbow(input));
}

// ******************************

function makeWhite (input) {
    return c_TERMINAL_COLOR_WHITE + input + c_TERMINAL_COLOR_RESET;
}

// ******************************

function makeRed (input) {
    return c_TERMINAL_COLOR_RED + input + c_TERMINAL_COLOR_RESET;
}

// ******************************

function makeYellow (input) {
    return c_TERMINAL_COLOR_YELLOW + input + c_TERMINAL_COLOR_RESET;
}

// ******************************

function makeGreen (input) {
    return c_TERMINAL_COLOR_GREEN + input + c_TERMINAL_COLOR_RESET;
}

// ******************************

function makeCyan (input) {
    return c_TERMINAL_COLOR_CYAN + input + c_TERMINAL_COLOR_RESET;
}

// ******************************

function makeBlue (input) {
    return c_TERMINAL_COLOR_BLUE + input + c_TERMINAL_COLOR_RESET;
}

// ******************************

function makeMagenta (input) {
    return c_TERMINAL_COLOR_MAGENTA + input + c_TERMINAL_COLOR_RESET;
}

// ******************************

function makeRainbow (input) {
    var colorFns = [
        makeRed,
        makeYellow,
        makeWhite,
        makeGreen,
        makeCyan,
        makeBlue,
        makeMagenta,
    ];

    var inputLength = input.length;
    var segmentLength = Math.max(1, inputLength / colorFns.length);

    var remaining = input;
    var colorFnIdx = 0;

    var line = '';

    while (remaining.length > 0) {
        var segment = remaining.substr(0, segmentLength);
        remaining = remaining.substr(segmentLength);

        var colorFn = colorFns[colorFnIdx];
        line += colorFn(segment);

        colorFnIdx = (colorFnIdx + 1) % colorFns.length;
    }

    return line;
}

// ******************************