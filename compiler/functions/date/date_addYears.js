exports.name = "date_addYears";
exports.call = function(date, years) {
    this.expectNumber(years);

    var d = new Date(date);
    d.setUTCFullYear(d.getUTCFullYear() + years);
    return d.getTime();
};