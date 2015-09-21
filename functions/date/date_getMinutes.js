exports.name = "date_getMinutes";
exports.call = function(date) {
    this.expectNumber(date);

    return (new Date(date)).getUTCMinutes();
};