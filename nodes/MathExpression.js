exports.type = "MathExpression";
exports.call = function(node, ctx, execute) {
    var left = execute(node.left);
    var right = execute(node.right);

    if (node.operator === "+" && (typeof left === "string" || typeof right === "string")) {
        return ctx.castString(left) + ctx.castString(right);
    }

    left = ctx.castNumber(left);
    right = ctx.castNumber(right);

    switch(node.operator) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '%': return left % right;
    }
};