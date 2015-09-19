var errors = require('./errors');
var execute = require('./execute');

module.exports = function getAssignable(expression, ctx) {
    var currentNode = expression;

    var isMap = false;
    var variableName, variableIndexExpression, variableIndex;
    var variable;

    while (!variableName) {
        if (currentNode.type === "Expression") currentNode = currentNode.expression;
        else if (currentNode.type === "Identifier") variableName = currentNode.name;
        else if (currentNode.type === "MemberExpression") {
            isMap = true;
            variableIndexExpression = currentNode.property;
            currentNode = currentNode.map;
        } else if (currentNode.type === "MapExpression" && isMap) variable = execute(currentNode.map, ctx);
        else errors.referenceError("Invalid assignable expression");
    }

    if (isMap) {
        variableIndex = execute(variableIndexExpression, ctx);
        if (variableName) variable = ctx.getVariable(variableName);
        if (!variable || !variable.isMap) errors.typeError("Cannot use index of a non-map");
    }

    return {
        getValue: function() {
            if (isMap) return variable.getIndex(variableIndex);
            return ctx.getVariable(variableName);
        },
        setValue: function(newValue) {
            if (isMap) variable.setIndex(variableIndex, newValue);
            else ctx.setVariable(variableName, newValue);
        }
    };
};