#!/usr/bin/env node

if (process.argv.length < 3) {
    console.error("\n  Usage: mca-ast <file>");
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

var ast;

try {
    ast = compiler.parse(contents);
} catch (ex) {
    console.error("Could not parse file " + file);
    console.error(ex.stack);
    process.exit(1);
}

if (isJson) {
    console.log(JSON.stringify(ast, null, 4));
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
        var originalIndent = indent;

        var startLocation = pad(pad(node.loc.start.line, 2, "0", true), 3, " ", true) + ":" + pad(pad(node.loc.start.column, 2, "0", true), 3, " ");
        var endLocation = pad(pad(node.loc.end.line, 2, "0", true), 3, " ", true) + ":" + pad(pad(node.loc.end.column, 2, "0", true), 3, " ");

        isEven = !isEven;
        if (isEven) term.brightBlack(startLocation);
        else term.white(startLocation);

        term.right(indent - startLocation.length);
        term.cyan("<" + node.type);

        var childNodes = {};
        for (var key in node) {
            if (!node.hasOwnProperty(key)) continue;
            if (key === "type") continue;

            var value = node[key];
            var isValueArray = Array.isArray(value);
            if ((value && value.type) || (isValueArray && (!value.length || value[0].type))) {
                childNodes[key] = isValueArray ? value : [value];
                continue;
            }
            if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") continue;

            term.magenta(" " + key);
            term.brightBlue("(" + (typeof value) + ")");
            term.magenta('="');
            term.white(value);
            term.magenta('"');
        }
        term.cyan(">\n");

        indent += indentAmount;

        for (var nodeName in childNodes) {
            if (!childNodes.hasOwnProperty(nodeName)) continue;
            term.right(indent);
            term.brightCyan("<" + nodeName + ">\n");

            indent += indentAmount;
            var nodeItems = childNodes[nodeName];
            for (var i = 0; i < nodeItems.length; i++) {
                showNode(nodeItems[i]);
            }
            indent = originalIndent + indentAmount;
            term.right(indent);
            term.brightCyan("</" + nodeName + ">\n");
        }

        indent = originalIndent;

        isEven = !isEven;
        if (isEven) term.brightBlack(endLocation);
        else term.white(endLocation);
        term.right(indent - endLocation.length);

        term.cyan("</" + node.type + ">\n");
    }

    // todo: show macros

    term.right(indent);
    term.cyan("<Program>\n");
    indent += indentAmount;
    term.right(indent);
    term.brightCyan("<body>\n");
    indent += indentAmount;

    for (var x = 0; x < ast.body.length; x++) {
        showNode(ast.body[x]);
    }

    indent -= indentAmount;
    term.right(indent);
    term.brightCyan("</body>\n");
    term.right(indent);
    term.brightCyan("<macros>\n");
    indent += indentAmount;

    for (var macroName in ast.macros) {
        if (!ast.macros.hasOwnProperty(macroName)) continue;
        var macro = ast.macros[macroName];

        term.right(indent);
        term.cyan("<" + macroName + ">\n");
        indent += indentAmount;

        for (var arity in macro) {
            if (!macro.hasOwnProperty(arity)) continue;
            showNode(macro[arity]);
        }

        indent -= indentAmount;
        term.right(indent);
        term.cyan("</" + macroName + ">\n");
    }

    indent -= indentAmount;
    term.right(indent);
    term.brightCyan("</macros>\n");

    indent -= indentAmount;
    term.right(indent);
    term.cyan("</Program>\n");
}