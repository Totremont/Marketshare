
import {Channel, Message, connect} from "amqplib/callback_api.js"
import { sendAccountChanged, sendGreetings, sendOrderCancelled, sendOrderCreated, sendOrderDelivered } from "./message_service"
import { queues } from "./utils";
import 'dotenv/config';
import { exit } from "process";

let active_connections = 0;

const exchange = process.env.EXCHANGE_NAME!;

let total_messages = 0;

/*Handles queues and messages*/
function init()
{
    connect(process.env.BROKER_HOST!, 
    function(error0, connection) 
    {
        //If connection failed abort the process
        if (error0) {console.log("Connection with rabbitmq failed. Aborting..."); throw error0;}

        active_connections++;
        console.log(`A new connection with rabbitmq has been established. [${active_connections}] are active`);

        connection.createChannel(function(error1, channel) 
        {
            //If channel failed, abort because we are unable to use the API
            if (error1) {throw error1;}

            //Create queues
            handleChannel(channel,queues.account_new);
            handleChannel(channel,queues.account_changed);
            handleChannel(channel,queues.order_cancelled);
            handleChannel(channel,queues.order_created);
            handleChannel(channel,queues.order_delivered);
          
        });
    });
}

//In automatic acknowledgement mode, a message is considered to be successfully delivered immediately after it is sent (sent to their TCP socket but not necessarily consumed by the process)
function handleChannel(channel : Channel, key: string)
{
    //Assert methods make sure they are created before using
    channel.assertExchange(exchange, 'direct', {durable: true});

    //Anonymous queue. The name is not important as we use the binding key.
    channel.assertQueue('', {durable: true}, 
        function(error2, q) 
        {
            if (error2) { console.log(`ERROR from [${key}] : ${error2}`) }
            else
            {
                console.log(`SUCCESS from [${key}] : listening`)

                channel.bindQueue(q.queue, exchange, key);

                //Acks after onMessage returns. noAck = Automatic Ack
                channel.consume(q.queue, (msg) => { if(msg) {onMessage(msg,key); channel.ack(msg); } }, {noAck: false});
            }
        }
    );
}

async function onMessage(msg : Message, key : string)
{
    const action = async () => 
    {
        const raw = JSON.parse(msg.content.toString());
        switch(key)
        {
            case queues.account_new:
                const data : {receiver : string, name : string, accountType : string} = raw;
                await sendGreetings(data);
                break;

            case queues.order_created:
                const data2 : 
                {
                    receiver : string, 
                    name : string, 
                    details : {data : string, value : string}[], 
                    cancelLink : string
                } = raw;
                await sendOrderCreated(data2);
                break;

            case queues.order_cancelled:
                const data3 :
                {
                    receiver : string, 
                    name : string
                    details : {data : string, value : string}[]
                } = raw;
                await sendOrderCancelled(data3);
                break;
            
            case queues.order_delivered:
                const data4 : 
                {
                    receiver : string, 
                    name : string
                    details : {data : string, value : string}[], 
                    reviewLink : string
                } = raw;
                await sendOrderDelivered(data4);
                break;
            
            case queues.account_changed:
                const data5 : {receiver : string} = raw;
                await sendAccountChanged(data5);
                break;
            
            default:
                console.log(`Received message with invalid key: [${key}]`);
                break;

        }
    }  
    try
    {
        await action();
        total_messages++;
        console.log(`Successful messages: ${total_messages}`);
    } 
    catch(e : any)  //Silently remove the message
    {
        console.log(`Couldn't handle a message: ${e}`);
    }
}

//Begin
init();
