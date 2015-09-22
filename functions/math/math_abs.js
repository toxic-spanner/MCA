exports.name = "math_abs";
exports.call = function(num) {
    this.expectNumber(num);
    return Math.abs(num);
};