var functions = require('../functions');
var errors = require('../errors');

exports.type = "InternalCallExpression";
exports.call = function(node, ctx, execute) {
    if (!functions[node.name]) errors.callError("Unknown internal function " + node.name);

    var params = execute(node.params);
    return functions[node.name].call.apply(ctx, params);
};