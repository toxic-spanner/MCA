var execute = require('../execute');

function Block(overloads) {
    this.isBlock = true;
    this.overloads = overloads;
}

Block.prototype.hasOverload = function(name) {
    return this.overloads.hasOwnProperty(name);
};

Block.prototype.getOverload = function(name) {
    var overload = this.overloads[name];

    return {
        execute: function(ctx, params) {
            var result;

            ctx.pushScope();
            for (var i = 0; i < params.length; i++) {
                var paramDef = overload.params[i];
                ctx.setVariable(paramDef.name, params[i], 0);
            }

            if (overload.block.type === "BlockStatement") {
                var executor = execute.create(overload.block.body, ctx);
                executor.use('ReturnStatement', function (statement) {
                    if (statement.argument) result = execute(statement.argument, ctx);
                    executor.stop();
                });
                executor.start();
            } else result = execute(overload.block, ctx);

            ctx.popScope();
            return result;
        }
    };
};

Block.type = "block";
Block.matches = function(block) {
    return block && block.isBlock;
};
Block.equal = function(block1, block2) {
    return block1 === block2;
};
Block.cast = {
    boolean: function(block) {
        return true;
    }
};
module.exports = Block;