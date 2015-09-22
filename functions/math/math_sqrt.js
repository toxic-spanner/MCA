exports.name = "math_sqrt";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.sqrt(num);
};