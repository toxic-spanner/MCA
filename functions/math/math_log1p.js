exports.name = "math_log1p";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.log1p(num);
};