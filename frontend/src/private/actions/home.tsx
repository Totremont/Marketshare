'use server'
import { ACCESS_TOKEN } from "@/middleware";
import { cookies } from "next/headers";

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
export async function findAllUsersByRole(role : string)
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