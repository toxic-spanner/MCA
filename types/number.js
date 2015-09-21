exports.type = "number";
exports.matches = function(num) {
    return typeof num === "number";
};
exports.equal = function(num1, num2) {
    return num1 === num2;
};
exports.toJSON = function(num) {
    return num;
};
exports.cast = {
    string: function(num) {
        return num.toString();
    },
    boolean: function(num) {
        return num !== 0;
    }
};