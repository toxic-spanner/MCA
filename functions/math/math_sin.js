exports.name = "math_sin";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.sin(num);
};