exports.type = "StringLiteral";
exports.call = function(node, ctx, execute) {
    return node.value;
};