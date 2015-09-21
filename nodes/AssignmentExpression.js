var errors = require('../errors');
var getAssignable = require('../getAssignable');

exports.type = "AssignmentExpression";
exports.call = function(node, ctx, execute) {
    // find the variable
    var assignable = getAssignable(node.left, ctx);

    var rightValue = execute(node.right);
    var leftValue = node.operator === '=' ? null : assignable.getValue();

    var newValue;
    if (node.operator === "+=" && (typeof leftValue === "string" || typeof rightValue === "string")) {
        newValue = ctx.castString(leftValue) + ctx.castString(rightValue);
    } else {
        switch (node.operator) {
            case '=':
                newValue = rightValue;
                break;
            case '*=':
                newValue = ctx.castNumber(leftValue) * ctx.castNumber(rightValue);
                break;
            case '/=':
                newValue = ctx.castNumber(leftValue) / ctx.castNumber(rightValue);
                break;
            case '%=':
                newValue = ctx.castNumber(leftValue) % ctx.castNumber(rightValue);
                break;
            case '+=':
                newValue = ctx.castNumber(leftValue) + ctx.castNumber(rightValue);
                break;
            case '-=':
                newValue = ctx.castNumber(leftValue) - ctx.castNumber(rightValue);
                break;
            case '>>=':
                newValue = ctx.castNumber(leftValue) >> ctx.castNumber(rightValue);
                break;
            case '>>>=':
                newValue = ctx.castNumber(leftValue) >>> ctx.castNumber(rightValue);
                break;
            case '<<=':
                newValue = ctx.castNumber(leftValue) << ctx.castNumber(rightValue);
                break;
            case '&=':
                newValue = ctx.castNumber(leftValue) & ctx.castNumber(rightValue);
                break;
            case '|=':
                newValue = ctx.castNumber(leftValue) | ctx.castNumber(rightValue);
                break;
            case '^=':
                newValue = ctx.castNumber(leftValue) ^ ctx.castNumber(rightValue);
                break;
        }
    }

    assignable.setValue(newValue);
    return newValue;
};