exports.name = "math_atanh";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.atanh(num);
};