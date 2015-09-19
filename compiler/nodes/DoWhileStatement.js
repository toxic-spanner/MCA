exports.type = "DoWhileStatement";
exports.call = function(node, ctx, execute) {
    // todo: refactor with 'while' statement
    function nextItem() {
        var executor = execute.create(node.body);
        var shouldBreak = false;

        executor.use('ContinueStatement', function() {
            executor.stop();
        });
        executor.use('BreakStatement', function() {
            executor.stop();
            shouldBreak = true;
        });
        executor.start();

        return shouldBreak;
    }

    do {
        if (nextItem()) break;
    } while (execute(node.test));
};