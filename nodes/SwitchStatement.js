exports.type = "SwitchStatement";
exports.call = function(node, ctx, execute) {
    var checkValue = execute(node.discriminant);

    var noBreak = false;

    function nextItem() {
        var caseStmts = node.cases[i];
        if (noBreak || !caseStmts || ctx.strictEqual(checkValue, caseStmts.test)) {
            var executor = execute.create(caseStmts.consequent);
            noBreak = true;
            executor.use('BreakStatement', function() {
                executor.stop();
                noBreak = false;
            });
            executor.start();
        }

        return !noBreak;
    }
    for (var i = 0; i < node.cases.length; i++) {
        if (nextItem) break;
    }
};