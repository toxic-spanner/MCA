exports.name = "math_sign";
exports.call = function(num) {
    this.expectNumber(num);

    if (num < 0) return -1;
    if (num > 0) return 1;
    return 0;
};