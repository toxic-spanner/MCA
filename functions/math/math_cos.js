exports.name = "math_cos";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.cos(num);
};