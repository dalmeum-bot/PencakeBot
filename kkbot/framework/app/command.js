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

        while (!(finded.constructor == Function || finded.isCmd != true)) {
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

        args.forEach((arg, idx) => {
            if (idx < finded.types.length) {
                if (!finded.types[idx].is(arg)) return null;
            }
        })

        return finded.execute.apply(null, args.forEach((arg, idx) => {
            if (idx < finded.types.length) {
                return finded.types[idx].args(arg);
            } else {
                return arg;
            }
        }));
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
function Pattern(pattern) {
    this.pattern = pattern;
    this.match = {};
}

Pattern.prototype = {
    setLabel() {
        Array.from(arguments).forEach((arg) => {
            this.match[arg] = '';
        });
        return this;
    },

    is(tomatch) {
        return this.pattern.test(tomatch);
    },

    args(tomatch) {
        let groups = tomatch.match(this.pattern).slice(1);
        let keys = Object.keys(this.match);

        for (let i = 0; i < keys.length; i++) {
            this.match[keys[i]] = groups[i];
        }
        return this.match;
    }
};

// ---------------------------------------------------------------
Function.prototype.type = function() {
    return (new Command(this)).type(Array.from(arguments));
};

module.exports = {
    Command: Command,
    Commander: Commander,
    Int: new Pattern(/^(-?\d+)$/).setLabel('value'),
    Float: new Pattern(/^(-?\d+\.\d+)$/).setLabel('value'),
    Str: new Pattern(/^(\S+)$/).setLabel('value'),
    Mention: new Pattern(/^@(\S+)$/).setLabel('value'),
    Day: new Pattern(/^(\d{1,2})월(\d{1,2})일$/).setLabel('month', 'day'),
    Pattern: Pattern,
    Function: Function
};