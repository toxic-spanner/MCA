var errors = require('../errors');
var getAssignable = require('../getAssignable');

exports.type = "UnaryExpression";
exports.call = function(node, ctx, execute) {
    return ctx.operate('unary ' + (node.prefix || node.postfix), node.center, node.prefix ? true : false);
};