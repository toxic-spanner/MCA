exports.type = "SwitchStatement";
exports.call = function(node, ctx, execute) {
    var checkValue = execute(node.discriminant);

    var noBreak = false;

    function nextItem() {
        var caseStmts = node.cases[i];
        if (noBreak || !caseStmts || ctx.strictEqual(checkValue, caseStmts.test)) {
            noBreak = true;

            var ex = execute.create(caseStmts.consequent);
            execute.pushNodeStack({
                'BreakStatement': function() {
                    ex.stop();
                    noBreak = false;
                }
            });
            ex.start();
            execute.popNodeStack();
        }

        return !noBreak;
    }
    for (var i = 0; i < node.cases.length; i++) {
        if (nextItem()) break;
    }
};