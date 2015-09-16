exports.name = "num_isInteger";
exports.call = function(num) {
    this.expectNumber(num);

    return Number.isInteger(num);
};