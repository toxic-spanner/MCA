exports.name = "log";
exports.call = function(text) {
    console.log(this.castString(text));
};