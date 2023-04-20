// const bot = BotManager.getCurrentBot();
import Kkbot from './app/kkbot';
import { Member, Room, KEvent } from './app/helper';
import { Command, CommandGroup, Int, Float, String, Mention, Type } from './app/command.js';
const dalmeum = new Kkbot('/');
// bot.on(Event.NOTIFICATION_POSTED, dalmeum.start);
// bot.on(Event.COMPILE, dalmeum.stop);

function Symbolize(str: string) {
    return Symbol.for(str);
}

class

// dalmeum.setcommand();
let c = {
    util: {
        ping: "pong",
        kick: ((kickuser, reason) => {
            kickuser.kick(reason);
            return `kicked ${kickuser}`;
        }).type(),
        translate: (fromlang: String, tolang: String, text: String) => text
    },
    date: {
        diff: (date1: Date, date2: Date) => date1 - date2,
    }
    math: {
        add: (numbers: Number[]) => numbers.reduce((acc, cur) => acc + cur),
        func: {
            log: (base: Number, num: Number) => Math.log(base, num),
            pi: 3.141592
        }
    }
};
c[Symbolize('math')] = "d";

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