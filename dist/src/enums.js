"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerMessageTypes = void 0;
var ServerMessageTypes;
(function (ServerMessageTypes) {
    ServerMessageTypes["Link"] = "LINK";
    ServerMessageTypes["Offer"] = "OFFER";
    ServerMessageTypes["Answer"] = "ANSWER";
    ServerMessageTypes["Candidate"] = "CANDIDATE";
    ServerMessageTypes["Complete"] = "COMPLETE";
    ServerMessageTypes["EmptyServerError"] = "EMPTY_SERVER_ERROR";
    ServerMessageTypes["WrongOrExpiredLinkError"] = "WRONG_OR_EXPIRED_LINK_ERROR";
    ServerMessageTypes["WrongMessageFormatError"] = "WRONG_MESSAGE_FORMAT_ERROR";
    ServerMessageTypes["WrongMessageTypeError"] = "WRONG_MESSAGE_TYPE_ERROR";
    ServerMessageTypes["LinkAmountTooHighError"] = "LINK_AMOUNT_TOO_HIGH_ERROR";
    ServerMessageTypes["MaxLinkAmountExceededError"] = "MAX_LINK_AMOUNT_EXCEEDED_ERROR";
})(ServerMessageTypes = exports.ServerMessageTypes || (exports.ServerMessageTypes = {}));
;
//# sourceMappingURL=enums.js.map