'use server'

import { ACCESS_TOKEN } from "@/middleware"
import { cookies } from "next/headers"


export async function createProductSSA(initialState : any, 
    formData : FormData)
{
    
    console.log(formData.getAll('files'));
    console.log(`Se ejecutó el backend con:
    Cookies: ${cookies().get(ACCESS_TOKEN)?.value}
    Form: ${JSON.stringify(formData.entries())}
    initialState: ${initialState.title}`);
    
    const token = cookies().get(ACCESS_TOKEN)?.value;
    
    if(!token) return {title : 'TOKEN_NOT_FOUND'};  //Fast fault
    try
    {
        const req = await fetch(`${process.env.NEXT_PUBLIC_ms_productos_host}/api/products`,
                { 
                    method : 'POST',
                    mode : 'cors',
                    headers: 
                    {
                        "Authorization":    `Bearer ${token}`,
                        "Accept":           "multipart/form-data"
                    },
                    body: formData
                }
        )
        console.log("Request: " + req.status);
        if(req.ok) return {title : 'SUCCESS'};
        else return {title : 'SERVER_ERROR'};
    } catch(e){return {title : 'REQUEST_ERROR'}}
    
    
}  