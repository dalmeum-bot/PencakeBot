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
                        image: msg.image,

                        room: new Room(msg),
                        member: new Member(msg),
                        
                        isDual: msg.systemUserId == 95,
                        chatLogId: msg.chatLogId,
                        hasMention: msg.isMention,
                        packageName: msg.packageName,
                        
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
    this.isOpenChat = msg.room.isOpenChat;
    this.icon = msg.room.icon;
    this.id = msg.room.id;
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