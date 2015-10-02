var errors = require('../errors');
var getAssignable = require('../getAssignable');

exports.type = "AssignmentExpression";
exports.call = function(node, ctx, execute) {
    if (node.operator.length === 1) return ctx.operate('=', node.left, node.right);

    var assignable = getAssignable(node.left, ctx);
    var subOperator = node.operator.substr(0, 1);

    var operated = ctx.operate(subOperator, node.left, node.right);
    assignable.setValue(operated);
    return operated;
};