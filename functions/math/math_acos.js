exports.name = "math_acos";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.acos(num);
};