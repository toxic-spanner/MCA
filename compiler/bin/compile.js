#!/usr/bin/env node

if (process.argv.length < 3) {
    console.error("\n  Usage: mca-compile <file> [--json]");
    process.exit(1);
}

var fs = require('fs');
var compiler = require('../');

var isJson = false;
for (var y = 2; y < process.argv.length; y++) {
    if (process.argv[y] === "--json") {
        process.argv.slice(y, 1);
        isJson = true;
        break;
    }
}

var file = process.argv[2];
var contents;

try {
    contents = fs.readFileSync(file, 'utf8');
} catch (ex) {
    console.error("Could not read file " + file);
    console.error(ex.stack);
    process.exit(1);
}

var result;

try {
    var oldLog = console.log;
    console.log = function() { };
    result = compiler.compile(contents);
    console.log = oldLog;
} catch (ex) {
    console.error("Could not parse file " + file);
    console.error(ex.stack);
    process.exit(1);
}

if (isJson) {
    console.log(JSON.stringify(result.compiled, null, 4));
} else {
    var term = require('terminal-kit').terminal;

    for (var i = 0; i < result.compiled.length; i++) {
        term.yellow(" - ");
        term.green("Branch " + i + "\n");

        var branch = result.compiled[i];
        if (!branch.length) term.brightBlack.italic("      No commands");
        else {
            for (var x = 0; x < branch.length; x++) {
                var item = branch[x];
                term.yellow("    - ");
                switch (item.type) {
                    case "command":
                        term.cyan("Command: ");
                        term.magenta("/" + item.command + " " + item.params + "\n");
                        break;
                    case "wait":
                        term.cyan("Wait ");
                        term.magenta(item.duration);
                        term.cyan(" ticks\n");
                        break;
                    case "branch":
                        term.cyan("Branch to ");
                        term.magenta(item.id);
                        term.cyan("\n");
                        break;
                    default:
                        term.cyan(item.type + ": ");
                        term(util.inspect(item, {colors: true}) + "\n");
                }
            }
        }
    }
}