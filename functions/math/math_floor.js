exports.name = "math_floor";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.floor(num);
};