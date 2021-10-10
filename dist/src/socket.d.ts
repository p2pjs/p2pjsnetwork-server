import WebSocket from 'ws';
import { ServerMessageTypes } from './enums';
export default class SocketHandler {
    socket: WebSocket;
    constructor(socket: WebSocket);
    send(type: ServerMessageTypes, payload: any): void;
    sendWrongOrExpiredLinkError(): void;
    sendEmptServerError(): void;
}
