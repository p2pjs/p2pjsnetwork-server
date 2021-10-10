"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const connectionLinkServer_1 = __importDefault(require("./connectionLinkServer"));
const connectionServer = new connectionLinkServer_1.default(config_1.webSocketServerConfig, config_1.linkServerConfig);
connectionServer.init();
//# sourceMappingURL=index.js.map