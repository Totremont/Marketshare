import 'dotenv/config';

export const colors = 
{
    green : "#8FBC8F",
    yellow: "#F0E68C",
    red: "#CD5C5C"
}

export const queues = 
{
    account_new : process.env.QUEUE_ACCOUNT_NEW!,
    order_created : process.env.QUEUE_ORDER_CREATED!,
    order_delivered : process.env.QUEUE_ORDER_DELIVERED!,
    order_cancelled : process.env.QUEUE_ORDER_CANCELLED!,
    account_changed : process.env.QUEUE_ACCOUNT_CHANGED!
}