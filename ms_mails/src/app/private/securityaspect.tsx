import RequestStatus from "./RequestStatus";

export default async function validate(auth : string | null)
{
    let token;
    let type = "Bearer ";
    token = auth?.substring(type.length);
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