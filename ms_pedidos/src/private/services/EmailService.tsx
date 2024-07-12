
//Produces messages that are consumed by ms_emails

import { Pedido } from "@prisma/client";
import {Channel} from "amqplib/callback_api.js"
import { formatDate } from "../utils";
import { connect } from "amqplib";

//Errors are silently logged
var channel : Channel | null = null;    //available on globalScope
let connections_retries = 3;    //If connection to broker fails, retry this many times.

const exchange = process.env.EXCHANGE_NAME!;
let active_connections = 0;

const routingKeys = 
{
    order_created : process.env.QUEUE_ORDER_CREATED!,
    order_delivered : process.env.QUEUE_ORDER_DELIVERED!,
    order_cancelled : process.env.QUEUE_ORDER_CANCELLED!,
}

//Convert to promise-based (signals => processing: 0 ; success: 1 ; failure : -1)
async function init()
{ 
    connections_retries--;
    return connect(process.env.BROKER_HOST!)
    .then(conn => 
    {
        active_connections++;
        console.log(`RabbitMQ: active connections: ${active_connections}`);
        
        return conn.createChannel()
        .then(chan => 
        {
            channel = chan;
            chan.assertExchange(exchange, 'direct', {durable: true});

            console.log("RabbitMQ: channel created");
        })
        .catch
        (
            err => 
            {
                console.log(`RabbitMQ: Couldn't create channel on broker : ${err}`);
                conn.close();
                active_connections--;
            }
        );
    })
    .catch(err => console.log(`Couldn't connect to broker : ${err}`));
    
}

async function sendMessage(msg : any, key : string)
{
    if(!channel)
    {
        if(connections_retries) await init();
        else
        {
            console.log("RabbitMQ: No more retries to connect available");
            return;
        }
        if(!channel) return;     //If connection was not successful
        
    }

    const result = channel?.publish(exchange, key, Buffer.from(JSON.stringify(msg)));
    
    if(!result) console.log(`A message couldn't be published`);
    
}

export function sendOrderCreated(user : {email : string, name : string}, order : Pedido, productName : string)
{
    let template : 
    {
        receiver : string, 
        name : string
        details : {data : string, value : string}[], 
        cancelLink : string
    };

    const details = getOrderDetails(order, productName);

    template = {receiver : user.email, name : user.name, details, cancelLink : 'http://localhost:443'};

    sendMessage(template,routingKeys.order_created);
}

export function sendOrderDelivered(user : {email : string, name : string}, order : Pedido, productName : string)
{
    let template : 
    {
        receiver : string, 
        name : string
        details : {data : string, value : string}[], 
        reviewLink : string
    };

    const details = getOrderDetails(order, productName);

    template = {receiver : user.email, name : user.name, details, reviewLink : 'http://localhost:443'};

    sendMessage(template,routingKeys.order_delivered);
}

export function sendOrderCancelled(user : {email : string, name : string}, order : Pedido, productName : string )
{
    let template : 
    {
        receiver : string, 
        name : string
        details : {data : string, value : string}[]
    };

    const details = getOrderDetails(order, productName);

    template = {receiver : user.email, name : user.name, details};

    sendMessage(template,routingKeys.order_cancelled);
}

function getOrderDetails(order : Pedido, productName : string)
{
    const orderDetails : {data : string, value : string}[] = [];
    const orderStatus = order.status_history[order.status_history.length - 1].status;

    orderDetails.push({data : 'Transacción', value : order.id });
    orderDetails.push({data : 'Fecha de emisión', value : formatDate(order.created.toISOString(),true)});
    orderDetails.push({data : 'Producto', value : productName });
    orderDetails.push({data : 'Cantidad', value : '' + order.amount });
    orderDetails.push({data : 'Situación', value : orderStatus });

    return orderDetails;
}
