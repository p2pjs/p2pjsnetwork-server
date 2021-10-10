/// <reference types="node" />
import { ServerOptions } from 'ws';
import ServerSocket from './serverSocket';
export interface Link {
    linkId: string;
    offerer: ServerSocket;
    answerer: ServerSocket;
    timeout: NodeJS.Timeout;
}
export interface LinkServerConfig {
    linkTimespan: number;
    maxLinkByConnections: number;
}
export default class ConnectionLinkServer {
    private readonly serverConfig;
    private readonly linkServerConfig;
    private links;
    private linkByConnection;
    private webSocketServer?;
    constructor(serverConfig: ServerOptions, linkServerConfig: LinkServerConfig);
    init(): void;
    private hadleNewConnections;
    private getRandomConnections;
    private createTemporaryLinks;
    private getLink;
    private deleteLink;
}
