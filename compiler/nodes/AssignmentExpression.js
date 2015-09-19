var errors = require('../errors');

exports.type = "AssignmentExpression";
exports.call = function(node, ctx, execute) {
    // find the variable
    // todo: maybe this should be refactored with UnaryExpression

    // todo: handle setting MemberExpression

    var isMap = false;
    var variableName, variableIndexExpression, variableIndex;
    var map;

    var currentNode = node.left;
    while (!variableName) {
        if (currentNode.type === "Expression") currentNode = currentNode.expression;
        else if (currentNode.type === "Identifier") {
            variableName = currentNode.name;
        } else if (currentNode.type === "MemberExpression") {
            isMap = true;
            variableIndexExpression = currentNode.property;
            currentNode = currentNode.map;
        } else if (currentNode.type === "MapExpression" && isMap) {
            isMap = true;
            map = execute(currentNode.map);
        } else errors.referenceError("Invalid expression in assignment operation");
    }

    if (isMap) variableIndex = execute(variableIndexExpression);

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

    if (isMap) {
        if (variableName) map = ctx.getVariable(variableName);
        if (!map || !map.isMap) errors.typeError("Cannot assign index of non-map");

        map.setIndex(variableIndex, newValue);
    } else ctx.setVariable(variableName, newValue);
    return newValue;
};