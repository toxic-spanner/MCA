exports.name = "date_setMonth";
exports.call = function(date, monthValue) {
    this.expectNumber(monthValue);

    var d = new Date(date);
    d.setUTCMonth(monthValue);
    return d.getTime();
};