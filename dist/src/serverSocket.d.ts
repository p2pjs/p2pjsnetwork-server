import WebSocket from 'ws';
import { ServerMessageTypes } from './enums';
export interface IMessage {
    type: ServerMessageTypes;
    payload: any;
}
export default class ServerSocket {
    private socket;
    constructor(socket: WebSocket);
    send(type: ServerMessageTypes, payload: any): void;
    sendWrongOrExpiredLinkError(linkId: string): void;
    sendEmptServerError(): void;
    sendWrongMessageFormatError(): void;
    sendWrongMessageTypeError(): void;
    areEqual(ws: WebSocket): boolean;
}
