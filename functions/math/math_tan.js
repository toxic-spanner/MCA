exports.name = "math_tan";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.tan(num);
};