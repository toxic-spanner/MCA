exports.type = "ExpressionStatement";
exports.call = function(node, ctx, execute) {
    return execute(node.expression);
};