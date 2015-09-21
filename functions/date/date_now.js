exports.name = "date_now";
exports.call = function() {
    if (Date.now) return Date.now();
    return (new Date()).getTime();
};