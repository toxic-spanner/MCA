#!/usr/bin/env node

if (process.argv.length < 3) {
    console.error("\n  Usage: mca-tree <file> [--json]");
    process.exit(1);
}

var fs = require('fs');
var compiler = require('../');

var isJson = false;
for (var i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--json") {
        process.argv.slice(i, 1);
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
    console.log(JSON.stringify(result.context.executionTree, null, 4));
} else {
    var term = require('terminal-kit').terminal;
    var util = require('util');

    var indentAmount = 4;
    var indent = 8;

    function pad(number, limit, character, right) {
        number += "";
        if (number.length < limit) {
            if (right) return character + pad(number, limit - 1, right);
            return pad(number, limit - 1, right) + character;
        }
        return number;
    }

    var isEven = false;
    function showNode(node) {
        var data = node.data;
        var originalIndent = indent;

        switch (data.type) {
            case "warning":
                term.right(indent);
                term.brightRed("<warn>\n");
                term.right(indent + 4);
                term.brightRed("No node called " + data.node.type + ": ");
                term(util.inspect(data.node, {color: true}) + "\n");
                term.right(indent);
                term.brightRed("</warn>\n");
                break;
            case "node":
                var startLocation = "", endLocation = "";

                if (data.node.loc) {
                    startLocation = pad(pad(data.node.loc.start.line, 2, "0", true), 3, " ", true) + ":" + pad(pad(data.node.loc.start.column, 2, "0", true), 3, " ");
                    endLocation = pad(pad(data.node.loc.end.line, 2, "0", true), 3, " ", true) + ":" + pad(pad(data.node.loc.end.column, 2, "0", true), 3, " ");
                }

                isEven = !isEven;
                if (isEven) term.brightBlack(startLocation);
                else term.white(startLocation);

                term.right(indent - startLocation.length);
                term.cyan("<" + data.node.type);

                for (var key in data.node) {
                    if (!data.node.hasOwnProperty(key)) continue;

                    if (key === "type") continue;

                    var value = data.node[key];
                    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") continue;
                    term.magenta(" " + key);
                    term.brightBlue("(" + (typeof value) + ")");
                    term.magenta('="');
                    term.white(value);
                    term.magenta('"');
                }
                term.cyan(">\n");

                indent += indentAmount;
                for (var i = 0; i < node.children.length; i++) {
                    showNode(node.children[i]);
                }
                term.right(indent);
                term.white(util.inspect((data.result && data.result.toJSON) ? data.result.toJSON() : data.result, {depth: 1, colors: true}).replace(/\s+/g, " ") + "\n");

                indent = originalIndent;

                isEven = !isEven;
                if (isEven) term.brightBlack(endLocation);
                else term.white(endLocation);
                term.right(indent - endLocation.length);

                term.cyan("</" + data.node.type + ">\n");

                break;
            case "scope":
                term.right(indent);
                term.brightCyan("<scope ");
                term.brightMagenta('id="');
                term.white(data.id);
                term.brightMagenta('"');
                term.brightCyan(">\n");
                indent += indentAmount;
                for (var x = 0; x < node.children.length; x++) {
                    showNode(node.children[x]);
                }
                indent = originalIndent;
                term.right(indent);
                term.brightCyan("</scope>\n");
        }
    }

    var tree = result.context.executionTree;
    for (var y = 0; y < tree.length; y++) {
        showNode(tree[y]);
    }
}