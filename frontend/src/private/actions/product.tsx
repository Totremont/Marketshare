'use server'

import { ACCESS_TOKEN } from "@/middleware"
import { cookies } from "next/headers"


export async function createProductSSA(initialState : {title : string, id : number}, 
    formData : FormData)
{
    const token = cookies().get(ACCESS_TOKEN)?.value;   
    if(!token) return {title : 'TOKEN_NOT_FOUND', id : -1};  //Fast fault

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
            async res => 
            {
                if(res.ok)
                {
                    const form = await res.formData();
                    const productId = form.get('id');
                    return {title : 'SUCCESS', id : Number(productId?.valueOf())};
                }  
                else return {title : 'SERVER_ERROR', id : -1} 
            },
            err => {return {title : 'REQUEST_ERROR', id : -1}}
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
            async res => 
                {
                    if(res.ok)
                    {
                        const form = await res.formData();
                        const productId = form.get('id');
                        return {title : 'SUCCESS', id : productId};
                    }  
                    else return {title : 'SERVER_ERROR', id : -1} 
                },
                err => {return {title : 'REQUEST_ERROR', id : -1}}
        ); 
    } 
}  

//api/products/{id}
export async function findProductByIdSSA(id : string, sendImages = true)
{
    const response : {success : boolean, message?: string, form?: FormData } = {success : false};

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
        async res => 
        {
            if(res.ok)
            {
                response.success = true;
                response.form = await res.formData();
            }
            else
            {
                response.success = false;
                response.message = `Request for products resolved to ${res.status}`;
                console.log(response.message);
            }
            return response;
        },
        err => 
        {
            response.success = false;
            response.message = `Request for products resolved to ${err.message}`;
            console.log(response.message);
            return response;
        }
    )

}