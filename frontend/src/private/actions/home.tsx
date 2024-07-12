'use server'
import { ACCESS_TOKEN } from "@/middleware";
import { cookies } from "next/headers";
import { RequestStatus } from "../utils/requests";

export async function findUserByUsernameSSA(username : string)
{
    //const token = cookies().get(ACCESS_TOKEN)?.value;
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
export async function findAllUsersByRoleSSA(role : string)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    return fetch(`${process.env.NEXT_PUBLIC_ms_usuarios_host}/api/users/list?role=${role}`,
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
        res => 
        { 
            if(res.ok) return res.json(); else if(res.status === RequestStatus.NOT_FOUND) return [];
            else throw new Error(`Request for users by role resolved to ${res.status}`)  
        },
        err => {throw err}
    )

}

//Mis productos si soy vendedor | Todos si soy comprador || Primeros 6
export async function findAllProductsSSA(sendImages : boolean = true)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    return fetch(`${process.env.NEXT_PUBLIC_ms_productos_host}/api/products/list?send_images=${sendImages}`,
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
        res => 
        {
            if(res.ok) return res.formData(); 
            else if(res.status === RequestStatus.NOT_FOUND) return null;
            else throw new Error(`Request for products resolved to ${res.status}`)  
        },
        err => {throw err}
    )

}

//Client id or Seller id
export async function findAllOrdersByRoleSSA(role : string, id : string)
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

export async function findAllOrdersSSA()
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    return fetch(`${process.env.NEXT_PUBLIC_ms_pedidos_host}/api/orders/list`,
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
        res => {if(res.ok) return res.json(); else throw new Error(`Request for orders list resolved to ${res.status}`)},
        err => {throw err}
    )
}