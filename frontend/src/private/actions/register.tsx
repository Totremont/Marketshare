'use server'
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ROLE } from "@/middleware";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

//SSA = Server side action
async function requestTokenSSA(username : string, password : string, role : string)
{
    let successful = false;
    try
    {
        console.log(`Requesting token`);
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
        console.log(`Token result: ${req.status}`);
        if(req.ok)
        {
            let {access_token, refresh_token} = await req.json();
            console.log(`Seteamos cookies`);
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
            cookies().set({
                name: USER_ROLE,
                value: role,
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            })
            successful = true;
            return {title : 'SUCCESS'}
        }
        else return {title : 'AUTH_ERROR'}
    }
    catch(e)
    {
        console.log(e);
        return {title : 'REQUEST_ERROR'}
    }
    finally
    {
        if(successful) redirect('/home');
    }
}

export async function createUserSSA(userRole : string, formData : FormData)
{
    try{
        console.log("creating user...");
        let available = await checkUsernameIsAvailable(formData.get('user')!.toString());
        if(available.title === 'USERNAME_TAKEN') return available;
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
                    type : userRole,
                    email : formData.get('email'),
                    organization : formData.get('organization'),
                    bank : formData.get('bank'),
                    money : formData.get('money')
                })
        }
        )
        console.log(`POST a usuario: ${req.status}`);
        if(req.ok) return await requestTokenSSA(formData.get('user')!.toString(),formData.get('pass')!.toString(),userRole);
        else return {title : 'USER_CREATION_ERROR'};
    } catch(e)
    {
        console.log(e);
        return {title : 'REQUEST_ERROR'};
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