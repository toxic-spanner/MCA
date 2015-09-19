var errors = require('../errors');

exports.type = "AssignmentExpression";
exports.call = function(node, ctx, execute) {
    // find the variable
    // todo: maybe this should be refactored with UnaryExpression

    // todo: handle setting MemberExpression

    var variableName;
    var currentNode = node.left;
    while (!variableName) {
        if (currentNode.type === "Expression") currentNode = currentNode.expression;
        else if (currentNode.type === "Identifier") variableName = currentNode.name;
        else errors.referenceError("Invalid expression in assignment operation");
    }

    var rightValue = execute(node.right);
    var leftValue = node.operator === '=' ? null : ctx.getVariable(variableName);

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

    ctx.setVariable(variableName, newValue);
    return newValue;
};