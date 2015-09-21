exports.name = "date_getYear";
exports.call = function(date) {
    this.expectNumber(date);

    return (new Date(date)).getUTCFullYear();
};