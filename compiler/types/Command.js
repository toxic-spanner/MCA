function Command(name, params) {
    this.name = name;
    this.params = params;

    this.isCommand = true;
}
Command.type = "command";
Command.matches = function(command) {
    return command && command.isCommand;
};
Command.equal = function(command1, command2, ctx) {
    if (command1.name !== command2.name) return false;
    if (command1.params === command2.params) return true;
    if (command1.params.length !== command2.params.length) return false;

    for (var i = 0; i < command1.params.length; i++) {
        if (ctx.notStrictEqual(command1.params[i], command2.params[i])) return false;
    }
    return true;
};
Command.toJSON = function(command) {
    return Command.cast.string(command);
};
Command.cast = {
    string: function(command) {
        return "/" + command.name + command.params;
    },
    boolean: function(boolean) {
        return true;
    }
};
module.exports = Command;