exports.type = '!=';
exports.call = function(left, right, ctx, execute) {
    return ctx.notStrictEqual(execute(left), execute(right));
};