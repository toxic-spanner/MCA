var indent = 0, latestType = false;

var term = require('terminal-kit').terminal;

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
            term.brightRed((new Array(indent)).join(" ") + "<WARN>\n");
            term.right(indent + 3);
            term.brightRed("No node called " + item.type + ": ");
            console.log(require('util').inspect(item, {color: true}));
            term.right(indent - 1);
            term.brightRed("</WARN>\n");
            return null;
        }

        //console.log("Executing", require('util').inspect(item, {colors: true}));



        var locSection = "(" + item.loc.start.line + "," + item.loc.start.column + ")";
        term.cyan((new Array(indent)).join(" ") + "<" + item.type);
        term.yellow(locSection);

        var paramLength = 0;

        for (var key in item) {
            if (key === "type") continue;
            if (typeof item[key] !== "string" && typeof item[key] !== "number" && typeof item[key] !== "boolean") continue;
            term.magenta(" " + key);
            term.brightBlue("(" + (typeof key) + ")");
            term.magenta('="' + item[key] + '"');
            paramLength += 6 + key.length + (typeof key).length + item[key].toString().length;
        }
        term.cyan(">\n");

        latestType = item.type;
        indent += 4;

        try {
            var result = useNodes[item.type](item, ctx, subExecute);
        } catch (ex) {
            if (!ex._mca && !ex._mcaHasShown && console) {
                console.error("Internal compiler exception!");
                if (ex.stack) console.warn(ex.stack);
                else console.warn(ex.name + ": " + ex.message);
                ex._mcaHasShown = true;
            }

            // attach location information and re-throw
            if (!ex.loc) ex.loc = item.loc;
            throw ex;
        }

        indent -= 4;
        if (latestType === item.type) {
            term.up(1);
            term.right(indent + latestType.length + locSection.length + paramLength);
            term.yellow(" (" + item.loc.end.line + "," + item.loc.end.column + ")");
            term.green("/>\n");
        }
        else {
            term.green((new Array(indent)).join(" ") + "</" + item.type);
            term.yellow("(" + item.loc.end.line + "," + item.loc.end.column + ")");
            term.green(">\n");
        }

        //console.log("Variables:", ctx.scopes);

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