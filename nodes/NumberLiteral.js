exports.type = "NumberLiteral";
exports.call = function(node, ctx, execute) {
    return node.value;
};