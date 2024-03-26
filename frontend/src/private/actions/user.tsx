'use server'

import { ACCESS_TOKEN } from "@/middleware";
import { cookies } from "next/headers";

export async function findUserById(id : string)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    let req = await fetch(`${process.env.NEXT_PUBLIC_ms_usuarios_host}/api/users/${id}`,
    { method : 'GET',
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
        res => {if(res.ok) return res.json(); else throw new Error(`Request for user resolved to ${res.status}`)  },
        err => {throw err}
    )

    return req;

}