var errors = require('../errors');
var getAssignable = require('../getAssignable');

exports.type = "UnaryExpression";
exports.call = function(node, ctx, execute) {
    if (node.prefix === '++' || node.prefix === '--' || node.postfix === '++' || node.postfix === '--') {
        var assignable = getAssignable(node.center);
        var castValue = ctx.castNumber(assignable.getValue());

        if (node.prefix) {
            switch (node.prefix) {
                case '++':
                    result = castValue + 1;
                    assignable.setValue(result);
                    return result;
                case '--':
                    result = castValue - 1;
                    assignable.setValue(result);
                    return result;
            }
        }
        if (node.postfix) {
            switch (node.postfix) {
                case '++':
                    assignable.setValue(castValue + 1);
                    return castValue;
                case '--':
                    assignable.setValue(castValue - 1);
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