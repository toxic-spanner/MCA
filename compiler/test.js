var term = require('terminal-kit').terminal;

if (process.argv.length < 3) {
    console.log("\n  Usage: node ./test.js <file>");
} else {
    var fs = require('fs');
    var util = require('util');

    var compiler = require('./');
    var types = require('./types');

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
                    if (typeof data.node[key] !== "string" && typeof data.node[key] !== "number" && typeof data.node[key] !== "boolean") continue;
                    term.magenta(" " + key);
                    term.brightBlue("(" + (typeof key) + ")");
                    term.magenta('="');
                    term.white(data.node[key]);
                    term.magenta('"');
                }
                term.cyan(">");

                //if (node.children.length) {
                    term("\n");
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
                //} else term.white(data.result);

                term.cyan("</" + data.node.type);
                //term.yellow(endLocation);
                term.cyan(">\n");

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

    var code = fs.readFileSync(process.argv[2], 'utf8');

    var consoleTime = (function() {
        if (console && console.time && console.timeEnd) {
            return {
                start: console.time,
                end: console.timeEnd
            };
        } else {
            return {
                start: function() { },
                end: function() { }
            };
        }
    }());
    var log = (function() {
        if (console && console.log) return console.log;
        return function() { };
    });

    var ast;
    try {
        consoleTime.start("parse");
        ast = compiler.parse(code);
        consoleTime.end("parse");
    } catch (ex) {
        term.brightRed("Parsing failed!\n");
        term.red(ex.stack);
        process.exit(1);
    }

    try {
        term.yellow("\nExecution output:\n");

        consoleTime.start("execute");
        var result = compiler.compile(ast);

        term("\n");
        consoleTime.end("execute");

        term.yellow("\nExecution tree:\n");
        var tree = result.context.executionTree;
        for (var y = 0; y < tree.length; y++) {
            showNode(tree[y]);
        }

        term.yellow("\nExecution result:\n");
        term(util.inspect(result.execution, {colors: true, depth: 5}) + "\n");

        term.yellow("\nCompiled commands:\n");
        for (var i = 0; i < result.compiled.length; i++) {
            term.yellow(" - ");
            term.green("Branch " + i + "\n");

            var branch = result.compiled[i];
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
    } catch (ex) {
        if (ex.loc) ex.message += " (" + ex.loc.start.line + ":" + ex.loc.start.column + ")";

        term.brightRed("Execution failed!\n");
        term.red(ex.stack);
    }

}