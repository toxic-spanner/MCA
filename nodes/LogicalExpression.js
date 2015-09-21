exports.type = "LogicalExpression";
exports.call = function(node, ctx, execute) {
    var left = execute(node.left);
    var right = execute(node.right);

    switch (node.operator) {
        case "&&": return left && right;
        case "||": return left || right;
    }
};