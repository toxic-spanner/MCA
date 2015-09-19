exports.type = "ComparisonExpression";
exports.call = function(node, ctx, execute) {
    var left = execute(node.left);
    var right = execute(node.right);

    switch (node.operator) {
        case '==': return ctx.strictEqual(left, right);
        case '!=': return ctx.notStrictEqual(left, right);
        case '>=': return ctx.castNumber(left) >= ctx.castNumber(right);
        case '<=': return ctx.castNumber(left) <= ctx.castNumber(right);
        case '>': return ctx.castNumber(left) > ctx.castNumber(right);
        case '<': return ctx.castNumber(left) < ctx.castNumber(right);
    }
};