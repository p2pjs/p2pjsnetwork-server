import { Server } from 'ws';
import SocketHandler from './socket';
import Link from './link';
export default class ConnectionServer extends Server {
    private links;
    getRandomConnection(ws: SocketHandler): SocketHandler;
    createTemporaryLink(offerer: SocketHandler): Link;
    getLink(linkId: string): Link | undefined;
    deleteLink(linkId: string): void;
}
