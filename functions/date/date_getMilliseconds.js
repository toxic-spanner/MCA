exports.name = "date_getMilliseconds";
exports.call = function(date) {
    this.expectNumber(date);

    return (new Date(date)).getUTCMilliseconds();
};