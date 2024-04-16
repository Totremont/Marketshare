'use server'

import { ACCESS_TOKEN } from "@/middleware";
import { cookies } from "next/headers";
import { RequestStatus } from "../utils/requests";

//api/orders?seller_id=xxx
//Includes reviews
export async function findOrdersFromSellerSSA(sellerId : string)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    return fetch(`${process.env.NEXT_PUBLIC_ms_pedidos_host}/api/orders?seller_id=${sellerId}`,
        { 
            method : 'GET',
            mode : 'cors',
            headers: 
            {
            "Authorization":    `Bearer ${token}`,
            },
        }
    )
    .then
    (
        res => {
            if(res.ok) return res.json() 
            else if(res.status === RequestStatus.NOT_FOUND) return []; 
            else throw new Error(`Request for orders resolved to ${res.status}`)  },
        err => {throw err}
    )

}


//api/reviews?seller_id=xxx
export async function findReviewsFromClientSSA(sellerId : string)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    return fetch(`${process.env.NEXT_PUBLIC_ms_pedidos_host}/api/reviews?client_id=${sellerId}`,
        { 
            method : 'GET',
            mode : 'cors',
            headers: 
            {
            "Authorization":    `Bearer ${token}`,
            },
        }
    )
    .then
    (
        res => {
            if(res.ok) return res.json() 
            else if(res.status === RequestStatus.NOT_FOUND) return []; 
            else throw new Error(`Request for reviews resolved to ${res.status}`)  },
        err => {throw err}
    )

}

export async function createOrderSSA(data : 
    {clientId : number, sellerId : number, productId : number, 
        amount : number, discount : number, finalPrice : number, extras : string})
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    const order = {
        clientId : data.clientId,
        sellerId : data.sellerId,
        productId : data.productId,
        amount : data.amount,
        discount : data.discount,  
        finalPrice : data.finalPrice,
        product_extras : data.extras
    }
    return fetch(`${process.env.NEXT_PUBLIC_ms_pedidos_host}/api/orders`,
        { 
            method : 'POST',
            mode : 'cors',
            headers: 
            {
                "Authorization":    `Bearer ${token}`,
            },
            body: JSON.stringify(order)
        }
    )
    .then
    (
        res => {
            if(res.ok) return res.json() 
            else throw new Error(`Request to create order resolved to ${res.status}`)  },
        err => {throw err}
    )
}

export async function cancelOrderSSA(orderId : number)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    return fetch(`${process.env.NEXT_PUBLIC_ms_pedidos_host}/api/orders/update?id=${orderId}`,
        { 
            method : 'PUT',
            mode : 'cors',
            headers: 
            {
                "Authorization":    `Bearer ${token}`,
            }
        }
    )
    .then
    (
        res => {
            if(res.ok) return res.json() 
            else throw new Error(`Request to cancel order resolved to ${res.status}`)  },
        err => {throw err}
    )
}

export async function sendReviewSSA(initialState : {title : string}, formData : FormData)
{
    //review : {orderId : string, rating : number, title : string, summary : string}
    const orderId = formData.get('orderId')?.toString();
    const rating = formData.get('rating')?.toString();
    const title = formData.get('title')?.toString();
    const summary = formData.get('summary')?.toString();
    
    const token = cookies().get(ACCESS_TOKEN)?.value;

    return fetch(`${process.env.NEXT_PUBLIC_ms_pedidos_host}/api/reviews`,
        { 
            method : 'POST',
            mode : 'cors',
            headers: 
            {
                "Authorization":    `Bearer ${token}`,
            },
            body: JSON.stringify({orderId,rating,title,summary})
        }
    )
    .then
    (
        res => 
        {
            if(res.ok) return {title : 'SUCCESSFUL'};
            else return {title : 'SERVER_ERROR'};
        },
        err => {return {title : 'REQUEST_ERROR'};}
    )
}
