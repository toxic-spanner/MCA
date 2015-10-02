exports.type = "WhileStatement";
exports.call = function(node, ctx, execute) {
    // todo: refactor with 'doWhile' statement
    function nextItem() {
        var shouldBreak = false;

        var ex = execute.create(node.body);
        execute.pushNodeStack({
            'ContinueStatement': function() {
                ex.stop();
            },
            'BreakStatement': function() {
                ex.stop();
                shouldBreak = true;
            }
        });
        ex.start();
        execute.popNodeStack();

        return shouldBreak;
    }

    while (execute(node.test)) {
        if (nextItem()) break;
    }
};