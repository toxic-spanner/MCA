exports.name = "math_log2";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.log2(num);
};