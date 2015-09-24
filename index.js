var grammar = require('./grammar');
var execute = require('./execute');

var Context = require('./Context');

exports.grammar = grammar;
exports.ast = grammar.parser.ast;

function parse(code, source) {
    return grammar.parse(code, source);
}
exports.parse = parse;

function compile(code, source) {
    var ast = code;
    if (!code || code.type !== "Program") ast = parse(code, source);

    var context = new Context();
    return {
        execution: execute(ast, context),
        compiled: context.blockBranches,
        context: context
    };
}
exports.compile = compile;