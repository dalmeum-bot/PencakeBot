const { Kkbot, Member, Room } = require('kkbot.js');
const { Command, Commander, Int, Float, Str, Mention, Day, Pattern, Function } = require('command.js');

const dalmeum = new Kkbot(BotManager.getCurrentBot());
const commander = new Commander('/').setcommand({
    util: {
        ping: () => "pong",
        echo: ((content) => content).type(Str),
        day: ((day) => day.month + "월 " + day.day + "일을 입력하셨습니다.").type(Day)
    },
    math: {
        add: ((a, b) => a + b).type(Int, Int),
        addf: ((a, b) => a + b).type(Float, Float)
    }
});

dalmeum.on("message", (chat) => {
    let result = commander.execute(chat);
    if (result != null)
        chat.send(result);
    else
        chat.markAsRead();
});