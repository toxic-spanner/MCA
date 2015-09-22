exports.name = "math_round";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.round(num);
};