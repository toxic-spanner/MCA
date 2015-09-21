exports.name = "date_setYear";
exports.call = function(date, yearValue) {
    this.expectNumber(yearValue);

    var d = new Date(date);
    d.setUTCFullYear(yearValue);
    return d.getTime();
};