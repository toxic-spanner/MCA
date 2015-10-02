exports.type = '&&';
exports.call = function(left, right, ctx) {
    if (!ctx.castBoolean(left)) return false;
    return ctx.castBoolean(right);
};