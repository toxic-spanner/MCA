exports.type = "WhileStatement";
exports.call = function(node, ctx, execute) {
    // todo: refactor with 'doWhile' statement
    function nextItem() {
        var executor = execute.create(node.body.type === "BlockStatement" ? node.body.body : node.body), shouldBreak = false;

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

    while (execute(node.test)) {
        if (nextItem()) break;
    }
};