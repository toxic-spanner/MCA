exports.name = "math_asinh";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.asinh(num);
};