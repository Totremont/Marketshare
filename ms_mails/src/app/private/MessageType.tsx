
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

export class Queues
{
    static ACCOUNT_NEW = process.env.QUEUE_ACCOUNT_NEW;
    static ORDER_CREATED = process.env.QUEUE_ORDER_CREATED;
    static ORDER_CANCELLED = process.env.QUEUE_ORDER_CANCELLED;
    static ORDER_DELIVERED = process.env.QUEUE_ORDER_DELIVERED;
    static ACCOUNT_CHANGED = process.env.QUEUE_ACCOUNT_CHANGED;;
}