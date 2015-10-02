exports.type = '||';
exports.call = function(left, right, ctx) {
    if (ctx.castBoolean(left)) return true;
    return ctx.castBoolean(right);
};