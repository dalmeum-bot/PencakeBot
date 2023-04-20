const bot = BotManager.getCurrentBot();
const dalmeum = require('app/kkbot.js')('/');
const { Member, Room, KEvent } = require('app/helper.js');
const { Command, CommandGroup, Int, Float, String, Mention, Type } = require('app/command.js');
bot.on(Event.NOTIFICATION_POSTED, dalmeum.start);
bot.on(Event.COMPILE, dalmeum.stop);

dalmeum.on(KEvent.JOIN, (chat, joinedMember) => {
    if (joinedMember != "rhs") {
        chat.send(`Hi, ${joinedMember}`);
    }
});

/** chat
 * member: Member,
 * room: Room,
 * content: String
 */

dalmeum.on(KEvent.COMMAND, (chat) => {
    commands = {
        util: CommandGroup('utility commands', {
            ping: Command(() => "pong"),
            kick: Command((kickuser, reason) => {
                kickuser.kick(reason);
                return `kicked ${kickuser}`;
            }).Type(Member, String),
            translate: Command((fromlang, tolang, text) => text).Type(String, String, String)
        }),
        math: CommandGroup('math commands', {
            add: Command((numbers) => numbers.reduce((acc, cur) => acc + cur)).Types(Int),
            func: CommandGroup('function', {
                log: Command((base, num) => Math.log(base, num)).Type(Float, Float)
            })
        })
    };


});