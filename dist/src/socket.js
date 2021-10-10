"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
class SocketHandler {
    constructor(socket) {
        this.socket = socket;
    }
    send(type, payload) {
        this.socket.send(JSON.stringify({
            type,
            payload,
        }));
    }
    sendWrongOrExpiredLinkError() {
        this.send(enums_1.ServerMessageTypes.WrongOrExpiredLink, {
            message: "Link id not find, it may be wrong or had already be expired"
        });
    }
    sendEmptServerError() {
        this.send(enums_1.ServerMessageTypes.EmptyServerError, {
            message: "Only you are connected in this network server"
        });
    }
}
exports.default = SocketHandler;
//# sourceMappingURL=socket.js.map