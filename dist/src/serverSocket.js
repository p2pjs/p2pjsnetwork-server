"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
class ServerSocket {
  constructor(socket) {
    this.socket = socket;
  }
  send(type, payload) {
    this.socket.send(
      JSON.stringify({
        type,
        payload,
      })
    );
  }
  sendWrongOrExpiredLinkError(linkId) {
    this.send(enums_1.ServerMessageTypes.WrongOrExpiredLinkError, {
      message: `Link id {${linkId}} not found, it may be wrong or had already be expired.`,
    });
  }
  sendEmptServerError() {
    this.send(enums_1.ServerMessageTypes.EmptyServerError, {
      message: "Only you are connected in this network server.",
    });
  }
  sendWrongMessageFormatError() {
    this.send(enums_1.ServerMessageTypes.WrongMessageFormatError, {
      message: "Wrong message format.",
    });
  }
  sendWrongMessageTypeError() {
    this.send(enums_1.ServerMessageTypes.WrongMessageTypeError, {
      message: "Wrong message format.",
    });
  }
  areEqual(ws) {
    return this.socket === ws;
  }
}
exports.default = ServerSocket;
//# sourceMappingURL=serverSocket.js.map
