#!/usr/bin/env node

if (process.argv.length < 3) {
    console.error("\n  Usage: mca-output <file>");
    process.exit(1);
}

var fs = require('fs');
var compiler = require('../');

var file = process.argv[2];
var contents;

try {
    contents = fs.readFileSync(file, 'utf8');
} catch (ex) {
    console.error("Could not read file " + file);
    console.error(ex.stack);
    process.exit(1);
}

try {
    compiler.compile(contents);
} catch (ex) {
    console.error("Could not parse file " + file);
    console.error(ex.stack);
    process.exit(1);
}