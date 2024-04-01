'use server'
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ROLE } from "@/middleware";
import { cookies } from 'next/headers'
import { RedirectType, redirect } from 'next/navigation'
import validateToken from "../authorization";

//SSA = Server side action
export async function requestTokenSSA(initialState : {title : string}, formData : FormData)
{
    let successful = false;
    const username = formData.get('user')?.toString();
    const password = formData.get('pass')?.toString();
    //let userRole = formData.get('role')?.toString();
    try
    {
        const req = await fetch(`${process.env.NEXT_PUBLIC_ms_auth_host}/oauth/token`,
            { 
                method : 'POST',
                mode : 'cors',
                headers: 
                {
                    "Authorization":    `Basic ${process.env.NEXT_PUBLIC_clients_key}`,
                    "Content-Type":     "application/x-www-form-urlencoded",
                    "Accept":           "application/json"
                },
                body: `grant_type=password&scope=user&username=${username}&password=${password}`
            }
        )
        if(req.ok)
        {
            let {access_token, refresh_token} = await req.json();
            cookies().set({
                name: ACCESS_TOKEN,
                value: access_token,
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            })
            cookies().set({
                name: REFRESH_TOKEN,
                value: refresh_token,
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            })
            //if(!userRole) userRole = await validateToken(access_token).role;
            /*
            cookies().set({
                name: USER_ROLE,
                value: userRole,
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            })
            */
            successful = true;
            return {title : 'SUCCESS'}
        }
        else{
            return {title : 'AUTH_ERROR'}
        }
    }
    catch(e)
    {
        cookies().getAll().forEach(cookie => cookies().delete(cookie.name));
        return {title : 'REQUEST_ERROR'}
    }
    finally
    {
        if(successful) redirect('/home',RedirectType.replace);
    }
}

export async function createUserSSA(initialState : any, formData : FormData)
{
    let requestToken = false;
    try{
        let nameStatus = await checkUsernameIsAvailable(formData.get('user')!.toString());
        if(nameStatus.title === 'USERNAME_TAKEN') return nameStatus;
        
        let req = await fetch(`${process.env.NEXT_PUBLIC_ms_usuarios_host}/api/users`,
        { 
            method : 'POST',
            mode : 'cors',
            headers: 
            {
                "Authorization":    `Basic ${process.env.NEXT_PUBLIC_clients_key}`,
                "Content-Type":     "application/json",
                "Accept":           "application/json"
            },
            body: JSON.stringify(
                {
                    name : formData.get('user'),
                    password : formData.get('pass'),
                    country : formData.get('country'),
                    type : formData.get('role'),
                    email : formData.get('email'),
                    organization : formData.get('organization'),
                    bank : formData.get('bank'),
                    money : formData.get('money')
                })
        }
        )
        if(!req.ok) return {title : 'USER_CREATION_ERROR'};
        else requestToken = true;
    } 
    catch(e)
    {
        console.log(e);
        return {title : 'REQUEST_ERROR'};
    }
    finally //Hay que sacar el redirect del try-catch
    {
        if(requestToken) return await requestTokenSSA({title:''},formData);
    }
}

async function checkUsernameIsAvailable(username : string)
{

    let req = await fetch(`${process.env.NEXT_PUBLIC_ms_usuarios_host}/api/users?username=${username}`,
    { method : 'GET',
        mode : 'cors',
        headers: 
        {
        "Authorization":    `Basic ${process.env.NEXT_PUBLIC_clients_key}`,
        //"Content-Type":     "application/x-www-form-urlencoded",
        "Accept":           "application/json",
        },
    }
    );
    if(req.ok) return {title : 'USERNAME_TAKEN'}
    else return {title : 'USERNAME_AVAILABLE'}

}