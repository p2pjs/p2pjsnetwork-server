import WebSocket from 'ws';
import { ServerMessageTypes } from './enums';

export interface IMessage {
  type: ServerMessageTypes;
  payload: any;
}

export default class ServerSocket {
  private socket: WebSocket;
  constructor(socket: WebSocket) {
    this.socket = socket;
  }

  send(type: ServerMessageTypes, payload: any) {
    this.socket.send(JSON.stringify({
      type,
      payload,
    }));
  }

  sendWrongOrExpiredLinkError(linkId: string) {
    this.send(ServerMessageTypes.WrongOrExpiredLinkError, {      
      message: `Link id {${linkId}} not find, it may be wrong or had already be expired.`
    });
  }

  sendEmptServerError() {
    this.send(ServerMessageTypes.EmptyServerError, {
      message: "Only you are connected in this network server."
    });
  }

  sendWrongMessageFormatError() {
    this.send(ServerMessageTypes.WrongMessageFormatError, {
      message: "Wrong message format."
    });
  }

  sendWrongMessageTypeError() {
    this.send(ServerMessageTypes.WrongMessageTypeError, {
      message: "Wrong message format."
    });
  }

  areEqual(ws: WebSocket) {
    return this.socket === ws;
  }
}