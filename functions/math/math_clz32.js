exports.name = "math_clz32";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.clz32(num);
};