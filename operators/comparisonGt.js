exports.type = '>';
exports.call = function(left, right, ctx, execute) {
    return ctx.castNumber(execute(left)) > ctx.castNumber(execute(right));
};