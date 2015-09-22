exports.name = "math_tanh";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.tanh(num);
};