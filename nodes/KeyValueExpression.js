exports.type = "KeyValueExpression";
exports.call = function(node, ctx, execute) {
    var key = node.key ? execute(node.key) : null;
    return {
        key: key,
        value: execute(node.value)
    };
};