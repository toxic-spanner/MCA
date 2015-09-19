var EventEmitter = require('events').EventEmitter;
var errors = require('./errors');

var types = require('./types');

function Context() {
    //this.commandStructure = [];
    this.blockBranches = [[]];
    this.currentBranch = 0;

    this.executionTree = [];
    this.currentExecutionTree = { parent: null, children: this.executionTree };

    this.macros = {};

    this.scopes = [];
    this.pushScope();
}

Context.prototype.executionTreeStart = function(data) {
    var children = [], newItem = {
        data: data,
        children: children,
        parent: this.currentExecutionTree
    };

    this.currentExecutionTree.children.push(newItem);
    this.currentExecutionTree = newItem;
};
Context.prototype.executionTreeStop = function() {
    if (this.currentExecutionTree.parent == null) return;
    this.currentExecutionTree = this.currentExecutionTree.parent;
};

Context.prototype.pushToBranch = function(obj) {
    this.blockBranches[this.currentBranch].push(obj);
};
Context.prototype.pushCommand = function(name, params) {
    this.pushToBranch({
        type: "command",
        command: name,
        params: params
    });
};

Context.prototype.pushWait = function(duration) {
    this.pushToBranch({
        type: "wait",
        duration: duration
    });
};

Context.prototype.branchTo = function(id) {
    this.pushToBranch({
        type: "branch",
        id: id
    });
    this.currentBranch = id;
};

Context.prototype.fork = function() {
    return this.blockBranches.push([]) - 1;
};

Context.prototype.pushScope = function() {
    this.scopes.unshift({});
    this.executionTreeStart({
        type: "scope",
        id: this.scopes.length - 1
    });
};

Context.prototype.popScope = function() {
    this.scopes.shift();
    this.executionTreeStop();
    if (!this.scopes.length) this.pushScope();
};

Context.prototype.getDefinedString = function() {
    var scopeLength = this.scopes.length;
    var defined = Object.keys(this.scopes[scopeLength - 1]);
    if (scopeLength > 1) defined = defined.concat(Object.keys(this.scopes[0]));

    return "(count: " + scopeLength + ") defined: " + defined.join(", ");
};

Context.prototype.findVariableScope = function(name) {
    var scopeLength = this.scopes.length;
    if (scopeLength > 1 && this.scopes[0].hasOwnProperty(name)) return 0;
    if (this.scopes[scopeLength - 1].hasOwnProperty(name)) return scopeLength - 1;
    return false;
};

Context.prototype.getVariable = function(name) {
    var scope = this.findVariableScope(name);
    if (scope === false) errors.referenceError(name + " is not defined");
    return this.scopes[scope][name];
};

Context.prototype.setVariable = function(name, value, scope) {
    if (scope == null) scope = this.findVariableScope(name);
    if (scope === false) scope = 0;

    this.scopes[scope][name] = value;
};

Context.prototype.strictEqual = function(value1, value2) {
    if (value1 == null && value2 == null) return true;
    if (value1 == null || value2 == null) return false;

    var type1 = this.findCastType(value1);
    var type2 = this.findCastType(value2);

    if (type1.type !== type2.type) return false;

    if (type1.isEqual) return type1.equal(value1, value2, this);
    return value1 === value2;
};

Context.prototype.notStrictEqual = function(value1, value2) {
    return !this.strictEqual(value1, value2);
};

Context.prototype.cast = function(preferences, value) {
    if (value == null) return value;
    if (typeof value === 'boolean') value = value ? 1 : 0;

    if (!Array.isArray(preferences)) preferences = [preferences];

    var type = this.findCastType(value);
    if (!type.cast) errors.valueError("Cannot cast " + type.type + " to " + preferences.join(", "));

    if (preferences.indexOf(type.type) !== -1) return value;

    for (var i = 0; i < preferences.length; i++) {
        var name = preferences[i];

        if (type.cast[name]) return type.cast[name](value);
    }
    errors.valueError("Cannot cast " + type.type + " to " + preferences.join(", "));
};

Context.prototype.findCastType = function(value) {
    for (var key in types) {
        if (!types.hasOwnProperty(key)) continue;

        var type = types[key];
        if (!type.matches) continue;
        if (type.matches(value)) return type;
    }
    throw new Error("Cannot match type for value");
};

Context.prototype.castNumber = function(value) {
    return this.cast(["number"], value);
};

Context.prototype.castString = function(value) {
    return this.cast(["string"], value);
};

Context.prototype.castBoolean = function(value) {
    return this.cast(["boolean"], value);
};

Context.prototype.castMap = function(value) {
    return this.cast(["map"], value);
};

Context.prototype.expectNumber = function(value) {
    return types.number.matches(value);
};

Context.prototype.expectString = function(value) {
     if (!types.string.matches(value)) errors.typeError("Expected string");
};

Context.prototype.expectBoolean = function(value) {
    if (!types.boolean.matches(value)) errors.typeError("Expected boolean");
};

Context.prototype.expectMap = function(value) {
    if (!types.map.matches(value)) errors.typeError("Expected map");
};

Context.prototype.expectBlock = function(value) {
    if (!types.block.matches(value)) errors.typeError("Expected block");
};

Context.prototype.expect = function(param, match) {
    if (!match) errors.typeError("Invalid value for parameter " + param);
};

module.exports = Context;