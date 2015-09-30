var path = require('path');
var fs = require('fs');
var errors = require('../errors');

var compiler = require('../index');

var includedList = {};
var extensions = ['', '.mca', '.mcassembly'];

function getModule(file, noDir) {
    // try loading as a file
    for (var i = 0; i < extensions.length; i++) {
        var p = file + extensions[i];
        try {
            return {
                content: fs.readFileSync(p, 'utf8'),
                source: p
            };
        } catch (ex) { }
    }

    if (!noDir) {
        // try loading a package.json and then a sub-file
        var packageJsonPath = path.join(file, "package.json");
        try {
            var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            var mainProperty = path.resolve(path.dirname(packageJsonPath), packageJson.main);

            var sourceCode = getModule(mainProperty);
            if (sourceCode) return sourceCode;
        } catch (ex) { }

        // try loading an index file
        return getModule(path.join(file, "index"), true);
    }

    return false;
}

function includeFile(node, execute, path, source) {
    if (includedList[path]) return includedList[path].result;

    var ast;
    try {
        ast = compiler.parse(source, path);
    } catch (ex) {
        errors.syntaxError(ex.message, node.loc);
    }

    var result = execute(ast);

    var expressionResult;
    if (result != null) {
        if (Array.isArray(result)) expressionResult = result[result.length];
        else expressionResult = result;
    }

    includedList = {
        included: true,
        result: expressionResult
    };
    return expressionResult;
}

exports.type = "ImportExpression";
exports.call = function(node, ctx, execute) {
    var file = execute(node.file);
    ctx.expectString(file);

    // module loading
    var baseRelative = node.loc.source ? path.dirname(node.loc.source) : process.cwd();
    var sourceCode;

    if (file.indexOf('../') === 0 || file.indexOf('./') === 0 || file.indexOf('/') === 0) {
        sourceCode = getModule(path.resolve(baseRelative, file));
    } else {
        // try to find a node_modules folder
        var currentPath = baseRelative;

        while (true) {
            sourceCode = getModule(path.join(currentPath, "mca_modules", file));
            if (sourceCode) break;

            var parsedPath = path.parse(currentPath);
            if (parsedPath.root === parsedPath.dir) {
                // reached the lowest level, cant go any further
                break;
            }

            // haven't found anything, go back a directory and try node_modules
            currentPath = path.join(currentPath, '../');
        }
    }

    if (!sourceCode) errors.moduleNotFoundError("Cannot find module at '" + file + "'");

    return includeFile(node, execute, sourceCode.source, sourceCode.content);
};