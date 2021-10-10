import WebSocket, { Server, ServerOptions } from 'ws';
import ServerSocket, { IMessage } from './serverSocket';
import { ServerMessageTypes } from './enums';
import { sampleSize } from 'lodash';
import { LinkAmountTooHighError, MaxLinkAmountExceededError } from './error';

interface IDictionary<TValue> {
    [id: string]: TValue | undefined;
}

export interface Link {
  linkId: string,
  offerer: ServerSocket,
  answerer: ServerSocket,
  timeout: NodeJS.Timeout
}

export interface LinkServerConfig {
  linkTimespan: number,
  maxLinkByConnections: number
}

export default class ConnectionLinkServer {
  private readonly serverConfig: ServerOptions;
  private readonly linkServerConfig: LinkServerConfig;

  private links: IDictionary<Link> = {};
  private linkByConnection: WeakMap<ServerSocket, number>;
  private webSocketServer?: Server;

  constructor(serverConfig: ServerOptions, linkServerConfig: LinkServerConfig) {
    this.serverConfig = serverConfig;
    this.linkServerConfig = linkServerConfig;
    this.linkByConnection = new WeakMap<ServerSocket, number>();
  }

  init() {
    if (!this.webSocketServer) {
      this.webSocketServer = new Server(this.serverConfig);
    }
    this.webSocketServer.on('connection', (connection) =>
      this.hadleNewConnections(connection));
  }

  private hadleNewConnections(connection: WebSocket) {
    const socket = new ServerSocket(connection);

    connection.on('close', () => {
      this.linkByConnection.delete(socket);
    });

    connection.on('message', (data) => {
        if (typeof data === 'string') {
          try {
            const message = JSON.parse(data) as IMessage;
            if (this.webSocketServer!.clients.size > 1) {
              switch (message.type) {
                
                case ServerMessageTypes.Link:
                  try {
                    const links = this.createTemporaryLinks(socket, message.payload.amount);
                    socket.send(ServerMessageTypes.Link, { links });
                  } catch (e) {
                    let errorType: ServerMessageTypes;
                    if (e instanceof LinkAmountTooHighError) {
                      errorType = ServerMessageTypes.LinkAmountTooHighError;
                    } else {
                      errorType = ServerMessageTypes.MaxLinkAmountExceededError;
                    }

                    socket.send(errorType, { message: e.message });
                  }
                  break;

                case ServerMessageTypes.Offer:
                  const link = this.getLink(message.payload.linkId);
                  if (link !== undefined) {
                    link.answerer.send(ServerMessageTypes.Offer, message.payload);
                  } else {
                    socket.sendWrongOrExpiredLinkError(message.payload.linkId);
                  }        
                  break;
                
                case ServerMessageTypes.Answer: {
                  const link = this.getLink(message.payload.linkId);
                  if (link !== undefined) {
                    link.offerer.send(ServerMessageTypes.Answer, message.payload);
                  } else {
                    socket.sendWrongOrExpiredLinkError(message.payload.linkId);
                  }
                  break;
                }
                  
                case ServerMessageTypes.Candidate: {
                  const link = this.getLink(message.payload.linkId);
                  if (link !== undefined) {
                    const target = link.offerer === socket ? link.answerer : link.offerer;
                    target.send(ServerMessageTypes.Candidate, message.payload);
                  } else {
                    socket.sendWrongOrExpiredLinkError(message.payload.linkId);
                  }
                  break;
                }
                  
                case ServerMessageTypes.Complete:
                  this.deleteLink(message.payload.linkId, socket);
                break;
                
                default:
                  socket.sendWrongMessageTypeError();
                break;
              }
            }
            else {
              socket.sendEmptServerError();
            }
          } catch(e) {
            socket.sendWrongMessageFormatError();
          }
        }
      });
  }

  private getRandomConnections(socket: ServerSocket, amount: number) : ServerSocket[] {
    const connectionSamples = sampleSize([...this.webSocketServer!.clients], amount + 1);
    return connectionSamples.filter((ws) => !socket.areEqual(ws))
                            .filter((_, index) => index < amount)
                            .map(ws => new ServerSocket(ws));
  }

  private createTemporaryLinks(offerer: ServerSocket, amount: number): string[] {
    const randomConnection = this.getRandomConnections(offerer, amount);
    if (!this.linkByConnection.has(offerer)) {
      if (amount > this.linkServerConfig.maxLinkByConnections) {
        throw new LinkAmountTooHighError(`Link amount can't exceed ${this.linkServerConfig.maxLinkByConnections}`);
      }
      this.linkByConnection.set(offerer, 0)
    }
    const crrAmount = this.linkByConnection.get(offerer)!;
    if (crrAmount + amount <=
        this.linkServerConfig.maxLinkByConnections) {
      return randomConnection.map(serverSocket => {
        const linkId = Math.random()
          .toString(36).substr(2);
        const lifespanTimeout = setTimeout(() => {
          this.linkByConnection.set(offerer,
            this.linkByConnection.get(offerer)! - 1);
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
    } else {
      throw new MaxLinkAmountExceededError(`Can't exceed ${this.linkServerConfig.maxLinkByConnections} simultaneous links.`);
    }
  }

  private getLink(linkId: string) : Link | undefined {
    return this.links[linkId];
  }

  private deleteLink(linkId: string, socket: ServerSocket): void {
    if (linkId in this.links) {
      this.linkByConnection.set(socket,
            this.linkByConnection.get(socket)! - 1);
      clearTimeout(this.links[linkId]!.timeout);
      delete this.links[linkId];
    }
  }
}