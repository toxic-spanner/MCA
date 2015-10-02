exports.type = "ShiftExpression";
exports.call = function(node, ctx, execute) {
    return ctx.operate(node.operator, node.left, node.right);
};