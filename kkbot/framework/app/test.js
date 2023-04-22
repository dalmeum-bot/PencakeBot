const { Kkbot, Member, Room } = require('./kkbot.js');
const { Command, Commander, Pattern, Function, Type } = require('./command.js');

// const dalmeum = new Kkbot(BotManager.getCurrentBot());
const commander = new Commander('/').setcommand({
    ping: (chat) => "pong",

    kick: ((chat, user, reason="기본인자") => {
        return `@${user} 를 강퇴합니다. 사유: ${reason}`;
    }).type(Type.mention, Type.string.option()),

    add: ((chat, numbers) => numbers.reduce((acc, cur) => acc + cur)).type(Type.int.many())
});


// dalmeum.on("message", (chat) => {
//     let result = commander.execute(chat);
//     if (result != null)
//         chat.send(result);
//     else
//         chat.markAsRead();
// });

const chat = {
    content: "/ping",
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