exports.name = "date_getDay";
exports.call = function(date) {
    this.expectNumber(date);

    return (new Date(date)).getUTCDay();
};