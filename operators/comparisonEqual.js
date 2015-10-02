exports.type = '==';
exports.call = function(left, right, ctx, execute) {
    return ctx.strictEqual(execute(left), execute(right));
};