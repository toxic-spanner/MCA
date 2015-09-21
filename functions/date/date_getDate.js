exports.name = "date_getDate";
exports.call = function(date) {
    this.expectNumber(date);

    return (new Date(date)).getUTCDate();
};