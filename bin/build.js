#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var which = require('which');
var tmp = require('tmp');

var child_process = require('child_process');

var compiler = require('../');
var common = require('./common');

var code = false, output = false, width = 100, height = 100, depth = 100;

var isNextCode = false, isNextOutput = false, isNextWidth = false, isNextHeight = false, isNextDepth = false;
for (var i = 2; i < process.argv.length; i++) {
    var arg = process.argv[i];
    var wasMatch = true;

    if (isNextCode) {
        code = arg;
        isNextCode = false;
    } else if (isNextOutput) {
        output = arg;
        isNextOutput = false;
    } else if (isNextWidth) {
        width = parseInt(arg);
        if (isNaN(width)) {
            console.error("Invalid value for --width: " + arg);
            showHelp();
        }
    } else if (isNextHeight) {
        height = parseInt(arg);
        if (isNaN(height)) {
            console.error("Invalid value for --height: " + arg);
            showHelp();
        }
    } else if (isNextDepth) {
        depth = parseInt(arg);
        if (isNaN(depth)) {
            console.error("Invalid value for --depth: " + arg);
            showHelp();
        }
    } else {
        switch (arg) {
            case '--help':
                showHelp();
                break;
            case '-w':
            case '--width':
                isNextWidth = true;
                break;
            case '-h':
            case '--height':
                isNextHeight = true;
                break;
            case '-d':
            case '--depth':
                isNextDepth = true;
                break;
            case '-c':
            case '--code':
                isNextCode = true;
                break;
            case '-o':
            case '--output':
                isNextOutput = true;
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
    console.error("\n  Usage: mca-build [file] <builder> [--help] [-w <width> [--width <width>] [-h <height>]");
    console.error(  "                   [--height <height>] [-c <input>] [--code <input>] [-o <file>][--output <file>]");
    console.error("\nCompiles an MCA file and passes it to the provided MCIL builder. Use stdin, [file], or --code to");
    console.error(  "provide the MCA code. Outputs the built file to --output or stdout.");
    console.error("\n  Options:");
    console.error(  "      file");
    console.error(  "          An input MCA file.");
    console.error("\n      builder");
    console.error(  "          The MCIL builder name. Should be a global or local NPM package that exports a");
    console.error(  "          `.export(code, dimensions)` function, or a command that accepts arguments in the format");
    console.error(  "          `builder \"<output>\" --width <width> --height <height> --depth <depth>` and takes input via");
    console.error(  "           stdin.");
    console.error("\n      --help");
    console.error(  "          Shows this help message.");
    console.error("\n      -w <width>, --width <width>");
    console.error(  "          The maximum width (X-axis), default is 100.");
    console.error("\n      -h <height>, --height <height>");
    console.error(  "          The maximum height (Y-axis), default is 100.");
    console.error("\n      -d <depth>, --depth <depth>");
    console.error(  "          The maximum depth (Z-axis), default is 100.");
    console.error("\n      -c <input>, --code <input>");
    console.error(  "          Parses the provided code instead of the file or stdin.");
    console.error("\n      -o <file>, --output <file>");
    console.error(  "          Writes the built file to <file> instead of stdout.");
    process.exit(1);
}

var parseCode = "", builder = "", source = null;

var hasFile = process.argv.length > 3;
if (hasFile) builder = process.argv[3];
else builder = process.argv[2];

if (!builder) {
    console.error("Builder is required.");
    showHelp();
}

if (code) {
    parseCode = code;
    ready();
} else if (hasFile) {
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
    process.stdin.on('end', ready);
}

function findGlobalPackage() {
    var npmBin, modulePath, pckg;

    try {
        npmBin = process.env.GLOBAL_NPM_BIN || fs.realpathSync(which.sync('npm'));
    } catch (ex) {
        return false;
    }

    modulePath = process.env.GLOBAL_NPM_PATH;

    if (!modulePath) {
        var global;
        if (process.platform === "win32") {
            global = path.join(npmBin, '../node_modules/' + builder);
            try {
                return require(global);
            } catch (ex) {
                var appdata = path.join(process.env.APPDATA, "npm/node_modules/" + builder);
                try {
                    return require(appdata);
                } catch (ex) {
                    return false;
                }
            }
        } else {
            global = path.join(npmBin, '../../lib/node_modules/' + builder);
            try {
                return require(global);
            } catch (ex) {
                return false;
            }
        }
    }

    try {
        pckg = require(modulePath);
    } catch (ex) {
        return false;
    }

    return pckg;
}

function findPackage() {
    var global = findGlobalPackage();

    if (global && global.export && typeof global.export === "function") return global;

    // try local package
    var local;
    try {
        local = require(builder);
    } catch (ex) {
        return false;
    }
    return local;
}

function ready() {
    var ast;
    try {
        ast = compiler.parse(parseCode, source);
    } catch (ex) {
        common.showError("Could not parse MCA text", ex);
    }

    var result;
    try {
        result = compiler.compile(ast, source);
    } catch (ex) {
        common.showError("Could not execute AST", ex);
    }

    // try loading as a package
    var pckg = findPackage();
    if (pckg && pckg.export && typeof pckg.export === "function") {
        var buffer = pckg.export(result, {
            width: width,
            height: height,
            depth: depth
        });

        if (output) {
            if (typeof buffer === "string") fs.writeFileSync(output, buffer, "utf8");
            else fs.writeFileSync(output, buffer);
        } else console.log(buffer.toString());
    } else {

        // try running as a command
        var command;

        // if an output file is provided, we can simply pass this to the command and be done with it
        if (output) {
            try {
                command = builder + ' "' + output + '" --width ' + width + ' --height ' + height + ' --depth ' + depth;

                child_process.execSync(command, {
                    input: JSON.stringify(result),
                    encoding: 'utf8'
                });
            } catch (ex) {
                common.showError("Could not execute command '" + command + "'", ex);
            }
        } else {
            // otherwise, create a temporary file, pass this to the command, and then read the file and display the
            // output of the file
            var tmpFile;

            try {
                tmpFile = tmp.fileSync();
            } catch (ex) {
                common.showError("Could not create temporary file", ex);
            }

            try {
                command = builder + ' "' + tmpFile.name + '" --width ' + width + ' --height ' + height + ' --depth ' + depth;

                child_process.execSync(command, {
                    input: JSON.stringify(result),
                    encoding: 'utf8'
                });
            } catch (ex) {
                common.showError("Could not execute command '" + command + "'", ex);
            }

            var outVal;
            try {
                outVal = fs.readFileSync(tmpFile.name, 'utf8');
            } catch (ex) {
                common.showError("Could not read temporary file", ex);
            }

            console.log(outVal);
        }
    }
}