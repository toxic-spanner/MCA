exports.type = "IfStatement";
exports.call = function(node, ctx, execute) {
    if (ctx.castBoolean(execute(node.test))) execute(node.consequent);
    else if (node.alternate) execute(node.alternate);
};