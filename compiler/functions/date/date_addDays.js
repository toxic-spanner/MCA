exports.name = "date_addDays";
exports.call = function(date, days) {
    this.expectNumber(days);

    var d = new Date(date);
    d.setUTCDate(d.getUTCDate() + days);
    return d.getTime();
};