import { NextRequest, NextResponse } from "next/server";
import validateToken from "./private/authorization";
import { InvalidUserToken } from "./private/exceptions";
import { NextURL } from "next/dist/server/web/next-url";

export const ACCESS_TOKEN = "marketshare.user.access-token"
export const REFRESH_TOKEN = "marketshare.user.refresh-token"
export const USER_ROLE = "marketshare.user.user-role"

const ACCESS_TOKEN_MAX_AGE = 7;     //In days
const REFRESH_TOKEN_MAX_AGE = 31;

export const USERNAME_HEADER = "X-USER-NAME";
export const USER_ROLE_HEADER = "X-USER-ROLE";

export const ROLE_COMPRADOR = 'ROLE_COMPRADOR';
export const ROLE_VENDEDOR = 'ROLE_VENDEDOR';
export const ROLE_VISITANTE = 'ROLE_VISITANTE'

//¿Quién puede acceder a cada endpoint? | Expresiones regulares
const obj_endpoints = 
{
    '/$'                     : [ROLE_VISITANTE],
    '/register$'             : [ROLE_VISITANTE],
    '/home$'                 : [ROLE_COMPRADOR, ROLE_VENDEDOR],
    '/product/create$'       : [ROLE_VENDEDOR],
    '/product/\\d+$'         : [ROLE_COMPRADOR, ROLE_VENDEDOR, ROLE_VISITANTE],

}

const list_endpoints = Object.getOwnPropertyNames(obj_endpoints).map(it => 
    {
        return {regex : new RegExp(it), auths : obj_endpoints[it as keyof typeof obj_endpoints]}
    }
);


export async function middleware(request: NextRequest) 
{  
    
    const accessToken  = request.cookies.get(ACCESS_TOKEN)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value;

    const currentUrl = request.nextUrl;

    console.log("Sección middleware, inicio");
    //Todas las requests exitosas envian username y userrole por headers
    try
    {
        if(accessToken)
        {
            return await handleSession(currentUrl, {access : accessToken, refresh: refreshToken!},request);
        }       
        else 
        {
            if(refreshToken) return await useRefreshToken(currentUrl,refreshToken,request);
            console.log("No hay token");
            return handleGuest(currentUrl,request);  //Si no hay token, iniciar sesión    
        }   
    }
    catch(e : any)
    {   
        console.log("Sección excepcion exterior");
        //Si hay tokens pero el access expiró, probar refrescando
        if((e instanceof InvalidUserToken) && refreshToken)
        {
            return await useRefreshToken(currentUrl,refreshToken,request);       
        } 
        else return handleGuest(currentUrl,request);
    }
    
    
    
}

//Supplementary methods

async function handleSession(currentUrl : NextURL, tokens : {access : string, refresh : string}, request : NextRequest)
{
    console.log("Sección access-token");
    const endpoint = currentUrl.pathname;
    let {username, role} = await validateToken(tokens.access);
    currentUrl.searchParams.forEach(value => currentUrl.searchParams.delete(value));
    //Los valores van en headers -- para ocultar los path queries
    let res : NextResponse;

    let authKey = {endpointFound : false, roleFound : false};
    testEndpoint(authKey,endpoint,role);
    //Si la página no existe
    if(!authKey.endpointFound) return NextResponse.next();
    if(authKey.endpointFound && !authKey.roleFound)
    {
        console.log("Sección access-token | Redireccionar a /home");
        currentUrl.pathname = '/home';
        res = NextResponse.redirect(currentUrl);
    }   
    else {
        console.log("Sección access-token | mantener URL");
        res = NextResponse.next()
    }
    res.headers.set(USERNAME_HEADER,username);
    res.headers.set(USER_ROLE_HEADER,role);
    addCookie(res,ACCESS_TOKEN,tokens.access,ACCESS_TOKEN_MAX_AGE);
    //addCookie(request,res,USER_ROLE,role,USER_ROLE_MAX_AGE);
    addCookie(res,REFRESH_TOKEN,tokens.refresh,REFRESH_TOKEN_MAX_AGE);
    return res;
}

function handleGuest(currentUrl : NextURL,request : NextRequest)
{
    console.log("Es un guest");
    const endpoint = currentUrl.pathname;
    let res;

    let authKey = {endpointFound : false, roleFound : false};
    testEndpoint(authKey,endpoint,ROLE_VISITANTE);

    if(!authKey.endpointFound) return NextResponse.next();
    if(authKey.endpointFound && !authKey.roleFound)
    {
        currentUrl.pathname = '/';
        res = NextResponse.redirect(currentUrl);
    }
    else res = NextResponse.next();
    deleteAllCookie(request,res);
    return res;
}

async function useRefreshToken(currentUrl : NextURL, token : string, request : NextRequest)
{
    console.log("Refrescando token");
    try{
    let req = await fetch(`${process.env.NEXT_PUBLIC_ms_auth_host}/oauth/token`,
        { 
            method : 'POST',
            mode : 'cors',
            headers: 
            {
                "Authorization":    `Basic ${process.env.NEXT_PUBLIC_clients_key}`,
                "Content-Type":     "application/x-www-form-urlencoded",
                "Accept":           "application/json"
            },
            body: `grant_type=refresh_token&refresh_token=${token}`
        }
    )
    if(req.ok)
    {     
        console.log("Sección obtener tokens | Respuesta OK");
        let {access_token, refresh_token} = await req.json();
        return await handleSession(currentUrl, {access : access_token,refresh : refresh_token},request); 
    } 
    else
    {
        return handleGuest(currentUrl,request);
    }
    }
    catch(e){return handleGuest(currentUrl,request);}
}

const deleteAllCookie = (request: NextRequest, response: NextResponse) => 
{
    request.cookies.getAll().forEach(cookie => 
        {
        response.cookies.set(cookie);
        response.cookies.delete(cookie);
    });
};
//maxAge in days
const addCookie = (response: NextResponse, cookieName: string, cookieValue : string, maxAge : number) => 
{  
    const exps = new Date();
    exps.setDate(exps.getDate() + maxAge);
    response.cookies.set({
        name: cookieName,
        value: cookieValue,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        expires: exps
    })
};

const testEndpoint = (authKey : any, endpoint : string, role : string) => 
{
    list_endpoints.findIndex(it => 
    {
        if(it.regex.test(endpoint))
        {
            authKey.endpointFound = true;   //Si la página existe
            if(it.auths.includes(role)){ authKey.roleFound = true; return true;}    //Si tiene autorizacion en ella
        }

    });
}

//Solo ejecutar en endpoints

export const config = {
    matcher: "/((?!api|static|.*\\..*|_next).*)"
}

