exports.name = "date_setDate";
exports.call = function(date, dayValue) {
    this.expectNumber(dayValue);

    var d = new Date(date);
    d.setUTCDate(dayValue);
    return d.getTime();
};