import { AuthServerInternalError, InvalidUserAuthorities, InvalidUserToken, NoTokenFoundError } from "./exceptions";

export default async function validateToken(token : string | undefined)
{
    let error;
    let tokenData : {role : string, username : string};
    if(token)
    {
        await requestAuth(token).then
        (
            res => 
                res.json().then
                (
                    body => 
                    {
                        if(body.hasOwnProperty("active") && body.active)
                            if(body.hasOwnProperty("authorities") && body.hasOwnProperty("user_name"))
                                tokenData = {role : body.authorities[0], username : body.user_name}
                            else error = new InvalidUserAuthorities();
                        else error = new InvalidUserToken();
                    },
                    err => {error = new AuthServerInternalError()}
                ),
            err => {error = new AuthServerInternalError()}
        )
    } else error = new NoTokenFoundError();

    if(error) throw error;
    else return tokenData!;
}

async function requestAuth(token : string)
{
    let result = await fetch(`${process.env.NEXT_PUBLIC_ms_auth_host}/oauth/check_token`,
    { 
        method : 'POST',
        headers: 
        {
            "Authorization":    `Basic ${process.env.NEXT_PUBLIC_clients_key}`,
            "Content-Type":     "application/x-www-form-urlencoded",
            "Accept":           "application/json",
        },
        body:`token=${token}`,
        mode : 'cors'}
    )
    return result
}
