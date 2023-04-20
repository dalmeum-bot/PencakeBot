class Member {
    constructor(author) {
        this.name = author.name;
    }

    toString() {
        return this.name;
    }
}

class Room {
    constructor(room) {
        this.name = room.name;
    }

    toString() {
        return this.name;
    }
}

const KEvent = {
    JOIN: "join",
    LEAVE: "leave",
    MESSAGE: "message",
    COMMAND: "command"
}

module.exports = {
    Member: Member,
    Room: Room,
    KEvent: KEvent
};