exports.name = "date_addMonths";
exports.call = function(date, months) {
    this.expectNumber(months);

    var d = new Date(date);
    d.setUTCMonth(d.getUTCMonth() + months);
    return d.getTime();
};