var errors = require('../errors');

exports.type = "UnaryExpression";
exports.call = function(node, ctx, execute) {
    // find the variable
    // todo: maybe this should be refactored with AssignmentExpression

    // todo: handle setting MemberExpression

    if (node.prefix === '++' || node.prefix === '--' || node.postfix === '++' || node.postfix === '--') {
        var variableName;
        var currentNode = node.center;
        while (!variableName) {
            if (node.type === "Expression") currentNode = node.expression;
            else if (node.type === "Identifier") variableName = node.name;
            else errors.referenceError("Invalid expression in unary operation");
        }

        castValue = ctx.castNumber(ctx.getVariable(variableName));

        if (node.prefix) {
            switch (node.prefix) {
                case '++':
                    result = castValue + 1;
                    ctx.setVariable(variableName, result);
                    return result;
                case '--':
                    result = castValue - 1;
                    ctx.setVariable(variableName, result);
                    return result;
            }
        }
        if (node.postfix) {
            switch (node.postfix) {
                case '++':
                    ctx.setVariable(variableName, castValue + 1);
                    return castValue;
                case '--':
                    ctx.setVariable(variableName, castValue - 1);
                    return castValue;
            }
        }
    }

    if (node.prefix) {
        var result = execute(node.center);

        switch (node.prefix) {
            case '+': return ctx.castNumber(result);
            case '-': return -ctx.castNumber(result);
            case '~': return ~ctx.castNumber(result);
            case '!': return !ctx.castBoolean(result);
        }
    }
};