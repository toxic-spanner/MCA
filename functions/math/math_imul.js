exports.name = "math_imul";
exports.call = function(x, y) {
    this.expectNumber(x);
    this.expectNumber(y);

    return Math.imul(x, y);
};