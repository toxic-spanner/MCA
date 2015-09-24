var path = require('path');
var fs = require('fs');
var errors = require('../errors');

var compiler = require('../index');

var includedList = [];

exports.type = "ImportExpression";
exports.call = function(node, ctx, execute) {
    var file = execute(node.file);
    ctx.expectString(file);

    var currentFile = node.loc.source;
    var source;

    if (currentFile) {
        if (includedList.indexOf(currentFile) === -1) includedList.push(currentFile);
        source = path.resolve(path.dirname(currentFile), file);
    } else source = path.resolve(process.cwd(), file);

    // dont include a file more than once
    if (includedList.indexOf(source) !== -1) return;
    includedList.push(source);

    // todo: allow asynchronous nodes?
    var sourceCode;
    try {
        sourceCode = fs.readFileSync(source, 'utf8');
    } catch (ex) {
        errors.fileNotFoundError("Cannot read included file " + source);
    }

    var ast;
    try {
        ast = compiler.parse(sourceCode, source);
    } catch (ex) {
        errors.syntaxError(ex.message, node.loc);
    }

    var result = execute(ast);
    if (result && result.length) return result[result.length - 1];
};