class Command {
    constructor(execute) {

    }

    Type(...types) {

    }
}

class CommandGroup {
    constructor(description, commands) {

    }
}

class Pattern {
    constructor(pattern, variadic=false) {
        this.pattern = pattern;
        this.variadic = variadic;
    }

    is(tomatch) {
        return this.pattern.test(tomatch);
    }

    variadic() {
        return Pattern(this.pattern, true);
    }
}

Function.prototype.types = function() {
    arguments = Array.from(arguments);
    return new Command(this).types()
}

module.exports = {
    Command: Command,
    CommandGroup: CommandGroup,
    Int: Pattern(/^-?\d+$/),
    Float: Pattern(/^-?\d+\.\d+$/),
    String: Pattern(/^.+$/),
    Mention: Pattern(/^@(\S+)$/),
    Pattern: Pattern,
    Function: Function
};