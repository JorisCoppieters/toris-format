'use strict';

// ******************************
//
//
// FILES LIBRARY
//
//
// ******************************

// ******************************
// Utilities:
// ******************************

var fs = require('fs');
var print = require('./print');
var path = require('path');
var Promise = require('bluebird');

// ******************************
// Exports:
// ******************************

module.exports = {
    read: readFile,
    write: writeFile,
    process: processFiles,
    list: listFiles,
};

// ******************************
// Functions:
// ******************************

function readFile (filePath, cbSuccess, cbError) {
    var file = path.resolve(process.cwd(), filePath);
    fs.readFile(file, 'utf8', function (error, data) {
        if (error) {
            print.red('File does not exist: ' + file);
            print.red('  ' + error);
            if (cbError) {
                cbError(error);
            }
        } else {
            if (cbSuccess) {
                cbSuccess(data);
            }
        }
    });
}

// ******************************

function writeFile (filePath, fileContents, cbSuccess, cbError) {
    var file = path.resolve(process.cwd(), filePath);
    fs.writeFile(file, fileContents, 'utf8', function (error, data) {
        if (error) {
            print.red('Could not write to file: ' + file);
            print.red('  ' + error);
            if (cbError) {
                cbError(error);
            }
        } else {
            if (cbSuccess) {
                cbSuccess(data);
            }
        }
    });
}

// ******************************

function listFiles (folder, filter) {
    return new Promise(function (resolveAll) {
        var files = fs.readdirSync(folder);
        var fileList = [];

        processFiles(files, function (file, resolve) {

            var fullPath = folder + '/' + file;

            fs.stat(fullPath, function (err, stats){
                if (!err && stats.isDirectory()) {
                    listFiles(fullPath, filter)
                    .then(function (subFileList) {
                        fileList = fileList.concat(subFileList);
                        resolve();
                    });
                } else {
                    if (!filter || file.match(new RegExp(filter))) {
                        fileList.push(fullPath);
                    }
                    resolve();
                }
            });

        }).then(function () {
            resolveAll(fileList);
        });
    });
}

// ******************************

function processFiles (files, process) {
    return new Promise(function (resolveAll) {
        var requests = files.map(function (file) {
            return new Promise(function (resolve, reject) {
                process(file, resolve, reject);
            });
        })
        Promise.all(requests).then(resolveAll);
    });
}

// ******************************
