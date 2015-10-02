exports.name = "command";
exports.call = function(name, params) {
    this.pushCommand(name, params);
};