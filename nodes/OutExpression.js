var getAssignable = require('../getAssignable');

exports.type = "OutExpression";
exports.call = function(node, ctx, execute) {
    return getAssignable(node.expression, ctx);
};