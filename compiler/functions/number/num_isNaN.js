exports.name = "num_isNaN";
exports.call = function(num) {
    this.expectNumber(num);

    return Number.isNaN(num);
};