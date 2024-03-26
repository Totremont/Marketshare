'use server'

import { ACCESS_TOKEN } from "@/middleware";
import { cookies } from "next/headers";
import { RequestStatus } from "../utils/requests";

//api/orders?seller_id=xxx
export async function findOrdersFromSeller(sellerId : string, countOnly : boolean)
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
export async function findReviewsFromSeller(sellerId : string)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    return fetch(`${process.env.NEXT_PUBLIC_ms_pedidos_host}/api/reviews?seller_id=${sellerId}`,
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