exports.type = '+';
exports.call = function(left, right, ctx, execute) {
    left = execute(left);
    right = execute(right);

    if (typeof left === "string") return left + ctx.castString(right);
    if (typeof right === "string") return ctx.castString(left) + right;

    return ctx.castNumber(left) + ctx.castNumber(right);
};