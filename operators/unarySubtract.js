var getAssignable = require('../getAssignable');

exports.type = 'unary --';
exports.call = function(left, isPrefix, ctx, execute) {
    var assignable = getAssignable(left, ctx);
    var original = ctx.castNumber(assignable.getValue());
    var result = original - 1;
    assignable.setValue(result);

    if (isPrefix) return result;
    return original;
};