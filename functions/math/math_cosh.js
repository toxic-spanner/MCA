exports.name = "math_cosh";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.cosh(num);
};