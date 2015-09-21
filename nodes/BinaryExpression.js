exports.type = "BinaryExpression";
exports.call = function(node, ctx, execute) {
    var left = ctx.castNumber(execute(node.left));
    var right = ctx.castNumber(execute(node.right));

    switch (node.operator) {
        case '^': return left ^ right;
        case '&': return left & right;
        case '|': return left | right;
    }
};