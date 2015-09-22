exports.name = "math_sinh";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.sinh(num);
};