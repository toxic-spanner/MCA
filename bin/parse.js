#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var compiler = require('../');
var common = require('./common');

var showAst = false, code = false, outputFile = false, isFriendly = false;

var isNextFile = false, isNextCode = false;
for (var i = 2; i < process.argv.length; i++) {
    var arg = process.argv[i];
    var wasMatch = true;

    if (isNextFile) {
        outputFile = arg;
        isNextFile = false;
    } else if (isNextCode) {
        code = arg;
        isNextCode = false;
    } else {
        switch (arg) {
            case '-h':
            case '--help':
                showHelp();
                break;
            case '-s':
            case '--show':
                showAst = true;
                break;
            case '-f':
            case '--friendly':
                isFriendly = true;
                break;
            case '-c':
            case '--code':
                isNextCode = true;
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
    console.error("\n  Usage: mca-parse [file] [-h] [--help] [-s] [--show] [-f] [--friendly]");
    console.error(  "                   [-c <input>] [--code <input>] [-o <file>] [--output <file>]");
    console.error("\nParses MCA code and converts it into a JSON-formatted AST. Use stdin, [file], or --code to provide");
    console.error(  "the MCA code.");
    console.error("\n  Options:");
    console.error(  "      file");
    console.error(  "          An input MCA file.");
    console.error("\n      -h, --help");
    console.error(  "          Shows this help message.");
    console.error("\n      -s, --show");
    console.error(  "          Displays the AST as JSON, or with --friendly as formatted text.");
    console.error("\n      -f, --friendly");
    console.error(  "          Formats the output of --show to be human-readable.");
    console.error("\n      -c <input>, --code <input>");
    console.error(  "          Parses the provided code instead of the file or stdin.");
    console.error("\n      -o <file>, --output <file>");
    console.error(  "          Writes the AST to <file>.");
    process.exit(1);
}

var parseCode = "", source = null;

if (code) {
    parseCode = code;
    ready();
} else if (process.argv.length > 2) {
    try {
        parseCode = fs.readFileSync(process.argv[2], 'utf8');
        source = path.resolve(process.cwd(), process.argv[2]);
        ready();
    } catch (ex) {
        common.showError("Could not read MCA file", ex);
    }
} else {
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function() {
        var chunk = process.stdin.read();
        if (chunk !== null) parseCode += chunk;
    });
    process.stdin.on('error', function() {
        process.exit(1);
    });
    process.stdin.on('end', ready);
}

function ready() {
    var ast;
    try {
        var startTime = Date.now();
        ast = compiler.parse(parseCode, source);
        var endTime = Date.now();
    } catch (ex) {
        common.showError("Could not parse MCA text", ex);
    }

    if (showAst || outputFile) {
        var stringCompiled = JSON.stringify(ast);

        if (showAst) {
            if (isFriendly) {
                common.startTag("Program", {});
                common.startSpecialTag(common.specialTag, null, null, null, "body", {});

                for (var i = 0; i < ast.body.length; i++) {
                    showNode(ast.body[i]);
                }

                common.endSpecialTag(common.specialTag, "body");
                common.startSpecialTag(common.specialTag, null, null, null, "macros", {});

                for (var macroName in ast.macros) {
                    if (!ast.macros.hasOwnProperty(macroName)) continue;
                    var macro = ast.macros[macroName];
                    common.startTag(macroName, {});

                    for (var arity in macro) {
                        if (!macro.hasOwnProperty(arity)) continue;
                        showNode(macro[arity]);
                    }

                    common.endTag(macroName);
                }

                common.endSpecialTag(common.specialTag, "macros");
                common.endTag("Program");
            } else console.log(stringCompiled);
        }

        if (outputFile) fs.writeFileSync(outputFile, stringCompiled, 'utf8');
    }

    if (isFriendly) console.log("\nFinished after " + (endTime - startTime) + "ms");
}

var isEven = true;
function showNode(node) {
    var startLocation = "", endLocation = "";
    if (node.loc) {
        startLocation = common.formatLocation(node.loc.start);
        endLocation = common.formatLocation(node.loc.end);
    }

    isEven = !isEven;
    if (isEven) common.put(common.evenLocation(startLocation));
    else common.put(common.oddLocation(startLocation));

    var childNodes = {};
    var attributes = {};
    for (var key in node) {
        if (!node.hasOwnProperty(key) || key === "type") continue;

        var value = node[key];
        var isValueArray = Array.isArray(value);
        if ((value && value.type) || (isValueArray && (!value.length || value[0].type))) {
            childNodes[key] = isValueArray ? value : [value];
            continue;
        }

        attributes[key] = node[key];
    }

    common.startTag(node.type, attributes, -startLocation.length);

    for (var nodeName in childNodes) {
        if (!childNodes.hasOwnProperty(nodeName)) continue;

        common.startSpecialTag(common.specialTag, null, null, null, nodeName, {});
        var nodeItems = childNodes[nodeName];
        for (var i = 0; i < nodeItems.length; i++) {
            showNode(nodeItems[i]);
        }
        common.endSpecialTag(common.specialTag, nodeName);
    }

    isEven = !isEven;
    if (isEven) common.put(common.evenLocation(endLocation));
    else common.put(common.oddLocation(endLocation));

    common.endTag(node.type, -endLocation.length);
}