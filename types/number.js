exports.type = "number";
exports.matches = function(num) {
    return typeof num === "number";
};
exports.equal = function(num1, num2) {
    return num1 === num2;
};
exports.toJSON = function(num) {
    return num;
};
exports.operate = {
    // binary operators
    '^': function(left, right, ctx) {
        right = ctx.castNumber(right);
        return left ^ right;
    },
    '&': function(left, right, ctx) {
        right = ctx.castNumber(right);
        return left & right;
    },
    '|': function(left, right, ctx) {
        right = ctx.castNumber(right);
        return left | right;
    },

    // math operators
    '+': function(left, right, ctx) {
        right = ctx.castNumber(right);
        return left + right;
    },
    '-': function(left, right, ctx) {

    }
};
exports.cast = {
    string: function(num) {
        return num.toString();
    },
    boolean: function(num) {
        return num !== 0;
    }
};