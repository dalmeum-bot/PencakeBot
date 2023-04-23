const { Kkbot, Member, Room } = require('kkbot.js');
const { Command, Commander, Pattern, Function, Type } = require('command.js');
const { factorization, gcd, lcm, Fraction, Complex } = require('Numbers.js');


Type.complex = () => new Pattern(/^(\S+)([+-]\S*)i$/).setLabel({'real': String, 'imag': String});

const dalmeum = new Kkbot(BotManager.getCurrentBot());
const commander = new Commander('/').setcommand({
    ping: (chat) => "pong",

    kick: ((chat, user, reason="기본인자") => {
        return `@${user} 를 강퇴합니다. 사유: ${reason}`;
    }).type(Type.mention, Type.string.option()),

    add: ((chat, ps) => {
        try {
            let ret = new Fraction(0);
            for (let i = 0; i < ps.length; i++) {
                ret = ret.add(new Fraction(ps[i]));
            }
            return ret.print();
        } catch (e) {
            return "Error: " + e.message;
        }
    }).type(Type.string.many()),

    cadd: ((chat, ps) => {
        try {
            let ret = new Complex(0, 0);
            for (let i = 0; i < ps.length; i++) {
                ret = ret.add(new Complex(ps[i].real, "+-".includes(ps[i].imag) ? ps[i].imag + "1" : ps[i].imag));
            }
            return ret.print();
        } catch (e) {
            return "Error: " + e.message;
        }
    }).type(Type.complex.many()),

    fact: ((chat, frac) => {
        try {
            return factorization(frac);
        } catch (e) {
            return "Error: " + e.message;
        }
    }).type(Type.string),

    gcd: ((chat, p1, p2) => {
        try {
            return gcd(p1, p2);
        } catch (e) {
            return "Error: " + e.message;
        }
    }).type(Type.string, Type.string),

    lcm: ((chat, p1, p2) => {
        try {
            return lcm(p1, p2);
        } catch (e) {
            return "Error: " + e.message;
        }
    }).type(Type.string, Type.string)
});

dalmeum.on("message", (chat) => {
    let result = commander.execute(chat);
    if (result != null)
        chat.send(result);
    else
        chat.markAsRead();
});