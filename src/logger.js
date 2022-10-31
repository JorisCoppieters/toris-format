const cprint = require('color-print');

// ******************************
// State:
// ******************************

const CONFIG = {
    logLevel: 2,
    logColour: true,
};

const c_LOG_LEVEL_VERBOSE = 5;
const c_LOG_LEVEL_INFO = 4;
const c_LOG_LEVEL_SUCCESS = 3;
const c_LOG_LEVEL_WARNING = 2;
const c_LOG_LEVEL_ERROR = 1;
const c_LOG_LEVEL_NONE = 0;

// ******************************
// Definitions:
// ******************************

module.exports['data'] = _data;
module.exports['error'] = _error;
module.exports['info'] = _info;
module.exports['success'] = _success;
module.exports['verbose'] = _verbose;
module.exports['warning'] = _warning;
module.exports['CONFIG'] = CONFIG;

module.exports['c_LOG_LEVEL_VERBOSE'] = c_LOG_LEVEL_VERBOSE;
module.exports['c_LOG_LEVEL_INFO'] = c_LOG_LEVEL_INFO;
module.exports['c_LOG_LEVEL_SUCCESS'] = c_LOG_LEVEL_SUCCESS;
module.exports['c_LOG_LEVEL_WARNING'] = c_LOG_LEVEL_WARNING;
module.exports['c_LOG_LEVEL_ERROR'] = c_LOG_LEVEL_ERROR;
module.exports['c_LOG_LEVEL_NONE'] = c_LOG_LEVEL_NONE;

// ******************************
// Helper Functions:
// ******************************

function _verbose(in_message) {
    if (CONFIG.logLevel < c_LOG_LEVEL_VERBOSE) {
        return;
    }
    if (CONFIG.logColour) {
        cprint.darkGrey(in_message);
    } else {
        process.stdout.write(`${in_message}\n`);
    }
    return;
}

// ******************************

function _data(in_message) {
    process.stdout.write(`${in_message}\n`);
    return;
}

// ******************************

function _info(in_message) {
    if (CONFIG.logLevel < c_LOG_LEVEL_INFO) {
        return;
    }
    if (CONFIG.logColour) {
        cprint.cyan(in_message);
    } else {
        process.stdout.write(`${in_message}\n`);
    }
    return;
}

// ******************************

function _success(in_message) {
    if (CONFIG.logLevel < c_LOG_LEVEL_INFO) {
        return;
    }
    if (CONFIG.logColour) {
        cprint.green(in_message);
    } else {
        process.stdout.write(`${in_message}\n`);
    }
    return;
}

// ******************************

function _warning(in_message) {
    if (CONFIG.logLevel < c_LOG_LEVEL_WARNING) {
        return;
    }
    if (CONFIG.logColour) {
        cprint.yellow(in_message);
    } else {
        process.stdout.write(`${in_message}\n`);
    }
    return;
}

// ******************************

function _error(in_message) {
    if (CONFIG.logLevel < c_LOG_LEVEL_ERROR) {
        return;
    }
    if (CONFIG.logColour) {
        cprint.red(in_message);
    } else {
        process.stdout.write(`${in_message}\n`);
    }
    return;
}

// ******************************
