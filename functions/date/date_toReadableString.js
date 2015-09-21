exports.name = "date_toReadableString";
exports.call = function(date) {
    this.expectNumber(date);

    return (new Date(date)).toDateString();
};