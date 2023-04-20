const bot = BotManager.getCurrentBot();
var { registry, cmd } = require('cmd.js');

bot.setCommandPrefix("/");
bot.addListener(Event.COMMAND, (msg) => {
    registry.register(
        math, ping
    );

    var result = registry.execute(msg);
    if (result != null)
        msg.reply(result);
    else
        msg.markAsRead();
});

var math = add => new cmd('add', 'plus')
    .onlyDual(true)
    .canDM(false)
    .args(Number, numbers => new cmd()
        .do(msg =>
            numbers.reduce((acc, cur) => acc + cur)
        )
    );

var ping = ping => new cmd('ping')
    .desc('ping command')
    .do('pong');