var grammar = require('./grammar');

exports.grammar = grammar;
exports.ast = grammar.parser.ast;

function parse(code) {
    return grammar.parse(code);
}
exports.parse = parse;

function compile(code) {
    // todo
}
exports.compile = compile;