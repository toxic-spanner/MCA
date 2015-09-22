exports.name = "math_ceil";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.ceil(num);
};