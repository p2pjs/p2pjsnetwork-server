"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const socket_1 = __importDefault(require("./socket"));
const lodash_1 = require("lodash");
const config_1 = require("./config");
class ConnectionLinkServer {
  constructor(serverConfig) {
    this.links = {};
    this.serverConfig = serverConfig;
  }
  init() {
    if (!this.webSocketServer) {
      this.webSocketServer = new ws_1.Server(this.serverConfig);
    }
  }
  getRandomConnection(ws) {
    const connectionsamples = lodash_1.sampleSize([...super.clients], 2);
    const randomConnection =
      lodash_1.first(connectionsamples) !== ws.socket
        ? lodash_1.first(connectionsamples)
        : lodash_1.last(connectionsamples);
    return new socket_1.default(randomConnection);
  }
  createTemporaryLink(offerer) {
    const randomConnection = this.getRandomConnection(offerer);
    const linkId = Math.random().toString(36).substr(2);
    const lifespanTimeout = setTimeout(() => {
      delete this.links[linkId];
    }, config_1.NetworkServerConfig.linkTimespan);
    const newLink = {
      linkId,
      offerer,
      answerer: randomConnection,
      timeout: lifespanTimeout,
    };
    this.links[linkId] = newLink;
    return newLink;
  }
  getLink(linkId) {
    return this.links[linkId];
  }
  deleteLink(linkId) {
    if (linkId in this.links) {
      clearTimeout(this.links[linkId].timeout);
      delete this.links[linkId];
    }
  }
}
exports.default = ConnectionLinkServer;
//# sourceMappingURL=webSocketServer.js.map
