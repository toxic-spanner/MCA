exports.name = "date_toISOString";
exports.call = function(date) {
    this.expectNumber(date);

    return (new Date(date)).toISOString();
};