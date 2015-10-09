function Executor() {
    this.nodeStack = [];
    this.pushNodeStack(nodes);
}

Executor.prototype.pushNodeStack = function(overrides) {
    this.nodeStack.unshift(overrides);
};

Executor.prototype.popNodeStack = function() {
    this.nodeStack.shift();
};

Executor.prototype.getNode = function(name) {
    for (var i = 0; i < this.nodeStack.length; i++) {
        var item = this.nodeStack[i][name];
        if (item) return item;
    }
    return false;
};

var runningIndexes = [];
var nextIndex = 0;

Executor.prototype.execute = function(statements, ctx) {
    //var isRunning = true;

    var myIndex = nextIndex++;
    var children;

    function executeStatementList(list) {
        if (!Array.isArray(list)) {
            return executeItem(list);
        }
        var result = [];
        for (var i = 0; i < list.length; i++) {
            if (!runningIndexes[myIndex]) break;
            var item = executeStatementList(list[i]);
            if (item != null) result.push(item);
        }
        return result;
    }

    var subExecute = function(stmts) {
        var obj = this.execute(stmts, ctx);
        children.push(obj.id);
        return obj.start();
    }.bind(this);

    subExecute.pushNodeStack = this.pushNodeStack.bind(this);
    subExecute.popNodeStack = this.popNodeStack.bind(this);
    subExecute.getNode = this.getNode.bind(this);
    subExecute.create = function(stmts) {
        var obj = this.execute(stmts, ctx);
        children.push(obj.id);
        return obj;
    }.bind(this);

    var executeItem = function executeItem(item) {
        var node = this.getNode(item.type);
        if (!node) {
            ctx.executionTreeStart({ type: "warning", node: item });
            ctx.executionTreeStop();
            return null;
        }
        var obj = {
            type: "node",
            node: item
        };
        ctx.executionTreeStart(obj);

        var result;
        try {
            result = node(item, ctx, subExecute);
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
            runningIndexes[myIndex] = true;
            children = [myIndex];

            return executeStatementList(statements);
        },
        stop: function() {
            for (var i = 0; i < children.length; i++) {
                runningIndexes[children[i]] = false;
            }
        },
        id: myIndex
    };
};

module.exports = Executor;

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

var nodeObjects = require('./nodes');
var nodes = {};
for (var nodeName in nodeObjects) {
    if (!nodeObjects.hasOwnProperty(nodeName)) continue;
    nodes[nodeName] = nodeObjects[nodeName].call;
}