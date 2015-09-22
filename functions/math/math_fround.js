exports.name = "math_fround";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.fround(num);
};