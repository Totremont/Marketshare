'use server'

import { ACCESS_TOKEN } from "@/middleware";
import { cookies } from "next/headers";

/* This must be client fetches */

export async function findUser(username : string)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    return fetch(`${process.env.NEXT_PUBLIC_ms_usuarios_host}/api/users?username=${username}`,
        { 
            method : 'GET',
            mode : 'cors',
            headers: 
            {
            "Authorization":    `Basic ${process.env.NEXT_PUBLIC_clients_key}`,
            //"Content-Type":     "application/x-www-form-urlencoded",
            "Accept":           "application/json",
            },
        }
    )
    .then
    (
    res => {if(res.ok) return res.json(); else throw new Error(`Request for user by username resolved to ${res.status}`)  },
    err => {throw err}
    )

    
}

//Si soy un vendedor, me interesa obtener los compradores y viceversa
export async function findAllUsersByOppositeRole(role : string)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    let userRole;
    if(role === 'ROLE_VENDEDOR') userRole = 'ROLE_COMPRADOR'
    else userRole = 'ROLE_VENDEDOR';
    //Wait 2 seconds
    let wait = await new Promise((res,_) => {setTimeout(() => res(123),2000)});
    return fetch(`${process.env.NEXT_PUBLIC_ms_usuarios_host}/api/users/list?role=${userRole}`,
    { 
        method : 'GET',
        mode : 'cors',
        headers: 
        {
        "Authorization":    `Bearer ${token}`,
        //"Content-Type":     "application/x-www-form-urlencoded",
        "Accept":           "application/json",
        },
    }
    ).then
    (
        res => {if(res.ok) return res.json(); else throw new Error(`Request for users by role resolved to ${res.status}`)  },
        err => {throw err}
    )

}

//Mis productos si soy vendedor | Todos si soy comprador || Primeros 6
export async function findAllProducts()
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    return fetch(`${process.env.NEXT_PUBLIC_ms_productos_host}/api/products/list?send_images=true`,
        { 
            method : 'GET',
            mode : 'cors',
            headers: 
            {
            "Authorization":    `Bearer ${token}`,
            //"Content-Type":     "application/x-www-form-urlencoded",
            "Accept":           "multipart/form-data",
            },
        }
    )
    .then
    (
        res => {if(res.ok) return res.formData(); else throw new Error(`Request for products resolved to ${res.status}`)  },
        err => {throw err}
    )

}

//Mis ordenes (comprador o vendedor)
export async function findAllOrdersByRole(role : string, id : string)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    let request = (pathQuery : string, additionalQuery = '') => 
        fetch(`${process.env.NEXT_PUBLIC_ms_pedidos_host}/api/orders?${pathQuery}${additionalQuery ? '&' + additionalQuery : ''}`,
        { 
            method : 'GET',
            mode : 'cors',
            headers: 
            {
            "Authorization":    `Bearer ${token}`,
            //"Content-Type":     "application/x-www-form-urlencoded",
            "Accept":           "application/json",
            },
        }
    );
    try
    {
        switch(role)
        {
            case 'ROLE_COMPRADOR':
            {
                let req = await request(`client_id=${id}`);
                if(req.ok) return req.json();
                else throw new Error(`Request for orders resolved to ${req.status}`);
            }
            case 'ROLE_VENDEDOR':
            {
                let req = await request(`seller_id=${id}`);
                if(req.ok) return req.json();
                else throw new Error(`Request for orders resolved to ${req.status}`);
            }
            default:
                throw new Error(`Invalid role type while requesting orders`);
        }
    } catch(e){throw e};

}