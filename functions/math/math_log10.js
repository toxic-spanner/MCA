exports.name = "math_log10";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.log10(num);
};