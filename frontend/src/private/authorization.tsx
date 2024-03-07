import { redirect } from "next/navigation";
import { AuthServerInternalError, InvalidUserAuthorities, InvalidUserToken, NoTokenFoundError } from "./exceptions";

export default async function validateToken(token : string | undefined)
{
    let error;
    let userData : {role : string, username : string} | void
    if(token)
    {
        userData = await requestAuth(token).then(
            async (res) => 
            {
                let body = await res.json();
                if(body.hasOwnProperty("active") && body.active)
                    if(body.hasOwnProperty("authorities") && body.hasOwnProperty("user_name"))
                        return {role : body.authorities, username : body.username}
                    else error = new InvalidUserAuthorities();
                else error = new InvalidUserToken();
            },
            (err) => {err = new AuthServerInternalError()}
        )
    } else error = new NoTokenFoundError();

    if(error) throw error;
    else return userData!;
}

async function requestAuth(token : string)
{
    let result = await fetch('http://localhost:8020/oauth/check_token',
    { 
        method : 'POST',
        headers: 
        {
            "Authorization":    "Basic cHJ1ZWJhOmRhbg==",
            "Content-Type":     "application/x-www-form-urlencoded",
            "Accept":           "application/json",
        },
        body:`token=${token}`,
        mode : 'cors'}
    )
    return result
}
