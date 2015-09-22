exports.name = "math_pow";
exports.call = function(x, y) {
    this.expectNumber(x);
    this.expectNumber(y);

    return Math.pow(x, y);
};