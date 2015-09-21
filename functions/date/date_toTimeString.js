exports.name = "date_toTimeString";
exports.call = function(date) {
    this.expectNumber(date);

    return (new Date(date)).toTimeString();
};