function Kkbot(bot) {
    this.bot = bot;
}

Kkbot.prototype = {
    on: function(event, execute) {
        switch (event) {
            case "message":
                this.bot.addListener("message", (msg) => {
                    execute({
                        content: msg.content,
                        hasMention: msg.isMention,
                        packageName: msg.packageName,
                        room: new Room(msg),
                        member: new Member(msg),
                        send: (s) => msg.reply(s),
                        markAsRead: () => msg.markAsRead()
                    });
                });
                break;
            case "join":
                // execute(chat, joinedMember);
                break;
            case "leave":
                // execute(chat, leavedMember);
                break;
        };
    }
};

//--------------------------------------------------------------
function Member(msg) {
    this.name = msg.author.name;
    this.avatar = msg.author.avatar;
    // this.isBot
}

Member.prototype = {
    toString: function() {
        return this.name;
    }
}

//--------------------------------------------------------------
function Room(msg) {
    this.name = msg.room;
    this.isGroupChat = msg.isGroupChat;
    this.isDebugRoom = msg.isDebugRoom;
}

Room.prototype = {
    toString: function() {
        return this.name;
    }
}

//--------------------------------------------------------------
const KEvent = {
    JOIN: "join",
    LEAVE: "leave",
    MESSAGE: "message"
}

module.exports = {
    Kkbot: Kkbot,
    Member: Member,
    Room: Room
};