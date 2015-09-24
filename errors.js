exports.referenceError = function(message, position) {
    var ex = new Error(message);
    ex._mca = true;
    ex.name = "CompilerReferenceError";
    ex.loc = position;
    throw ex;
};

exports.valueError = function(message, position) {
    var ex = new Error( message);
    ex._mca = true;
    ex.name = "CompilerValueError";
    ex.loc = position;
    throw ex;
};

exports.recursiveError = function(message, position) {
    var ex = new Error(message);
    ex._mca = true;
    ex.name = "CompilerRecursiveError";
    ex.loc = position;
    throw ex;
};

exports.notAllowedError = function(message, position) {
    var ex = new Error(message);
    ex._mca = true;
    ex.name = "CompilerNotAllowedError";
    ex.loc = position;
    throw ex;
};

exports.callError = function(message, position) {
    var ex = new Error(message);
    ex._mca = true;
    ex.name = "CompilerCallError";
    ex.loc = position;
    throw ex;
};

exports.typeError = function(message, position) {
    var ex = new Error(message);
    ex._mca = true;
    ex.name = "CompilerTypeError";
    ex.loc = position;
    throw ex;
};

exports.fileNotFoundError = function(message, position) {
    var ex = new Error(message);
    ex._mca = true;
    ex.name = "FileNotFoundError";
    ex.loc = position;
    throw ex;
};

exports.syntaxError = function(message, position) {
    var ex = new Error(message);
    ex._mca = true;
    ex.name = "SyntaxError";
    ex.loc = position;
    throw ex;
};