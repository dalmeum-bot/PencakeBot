function Commander(prefix) {
    this.prefix = prefix;
    this.commands = {};
};

Commander.prototype = {
    setcommand(commands) {
        this.commands = commands;
        return this;
    },

    execute(chat) {
        if (!chat.content.startsWith(this.prefix)) return null;

        let args = chat.content.slice(this.prefix.length).split(' ');
        let finded = this.commands;

        while (!(finded.constructor == Function || finded.isCmd == true)) {
            let notfound = true;

            for (let subcommand in finded) {
                if (subcommand == args[0]) {
                    notfound = false;
                    args.shift();
                    finded = finded[subcommand];
                    break;
                }
            }
            
            if (notfound) return null;
        }

        if (finded.constructor == Function)
            finded = new Command(finded);

        let optional_count = finded.types.filter(e => e().optional == false).length;
        if (args.length < optional_count) return null;

        for (let i = 0, j = 0; i < args.length; i++) {
            if (finded.types[j] == null) return null;

            let type = finded.types[j]();

            if (type != null) {
                if (!type.is(args[i])) return null;
            }
            
            if (type.variadic == false) j++;
        }

        for (let i = 0, j = 0; i < args.length; i++) {
            let type = finded.types[j]();

            if (type != null) {
                args[i] = type.getMatch(args[i]);
            }
            
            if (type.variadic == false) j++;
        }

        args = args.map(v => {
            if (Object.keys(v).length == 1) {
                return v.value;
            } else {
                return v;
            }
        });

        let applier = [];
        if (finded.types.length > 0) {
            let isVariadic = finded.types[finded.types.length - 1]().variadic == true;
            applier = args.slice(0, finded.types.length - isVariadic);
            if (isVariadic) {
                applier.push(args.slice(finded.types.length - 1));
            }
        }

        applier.splice(0, 0, chat);
        return finded.execute.apply(null, applier);
    }
}

// ---------------------------------------------------------------
function Command(execute) {
    this.isCmd = true;
    this.execute = execute;
    this.types = [];
}

Command.prototype = {
    type(args) {
        this.types = args;
        return this;
    }
}

// ---------------------------------------------------------------
// TODO: easier pattern write
// TODO: only using named group
// TODO: union pattern
function Pattern(pattern) {
    this.pattern = pattern;
    this.match = {};
    this.variadic = false;
    this.optional = false;
}

Pattern.prototype = {
    setLabel(typetable) {
        this.match = typetable;
        return this;
    },

    is(tomatch) {
        return this.pattern.test(tomatch);
    },

    getMatch(tomatch) {
        let matched = tomatch.match(this.pattern);
        if (matched == null)
            throw new ReferenceError(tomatch + " has not matched with " + this.pattern)

        let groups = matched.slice(1);
        let keys = Object.keys(this.match);

        for (let i = 0; i < keys.length; i++) {
            this.match[keys[i]] = this.match[keys[i]](groups[i]);
        }
        return this.match;
    },

    many() {
        if (this.optional == true) 
            throw new Error('optional pattern cannot be variadic');
        this.variadic = true;
        return this;
    },

    option() {
        if (this.variadic == true)
            throw new Error('variadic pattern cannot be optional');
        this.optional = true;
        return this;
    }
};

// ---------------------------------------------------------------
Function.prototype.type = function() {
    return (new Command(this)).type(Array.from(arguments));
};

Function.prototype.option = function() {
    return () => this().option();
}

Function.prototype.many = function() {
    return () => this().many();
}

module.exports = {
    Command: Command,
    Commander: Commander,
    Pattern: Pattern,
    Function: Function,
    Type: {
        int: () => new Pattern(/^([+-]?\d+)$/).setLabel({'value': Number}),
        float: () => new Pattern(/^(-?\d+\.\d+)$/).setLabel({'value': Number}),
        string: () => new Pattern(/^(\S+)$/).setLabel({'value': String}),
        mention: () => new Pattern(/^@(\S+)$/).setLabel({'value': String}),
        date: () => new Pattern(/^((\d{1,2})[./](\d{1,2}))$/).setLabel({'value': Date, 'month': Number, 'day': Number})
    }
};