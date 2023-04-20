const bot = BotManager.getCurrentBot();
const dalmeum = require('app/kkbot.js')('/');
const { Member, Room, KEvent } = require('app/helper.js');
const { Command, CommandGroup, Int, Float, String, Mention, Pattern, Function } = require('app/command.js');
bot.on(Event.NOTIFICATION_POSTED, dalmeum.start);
bot.on(Event.START_COMPILE, dalmeum.stop);

// teleport overworld nether @rhs
dalmeum.setcommand({
    ping: "pong",
    kick: 
    teleport: ((from, to, member) => member.teleport(from, to)).types(world, world),
    math: {
        add: ((numbers) => sum(numbers)).types(Int.variadic())
    }
})

dalmeum.addcommand({
    util: {
        ping: () => "pong",
        kick: ((kickuser, reason) => {
            kickuser.kick(reason);
            return `kicked ${kickuser}`;
        }).types(Member, Pattern()),
        translate: Command((fromlang, tolang, text) => text).Type(String, String, String)
    },
    math: {
        add: Command((numbers) => numbers.reduce((acc, cur) => acc + cur)).Types(Int),
        func: {
            log: Command((base, num) => Math.log(base, num)).Type(Float, Float)
        }
    }
});

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
    
});