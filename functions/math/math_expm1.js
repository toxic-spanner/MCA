exports.name = "math_expm1";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.expm1(num);
};