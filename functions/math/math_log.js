exports.name = "math_log";
exports.call = function(num) {
    this.expectNumber(num);

    return Math.log(num);
};