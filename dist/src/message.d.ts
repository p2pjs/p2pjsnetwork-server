import { ServerMessageTypes } from "./enums";
export default interface IMessage {
    type: ServerMessageTypes;
    payload: any;
}
