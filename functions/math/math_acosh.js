exports.name = "math_acosh";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.acosh(num);
};