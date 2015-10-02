var grammar = require('./grammar');
var executor = require('./executor');

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
        execution: executor.execute(ast, context).start(),
        compiled: context.blockBranches,
        context: context
    };
}
exports.compile = compile;