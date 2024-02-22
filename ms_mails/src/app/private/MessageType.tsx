
export default class MessageType
{
    static NEW_ACCOUNT = 0;
    static ORDER_CREATED = 1;   //Para compradores y vendedores
    static ORDER_DELIVERED = 2;
    static ORDER_CANCELLED = 3;
    static ACCOUNT_CHANGED = 4;
    
}

export function toMessageType(type : string) : number
{
    switch(type.toUpperCase())
    {
        case "NEW_ACCOUNT":
            return MessageType.NEW_ACCOUNT;
        case "ORDER_CREATED":
            return MessageType.ORDER_CREATED;
        case "ORDER_DELIVERED":
            return MessageType.ORDER_DELIVERED;
        case "ORDER_CANCELLED":
            return MessageType.ORDER_CANCELLED;
        case "ACCOUNT_CHANGED":
            return MessageType.ACCOUNT_CHANGED;
        default:
            return -1;
    }
}