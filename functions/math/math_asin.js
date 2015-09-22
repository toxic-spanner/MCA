exports.name = "math_asin";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.asin(num);
};