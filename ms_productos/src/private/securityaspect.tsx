import RequestStatus from "./mappers/RequestStatus";

export default async function validate(auth : string | null)
{
    let type = "Bearer ";
    const token : string | undefined = auth?.substring(type.length);
    console.log(token);
    if(!token) return new Response('No credentials found', {status: RequestStatus.BAD_REQUEST})

    try 
    {
        let response = await request(token);
        if(response.status != RequestStatus.OK) 
            return new Response("Can't reach autentication server", {status: RequestStatus.INTERNAL})

        let body = await response.json()
        if(!(body.hasOwnProperty("active") && body.active == true)) 
            return new Response('Invalid credentials', {status: RequestStatus.UNAUTHORIZED})

    } catch(e : any)
    {
        return new Response("Can't reach autentication server", {status: RequestStatus.INTERNAL})
    }
    

}

async function request(token : string)
{
    let result = await fetch(`${process.env.auth_server_host}/oauth/check_token`,
    { 
        method : 'POST',
        headers: 
        {
            "Authorization":    `Basic ${process.env.clients_key}`,
            "Content-Type":     "application/x-www-form-urlencoded",
            "Accept":           "application/json",
        },
        body:`token=${token}`,
        mode : 'cors'}
    )
    return result
}