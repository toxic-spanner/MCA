exports.name = "math_min";
exports.call = function(x, y) {
    this.expectNumber(x);
    this.expectNumber(y);

    return Math.min(x, y);
};