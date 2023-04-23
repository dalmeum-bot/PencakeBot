const { Kkbot, Member, Room } = require('kkbot.js');
const { Command, Commander, Pattern, Function, Type } = require('command.js');
const { factorization, gcd, lcm, Fraction, Complex } = require('Numbers.js');

function convertToSuperscript(str) {
    const regex = /(\d+)\^(-?\d+)/g;
    const replacer = (match, base, exponent) => {
        const sup = exponent.split('').map(digit => {
        switch (digit) {
            case '-':
            return '⁻';
            case '0':
            return '⁰';
            case '1':
            return '¹';
            case '2':
            return '²';
            case '3':
            return '³';
            case '4':
            return '⁴';
            case '5':
            return '⁵';
            case '6':
            return '⁶';
            case '7':
            return '⁷';
            case '8':
            return '⁸';
            case '9':
            return '⁹';
        }
        }).join('');
        return `${base}${sup}`;
    };
    return str.replace(regex, replacer);
}

const dalmeum = new Kkbot(BotManager.getCurrentBot());
const commander = new Commander('/').setcommand({
    ping: (chat) => "pong",

    kick: ((chat, user, reason="기본인자") => {
        return `@${user} 를 강퇴합니다. 사유: ${reason}`;
    }).type(Type.mention, Type.string.option()),

    add: ((chat, ps) => {
        try {
            let start = new Date();
            let ret = new Fraction(0);
            for (let i = 0; i < ps.length; i++) {
                if (ps[i] == "NaN") throw new Error("NaN");
                ret = ret.add(new Fraction(ps[i]));
            }
            let str = `${ps.toString().replace(/,/g, ' + ')} = ${ret.print()}`;
            let end = new Date();
            return str + `\n(calculating for ${Math.floor((end.getTime() - start.getTime()) / 1000)}s)`
        } catch (e) {
            return "Error: " + e.message;
        }
    }).type(Type.string.many()),

    fact: ((chat, frac) => {
        try {
            if (frac == "NaN") throw new Error("NaN");
            let start = new Date();
            let fraction = new Fraction(frac);
            let str = `frac(${fraction.print()}) = ${convertToSuperscript(factorization(frac).replace(/×/g, ' · '))}`;
            let end = new Date();
            return str + `\n(calculating for ${Math.floor((end.getTime() - start.getTime()) / 1000)}s)`
        } catch (e) {
            return "Error: " + e.message;
        }
    }).type(Type.string),

    gcd: ((chat, p1, p2) => {
        try {
            if (p1 == "NaN" || p2 == "NaN") throw new Error("NaN");
            let start = new Date();
            let str = `gcd(${p1}, ${p2}) = ${gcd(p1, p2).print()}`;
            let end = new Date();
            return str + `\n(calculating for ${Math.floor((end.getTime() - start.getTime()) / 1000)}s)`
        } catch (e) {
            return "Error: " + e.message;
        }
    }).type(Type.string, Type.string),

    lcm: ((chat, p1, p2) => {
        try {
            if (p1 == "NaN" || p2 == "NaN") throw new Error("NaN");
            let start = new Date();
            let str = `lcm(${p1}, ${p2}) = ${lcm(p1, p2).print()}`;
            let end = new Date();
            return str + `\n(calculating for ${Math.floor((end.getTime() - start.getTime()) / 1000)}s)`
        } catch (e) {
            return "Error: " + e.message;
        }
    }).type(Type.string, Type.string),
});

dalmeum.on("message", (chat) => {
    let result = commander.execute(chat);
    if (result != null)
        chat.send(result);
});