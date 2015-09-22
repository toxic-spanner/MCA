exports.name = "math_atan2";
exports.call = function(y, x) {
    this.expectNumber(y);
    this.expectNumber(x);

    return Math.atan2(y, x);
};