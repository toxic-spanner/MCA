exports.type = "IfStatement";
exports.call = function(node, ctx, execute) {
    if (execute(node.test)) execute(node.consequent);
    else if (node.alternate) execute(node.alternate);
};