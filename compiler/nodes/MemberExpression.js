var errors = require('../errors');

exports.type = "MemberExpression";
exports.call = function(node, ctx, execute) {
    var map = ctx.castMap(execute(node.map));
    var property = ctx.cast(["string", "number"], execute(node.property));

    return map.getIndex(property);
};