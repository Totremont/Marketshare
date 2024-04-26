'use server'

import { ACCESS_TOKEN } from "@/middleware";
import { cookies } from "next/headers";

export async function findUserByIdSSA(id : string)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    let req = await fetch(`${process.env.NEXT_PUBLIC_ms_usuarios_host}/api/users/${id}`,
    { 
        method : 'GET',
        mode : 'cors',
        headers: 
        {
        "Authorization":    `Bearer ${token}`,
        "Accept":           "application/json",
        },
    }
    ).then
    (
        res => {if(res.ok) return res.json(); else throw new Error(`Request for user resolved to ${res.status}`)  },
        err => {throw err}
    )

    return req;

}

export async function updateUserSSA(newUser : any )
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    let req = await fetch(`${process.env.NEXT_PUBLIC_ms_usuarios_host}/api/users`,
    { 
        method : 'PUT',
        mode : 'cors',
        headers: 
        {
            "Authorization":    `Bearer ${token}`,
            "Accept":           "application/json",
            "Content-Type":     "application/json"
        },
        body : JSON.stringify(newUser)
    }
    ).then
    (
        res => {if(res.ok) return res.json(); else throw new Error(`Request to update user resolved to ${res.status}`)  },
        err => {throw err}
    )

    return req;
}