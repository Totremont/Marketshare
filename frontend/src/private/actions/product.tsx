'use server'

import { ACCESS_TOKEN } from "@/middleware"
import { cookies } from "next/headers"


export async function createProductSSA(initialState : {title : string}, 
    formData : FormData)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;   
    if(!token) return {title : 'TOKEN_NOT_FOUND'};  //Fast fault

    console.log("Files:" + formData.getAll('files').length)

    if(initialState.title === 'UPDATING')
    {
        return fetch(`${process.env.NEXT_PUBLIC_ms_productos_host}/api/products/update`,
            { 
                method : 'PUT',
                mode : 'cors',
                headers: 
                {
                    "Authorization":    `Bearer ${token}`,
                    "Accept":           "multipart/form-data"
                },
                body: formData
            }
        ).then
        (
            res => {if(res.ok) return {title : 'SUCCESS'}; else return {title : 'SERVER_ERROR'} },
            err => {return {title : 'REQUEST_ERROR'}}
        ) 
    }
    else
    {
        return fetch(`${process.env.NEXT_PUBLIC_ms_productos_host}/api/products`,
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
        ).then
        (
            res => {if(res.ok) return {title : 'SUCCESS'}; else return {title : 'SERVER_ERROR'} },
            err => {return {title : 'REQUEST_ERROR'}}
        ); 
    } 
}  

//api/products/{id}
export async function findProductByIdSSA(id : string, sendImages = true)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;
    return fetch(`${process.env.NEXT_PUBLIC_ms_productos_host}/api/products/${id}?send_images=${sendImages}`,
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