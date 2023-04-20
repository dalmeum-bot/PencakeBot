const { Kkbot, Member, Room } = require('./kkbot');
const { Command, Commander, Int, Float, Str, Mention, Day, Pattern, Function } = require('./command');

// const dalmeum = new Kkbot(BotManager.getCurrentBot());
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

const chat = {
    content: "/util echo helloworld",
    hasMention: true,
    packageName: "com.kakao.talk",
    room: {
        name: "dev",
        isGroupChat: true,
        isDebugRoom: false
    },
    member: {
        name: "rhs",
        avatar: {}
    }
}

let result = commander.execute(chat);
if (result != null)
    console.log(result);