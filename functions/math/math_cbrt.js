exports.name = "math_cbrt";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.cbrt(num);
};