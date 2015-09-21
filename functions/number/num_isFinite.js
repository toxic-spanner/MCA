exports.name = "num_isFinite";
exports.call = function(num) {
    this.expectNumber(num);

    return Number.isFinite(num);
};