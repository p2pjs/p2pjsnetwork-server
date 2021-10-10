/// <reference types="node" />
import SocketHandler from './socket';
export default interface Link {
    linkId: string;
    offerer: SocketHandler;
    answerer: SocketHandler;
    timeout: NodeJS.Timeout;
}
