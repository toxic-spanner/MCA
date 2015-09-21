exports.name = "date_local";
exports.call = function(date) {
    var dummyDate = new Date();
    date = date == null ? dummyDate.getTime() : date;
    this.expectNumber(date);

    var offset = dummyDate.getTimezoneOffset();
    return date + offset * 60000;
};