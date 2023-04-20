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

class Type {
    constructor(pattern) {
        this.pattern = pattern;
    }
}

module.exports = {
    Command: Command,
    CommandGroup: CommandGroup,
    Int: Type(/^-?\d+$/),
    Float: Type(/^-?\d+\.\d+$/),
    String: Type(/^.+$/),
    Mention: Type(/^@(\S+)$/),
    Type: Type
};