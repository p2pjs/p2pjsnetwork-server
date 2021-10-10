export enum ServerMessageTypes {
  Link = "LINK",
  Offer = "OFFER",
  Answer = "ANSWER",
  Candidate = "CANDIDATE",
  Complete = "COMPLETE",
  EmptyServerError = "EMPTY_SERVER_ERROR",
  WrongOrExpiredLinkError = "WRONG_OR_EXPIRED_LINK_ERROR",
  WrongMessageFormatError = "WRONG_MESSAGE_FORMAT_ERROR",
  WrongMessageTypeError = "WRONG_MESSAGE_TYPE_ERROR",
  LinkAmountTooHighError = "LINK_AMOUNT_TOO_HIGH_ERROR",
  MaxLinkAmountExceededError = "MAX_LINK_AMOUNT_EXCEEDED_ERROR"
};