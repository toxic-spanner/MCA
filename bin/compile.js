#!/usr/bin/env node
var fs = require('fs');
var util = require('util');

var compiler = require('../');
var common = require('./common');

var showTree = false, showResult = false, showOutput = false, showCompiled = false, outputFile = false, isFriendly = false;

var isNextFile = false;
for (var i = 2; i < process.argv.length; i++) {
    var arg = process.argv[i];
    var wasMatch = true;

    if (isNextFile) {
        outputFile = arg;
        isNextFile = false;
    } else {
        switch (arg) {
            case '-h':
            case '--help':
                showHelp();
                break;
            case '-t':
            case '--tree':
                showTree = true;
                break;
            case '-r':
            case '--result':
                showResult = true;
                break;
            case '-l':
            case '--log':
                showOutput = true;
                break;
            case '-c':
            case '--compiled':
                showCompiled = true;
                break;
            case '-f':
            case '--friendly':
                isFriendly = true;
                break;
            case '-o':
            case '--output':
                isNextFile = true;
                break;
            default:
                if (arg[0] === "-") {
                    console.error("Unknown command-line option: " + arg);
                    showHelp();
                } else wasMatch = false;
        }
    }

    if (wasMatch) {
        process.argv.splice(i, 1);
        i--;
    }
}

function showHelp() {
    console.error("\n  Usage: mca-compile [ast] [-h] [--help] [-t] [--tree] [-r] [--result] [-c] [--compiled]");
    console.error(  "                     [-f] [--friendly] [-l] [--log] [-o <file>] [--output <file>]");
    console.error("\nCompiles an MCA AST into MCIL. Use stdin or [ast] to provide the AST JSON.");
    console.error("\n  Options:");
    console.error(  "      ast");
    console.error(  "          An input AST file, should be formatted as JSON.");
    console.error("\n      -h, --help");
    console.error(  "          Shows this help message.");
    console.error("\n      -t, --tree");
    console.error(  "          Displays the execution tree as JSON, or with --friendly as formatted text.");
    console.error("\n      -r, --result");
    console.error(  "          Displays the results from root-level expressions as JSON, or with --friendly as formatted text.");
    console.error("\n      -c, --compiled");
    console.error(  "          Displays the MCIL output as JSON, or with --friendly as formatted text.");
    console.error("\n      -f, --friendly");
    console.error(  "          Formats the output of --tree, --result, and --compiled to be human-readable.");
    console.error("\n      -l, --log");
    console.error(  "          Displays the output log from the program.");
    console.error("\n      -o <file>, --output <file>");
    console.error(  "          Writes the compiled MCIL to <file>.");
    process.exit(1);
}

var logFunc = console.log, arrayJoin = [].join;
var log = (function() {
    if (isFriendly) return function() { return logFunc };
    return function(tag) {
        if (tag) {
            return function () {
                var out = arrayJoin.call(arguments, "\n");
                logFunc("[" + tag + "] " + out.split("\n").join("\n[" + tag + "] "));
            }
        }
        return logFunc;
    }
}());

var astText = "";

// if path is provided, read from file, else read from stdin
if (process.argv.length > 2) {
    try {
        astText = fs.readFileSync(process.argv[2]);
    } catch (ex) {
        common.showError("Could not read AST file", ex);
    }
    ready();
} else {
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function() {
        var chunk = process.stdin.read();
        if (chunk !== null) astText += chunk;
    });
    process.stdin.on('end', ready);
}

function ready() {
    var ast;
    try {
        ast = JSON.parse(astText);
    } catch (ex) {
        common.showError("Could not parse AST text", ex);
    }

    if (isFriendly && showOutput) console.log(common.sectionHeader("\nExecution output:"));

    // temporarily replace console.log to conditionally display output
    console.log = showOutput ? log("output"): function() { };

    var result;
    try {
        var startTime = Date.now();
        result = compiler.compile(ast);
        var endTime = Date.now();
    } catch (ex) {
        console.log = logFunc;
        if (ex.loc) ex.message += " (" + ex.loc.source + ":" + ex.loc.start.line + ":" + ex.loc.start.column + ")";
        common.showError("Could not execute AST", ex);
    }

    console.log = logFunc;

    if (isFriendly) console.log("\nFinished after " + (endTime - startTime) + "ms");

    if (showTree) {
        if (isFriendly) {
            console.log(common.sectionHeader("\nExecution tree:"));
            var tree = result.context.executionTree;
            for (var i = 0; i < tree.length; i++) {
                showTreeNode(tree[i]);
            }
        } else {
            log()(JSON.stringify(result.context.executionTree));
        }
    }
    if (showResult) {
        if (isFriendly) {
            console.log(common.sectionHeader("\nExecution result:"));

            var executionResult = result.execution;
            if (executionResult && executionResult.toJSON) executionResult = executionResult.toJSON();
            console.log(util.inspect(executionResult, { colors: true }));
        } else {
            log()(JSON.stringify(result.execution));
        }
    }

    if (showCompiled || outputFile) {
        var stringCompiled = JSON.stringify(result.compiled);

        if (showCompiled) {
            if (isFriendly) {
                console.log(common.sectionHeader("\nCompiled MCIL:"));
                showCompiledResult(result.compiled);
            } else {
                log()(stringCompiled);
            }
        }

        if (outputFile) fs.writeFileSync(outputFile, stringCompiled, 'utf8');
    }
}

var isEven = true;

// friendly functions
function showTreeNode(node) {
    var data = node.data;

    switch (data.type) {
        case "warning":
            common.startSpecialTag(common.warningTag, null, null, null, "warn", {});
            common.ind();
            console.log(common.warningTag("No node called " + data.node.type + ": ") +
                util.inspect(data.node, { color: true }));
            common.endSpecialTag(common.warningTag, "warn");
            break;
        case "node":
            var startLocation = "", endLocation = "";
            if (data.node.loc) {
                startLocation = common.formatLocation(data.node.loc.start);
                endLocation = common.formatLocation(data.node.loc.end);
            }

            isEven = !isEven;
            if (isEven) common.put(common.evenLocation(startLocation));
            else common.put(common.oddLocation(startLocation));

            var attributes = {};
            for (var key in data.node) {
                if (data.node.hasOwnProperty(key) && key !== "type") attributes[key] = data.node[key];
            }

            common.startTag(data.node.type, attributes, -startLocation.length);

            for (var i = 0; i < node.children.length; i++) {
                showTreeNode(node.children[i]);
            }

            common.ind();

            var result = data.result;
            if (result && result.toJSON) result = result.toJSON();
            console.log(util.inspect(result, { depth: 1, colors: true }).replace(/\s+/g, " "));

            isEven = !isEven;
            if (isEven) common.put(common.evenLocation(endLocation));
            else common.put(common.oddLocation(endLocation));

            common.endTag(data.node.type, -endLocation.length);

            break;
        case "scope":
            common.startSpecialTag(common.specialTag, common.specialAttribute, false, common.attributeValue, "scope", {
                id: data.id
            });
            for (var x = 0; x < node.children.length; x++) {
                showTreeNode(node.children[x]);
            }
            common.endSpecialTag(common.specialTag, "scope");
            break;
    }
}

function showCompiledResult(compiled) {
    for (var i = 0; i < compiled.length; i++) {
        console.log(common.bullet(" - ") + common.branchName("Branch " + i));

        var branch = compiled[i];
        if (!branch.length) console.log(common.noCommands("      No commands"));
        else {
            for (var x = 0; x < branch.length; x++) {
                var item = branch[x];
                common.put(common.bullet("    - "));
                switch (item.type) {
                    case "command":
                        console.log(common.command("Command: ") + common.commandContent("/" + item.command + " " +
                                item.params));
                        break;
                    case "wait":
                        console.log(common.command("Wait ") + common.commandContent(item.duration) +
                            common.command(" ticks"));
                        break;
                    case "branch":
                        console.log(common.command("Branch to ") + common.commandContent(item.id));
                        break;
                    default:
                        console.log(common.command(item.type + ": ") + util.inspect(item, { colors: true }));
                }
            }
        }
    }
}