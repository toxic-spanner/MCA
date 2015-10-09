var errors = require('./errors');

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
        } else if (currentNode.type === "MapExpression" && isMap) variable = ctx.executor.execute(currentNode.map, ctx).start();
        else errors.referenceError("Invalid assignable expression");
    }

    var variableScopeName, scope;
    if (isMap) {
        variableIndex = ctx.executor.execute(variableIndexExpression, ctx).start();
        if (variableName) variable = ctx.getVariable(variableName);
        if (!variable || !variable.isMap) errors.typeError("Cannot use index of a non-map");
    } else {
        variableScopeName = ctx.findVariableScope(variableName);
        if (variableScopeName === false) {
            variableScopeName = 0;
            ctx.setVariable(variableName, null, 0);
        }
        scope = ctx.scopes[variableScopeName];
    }

    return {
        isAssignable: true,
        getValue: function() {
            if (isMap) return variable.getIndex(variableIndex);
            return ctx.getVariableIn(variableName, scope);
        },
        setValue: function(newValue) {
            if (isMap) variable.setIndex(variableIndex, newValue);
            else ctx.setVariableIn(variableName, newValue, scope);
            return newValue;
        }
    };
};