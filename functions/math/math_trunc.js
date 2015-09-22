exports.name = "math_trunc";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.trunc(num);
};