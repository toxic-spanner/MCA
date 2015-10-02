function Executor() {
    this.nodeStack = [];
}

Executor.prototype.pushNodeStack = function(overrides) {
    this.nodeStack.push(overrides);
};

Executor.prototype.popNodeStack = function() {
    this.nodeStack.pop();
};

Executor.prototype.getNode = function(name) {
    for (var i = this.nodeStack.length - 1; i >= 0; i--) {
        var item = this.nodeStack[i][name];
        if (item) return item;
    }
    return false;
};

Executor.prototype.execute = function(statements, ctx) {
    var isRunning = true;

    function executeStatementList(list) {
        if (!Array.isArray(list)) return executeItem(list);
        var result = [];
        for (var i = 0; i < list.length; i++) {
            if (!isRunning) break;
            var item = executeStatementList(list[i]);
            if (item != null) result.push(item);
        }
        return result;
    }

    var subExecute = function(stmts) {
        var r = this.execute(stmts, ctx).start();
        console.log("Result is", r);
        return r;
    }.bind(this);

    subExecute.pushNodeStack = this.pushNodeStack.bind(this);
    subExecute.popNodeStack = this.popNodeStack.bind(this);
    subExecute.getNode = this.getNode.bind(this);
    subExecute.create = this.getNode.bind(this);

    var executeItem = function executeItem(item) {
        var node = this.getNode(item.type);
        if (!node) {
            ctx.executionTreeStart({ type: "warning", node: item });
            ctx.executionTreeStop();
            return null;
        }

        var obj;
        ctx.executionTreeStart(obj = {
            type: "node",
            node: item
        });

        try {
            var result = node.call(item, ctx, subExecute);
        } catch (ex) {
            if (!ex.loc) ex.loc = item.loc;
            throw ex;
        }

        ctx.executionTreeStop();
        obj.result = result;
        return result;
    }.bind(this);

    return {
        start: function() {
            isRunning = true;
            var r = executeStatementList(statements);
            console.log("Result2", r);
            return r;
        },
        stop: function() {
            isRunning = false;
        }
    };
};

// singleton
module.exports = new Executor();

/*
function execute(statements, ctx, parentNodes) {
    return execute.create(statements, ctx, parentNodes).start();
}

execute.create = function(statements, ctx, parentNodes) {
    parentNodes = parentNodes || nodes;
    var useNodes = {};

    for (var type in parentNodes) {
        if (!parentNodes.hasOwnProperty(type)) continue;
        var parent = parentNodes[type];
        useNodes[type] = typeof parent === "function" ? parent : parent.call;
    }

    function subExecute(statements) {
        return execute(statements, ctx, useNodes);
    }
    subExecute.create = function(statements) {
        return execute.create(statements, ctx, useNodes);
    };

    var isRunning = false;
    function executeStatementList(list) {
        if (!Array.isArray(list)) return executeItem(list);
        var result = [];
        for (var i = 0; i < list.length; i++) {
            if (!isRunning) break;
            var item = executeStatementList(list[i]);
            if (typeof item !== "undefined") result.push(item);
        }
        return result;
    }
    function executeItem(item) {
        if (!useNodes[item.type]) {
            ctx.executionTreeStart({ type: "warning", node: item });
            ctx.executionTreeStop();
            return null;
        }

        var obj;
        ctx.executionTreeStart(obj = {
            type: "node",
            node: item
        });

        try {
            var result = useNodes[item.type](item, ctx, subExecute);
        } catch (ex) {
            // attach location information and re-throw
            if (!ex.loc) ex.loc = item.loc;
            throw ex;
        }

        ctx.executionTreeStop();
        obj.result = result;
        return result;
    }

    return {
        use: function(name, statement) {
            useNodes[name] = statement;
        },
        start: function() {
            isRunning = true;
            return executeStatementList(statements);
        },
        stop: function() {
            isRunning = false;
        }
    };
};

module.exports = execute;*/

var nodes = require('./nodes');

module.exports.pushNodeStack(nodes);