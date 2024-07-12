
import {Channel, Message, connect} from "amqplib/callback_api.js"
import { Queues } from "./MessageType";
import { sendAccountChanged, sendGreetings, sendOrderCancelled, sendOrderCreated, sendOrderDelivered } from "./MessageService";

/*Handles queues and messages*/
export function init()
{
    connect(process.env.BROKER_HOST!, 
    function(error0, connection) 
    {
        //If connection failed abort the process
        if (error0) {throw error0;}

        connection.createChannel(function(error1, channel) 
        {
            //If channel failed, abort because we are unable to use the API
            if (error1) {throw error1;}

            //Create queues
            handleChannel(channel,Queues.ACCOUNT_NEW!);
            handleChannel(channel,Queues.ACCOUNT_CHANGED!);
            handleChannel(channel,Queues.ORDER_CANCELLED!);
            handleChannel(channel,Queues.ORDER_CREATED!);
            handleChannel(channel,Queues.ORDER_DELIVERED!);
          
        });
    });
}

//In automatic acknowledgement mode, a message is considered to be successfully delivered immediately after it is sent (sent to their TCP socket but not necessarily consumed by the process)
function handleChannel(channel : Channel, queue: string)
{

    const exchange = process.env.EXCHANGE_NAME!;

    //Assert methods make sure they are created before using

    channel.assertExchange(exchange, 'direct', {durable: false});

    channel.assertQueue(queue, {durable: true}, function(error2, q) 
    {
        if (error2) { console.log(`ERROR from [${queue}] : ${error2}`) }
        else
        {
            console.log(`SUCCESS from [${queue}] : listening`)

            channel.bindQueue(q.queue, exchange, queue);

            //Acks after onMessage returns
            channel.consume(q.queue, (msg) => { if(msg) {onMessage(msg,queue); channel.ack(msg);} }
            , {noAck: false});
        }
    });
}

function onMessage(msg : Message, queue : string)
{
    const action = () => 
    {
        const raw = JSON.parse(msg.content.toString());
        switch(queue)
        {
            case Queues.ACCOUNT_NEW:
                const data : {receiver : string, name : string, accountType : string} = raw;
                sendGreetings(data);
                break;

            case Queues.ORDER_CREATED:
                const data2 : 
                {
                    receiver : string, 
                    name : string, 
                    details : {data : string, value : string}[], 
                    cancelLink : string
                } = raw;
                sendOrderCreated(data2);
                break;

            case Queues.ORDER_CANCELLED:
                const data3 :
                {
                    receiver : string, 
                    name : string
                    details : {data : string, value : string}[]
                } = raw;
                sendOrderCancelled(data3);
                break;
            
            case Queues.ORDER_DELIVERED:
                const data4 : 
                {
                    receiver : string, 
                    name : string
                    details : {data : string, value : string}[], 
                    reviewLink : string
                } = raw;
                sendOrderDelivered(data4);
                break;
            
            case Queues.ACCOUNT_CHANGED:
                const data5 : {receiver : string} = raw;
                sendAccountChanged(data5);
                break;
            
            default:
                console.log(`Received message from unknown queue: [${queue}]`);
                break;

        }
    }  
    try
    {
        action();
    } 
    catch(e : any)  //Silently remove the message
    {
        console.log(`Couldn't handle a message`);
    }
}
