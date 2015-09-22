exports.name = "math_exp";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.exp(num);
};