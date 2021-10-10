"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const serverSocket_1 = __importDefault(require("./serverSocket"));
const enums_1 = require("./enums");
const lodash_1 = require("lodash");
const error_1 = require("./error");
class ConnectionLinkServer {
    constructor(serverConfig, linkServerConfig) {
        this.links = {};
        this.serverConfig = serverConfig;
        this.linkServerConfig = linkServerConfig;
        this.linkByConnection = new WeakMap();
    }
    init() {
        if (!this.webSocketServer) {
            this.webSocketServer = new ws_1.Server(this.serverConfig);
        }
        this.webSocketServer.on('connection', (connection) => this.hadleNewConnections(connection));
    }
    hadleNewConnections(connection) {
        const socket = new serverSocket_1.default(connection);
        connection.on('close', () => {
            this.linkByConnection.delete(socket);
        });
        connection.on('message', (data) => {
            if (typeof data === 'string') {
                try {
                    const message = JSON.parse(data);
                    if (this.webSocketServer.clients.size > 1) {
                        switch (message.type) {
                            case enums_1.ServerMessageTypes.Link:
                                try {
                                    const links = this.createTemporaryLinks(socket, message.payload.amount);
                                    socket.send(enums_1.ServerMessageTypes.Link, { links });
                                }
                                catch (e) {
                                    let errorType;
                                    if (e instanceof error_1.LinkAmountTooHighError) {
                                        errorType = enums_1.ServerMessageTypes.LinkAmountTooHighError;
                                    }
                                    else {
                                        errorType = enums_1.ServerMessageTypes.MaxLinkAmountExceededError;
                                    }
                                    socket.send(errorType, { message: e.message });
                                }
                                break;
                            case enums_1.ServerMessageTypes.Offer:
                                const link = this.getLink(message.payload.linkId);
                                if (link !== undefined) {
                                    link.answerer.send(enums_1.ServerMessageTypes.Offer, message.payload);
                                }
                                else {
                                    socket.sendWrongOrExpiredLinkError(message.payload.linkId);
                                }
                                break;
                            case enums_1.ServerMessageTypes.Answer: {
                                const link = this.getLink(message.payload.linkId);
                                if (link !== undefined) {
                                    link.offerer.send(enums_1.ServerMessageTypes.Answer, message.payload);
                                }
                                else {
                                    socket.sendWrongOrExpiredLinkError(message.payload.linkId);
                                }
                                break;
                            }
                            case enums_1.ServerMessageTypes.Candidate: {
                                const link = this.getLink(message.payload.linkId);
                                if (link !== undefined) {
                                    const target = link.offerer === socket ? link.answerer : link.offerer;
                                    target.send(enums_1.ServerMessageTypes.Candidate, message.payload);
                                }
                                else {
                                    socket.sendWrongOrExpiredLinkError(message.payload.linkId);
                                }
                                break;
                            }
                            case enums_1.ServerMessageTypes.Complete: {
                                this.deleteLink(message.payload.linkId, socket);
                            }
                            default:
                                socket.sendWrongMessageTypeError();
                                break;
                        }
                    }
                    else {
                        socket.sendEmptServerError();
                    }
                }
                catch (e) {
                    socket.sendWrongMessageFormatError();
                }
            }
        });
    }
    getRandomConnections(socket, amount) {
        const connectionSamples = lodash_1.sampleSize([...this.webSocketServer.clients], amount + 1);
        return connectionSamples.filter((ws) => !socket.areEqual(ws))
            .filter((_, index) => index < amount)
            .map(ws => new serverSocket_1.default(ws));
    }
    createTemporaryLinks(offerer, amount) {
        const randomConnection = this.getRandomConnections(offerer, amount);
        if (!this.linkByConnection.has(offerer)) {
            if (amount > this.linkServerConfig.maxLinkByConnections) {
                throw new error_1.LinkAmountTooHighError(`Link amount can't exceed ${this.linkServerConfig.maxLinkByConnections}`);
            }
            this.linkByConnection.set(offerer, 0);
        }
        const crrAmount = this.linkByConnection.get(offerer);
        if (crrAmount + amount <=
            this.linkServerConfig.maxLinkByConnections) {
            return randomConnection.map(serverSocket => {
                const linkId = Math.random()
                    .toString(36);
                const lifespanTimeout = setTimeout(() => {
                    this.linkByConnection.set(offerer, this.linkByConnection.get(offerer) - 1);
                    delete this.links[linkId];
                }, this.linkServerConfig.linkTimespan);
                const newLink = {
                    linkId,
                    offerer,
                    answerer: serverSocket,
                    timeout: lifespanTimeout
                };
                this.links[linkId] = newLink;
                this.linkByConnection.set(offerer, crrAmount + amount);
                return linkId;
            });
        }
        else {
            throw new error_1.MaxLinkAmountExceededError(`Can't exceed ${this.linkServerConfig.maxLinkByConnections} simultaneous links.`);
        }
    }
    getLink(linkId) {
        return this.links[linkId];
    }
    deleteLink(linkId, socket) {
        if (linkId in this.links) {
            this.linkByConnection.set(socket, this.linkByConnection.get(socket) - 1);
            clearTimeout(this.links[linkId].timeout);
            delete this.links[linkId];
        }
    }
}
exports.default = ConnectionLinkServer;
//# sourceMappingURL=connectionLinkServer.js.map