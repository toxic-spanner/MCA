exports.name = "math_max";
exports.call = function(x, y) {
    this.expectNumber(x);
    this.expectNumber(y);

    return Math.max(x, y);
};