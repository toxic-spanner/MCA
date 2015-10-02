exports.type = 'unary +';
exports.call = function(left, right, ctx, execute) {
    return ctx.castNumber(execute(left));
};