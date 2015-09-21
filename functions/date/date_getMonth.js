exports.name = "date_getMonth";
exports.call = function(date) {
    this.expectNumber(date);

    return (new Date(date)).getUTCMonth();
};