exports.type = "DoWhileStatement";
exports.call = function(node, ctx, execute) {
    // todo: refactor with 'while' statement
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

    do {
        if (nextItem()) break;
    } while (execute(node.test));
};