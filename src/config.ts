import { ServerOptions } from "ws";
import { LinkServerConfig } from "./connectionLinkServer";

export const webSocketServerConfig: ServerOptions = {
  port: 7070
};

export const linkServerConfig: LinkServerConfig = {
  linkTimespan: 6000,
  maxLinkByConnections: 5
};