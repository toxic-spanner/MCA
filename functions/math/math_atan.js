exports.name = "math_atan";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.atan(num);
};