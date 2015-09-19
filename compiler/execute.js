function execute(statements, ctx) {
    return execute.create(statements, ctx).start();
}

execute.create = function(statements, ctx) {
    var useNodes = {};

    for (var type in nodes) {
        if (!nodes.hasOwnProperty(type)) continue;
        useNodes[type] = nodes[type].call;
    }

    function subExecute(statements) {
        return execute(statements, ctx);
    }
    subExecute.create = function(statements) {
        return execute.create(statements, ctx);
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

module.exports = execute;

var nodes = require('./nodes');
var errors = require('./errors');