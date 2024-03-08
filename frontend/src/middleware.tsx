import { NextRequest, NextResponse } from "next/server";
import validateToken from "./private/authorization";
import RequestStatus from "./private/utils/requeststatus";
import { InvalidUserToken } from "./private/exceptions";
import { NextURL } from "next/dist/server/web/next-url";

export const ACCESS_TOKEN = "marketshare.user.access-token"
export const REFRESH_TOKEN = "marketshare.user.refresh-token"
export const USER_ROLE = "marketshare.user.user-role"

//¿Quién puede acceder a cada endpoint?
const auth_endpoints = 
{
    '/'                     : ['VISITANTE'],
    '/register'             : ['VISITANTE'],
    '/home'                 : ['ROLE_COMPRADOR','ROLE_VENDEDOR'],
    '/product/create'       : ['ROLE_VENDEDOR']
}


export async function middleware(request: NextRequest) 
{  
    const accessToken  = request.cookies.get(ACCESS_TOKEN)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value;
    const userRole = request.cookies.get(USER_ROLE)?.value;

    const currentUrl = request.nextUrl;
    const endpoint = currentUrl.pathname;

    console.log("Sección middleware, inicio");
    //Todas las requests exitosas envian username y userrole por headers
    try
    {
        if(accessToken)
        {
            return await handleSession(currentUrl, {access : accessToken, refresh: refreshToken!},userRole!,request);
        }       
        else {
            console.log("No hay token");
            return handleGuest(currentUrl);  //Si no hay token, iniciar sesión    
        }   
    }
    catch(e : any)
    {   
        console.log("Sección excepcion exterior");
        //Si hay tokens pero el access expiró, probar refrescando
        if((e instanceof InvalidUserToken) && refreshToken)
        {
            return await useRefreshToken(currentUrl,refreshToken,userRole!,request);       
        } 
        else return handleGuest(currentUrl);
    }
    
}

//Supplementary methods

async function handleSession(currentUrl : NextURL, tokens : {access : string, refresh : string}, userRole : string, request : NextRequest)
{
    console.log("Sección access-token");
    const endpoint = currentUrl.pathname;
    let {username} = await validateToken(tokens.access);
    currentUrl.searchParams.forEach(value => currentUrl.searchParams.delete(value));
    //Los valores van en headers -- para ocultar los path queries
    //currentUrl.searchParams.set('role', userRole);
    //currentUrl.searchParams.set('username', username)
    //Si quiere entrar a una pantalla en la que no tiene permiso, ir a home
    let res : NextResponse;
    if(!auth_endpoints[endpoint as keyof typeof auth_endpoints].includes(userRole))
    {
        console.log("Sección access-token | Redireccionar a /home");
        currentUrl.pathname = '/home';
        res = NextResponse.redirect(currentUrl);
    }   
    else {
        console.log("Sección access-token | mantener URL");
        res = NextResponse.next() //NextResponse.rewrite(currentUrl);   //Mismo endpoint pero ocultando path queries
    }
    res.headers.set('X-USER-NAME',username);
    res.headers.set('X-USER-ROLE',userRole);
    addCookie(request,res,ACCESS_TOKEN,tokens.access);
    addCookie(request,res,USER_ROLE,userRole);
    addCookie(request,res,REFRESH_TOKEN,tokens.refresh);
    return res;
}

function handleGuest(currentUrl : NextURL)
{
    console.log("Es un guest");
    const endpoint = currentUrl.pathname;
    let res;
    if(!auth_endpoints[endpoint as keyof typeof auth_endpoints].includes('VISITANTE'))
    {
        currentUrl.pathname = '/';
        res = NextResponse.redirect(currentUrl);
    }
    else res = NextResponse.next();
    return res;
}

async function useRefreshToken(currentUrl : NextURL, token : string, userRole : string, request : NextRequest)
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
    if(req.status === RequestStatus.OK)
    {     
        console.log("Sección obtener tokens | Respuesta OK");
        let {access_token, refresh_token} = await req.json();
        return await handleSession(currentUrl, {access : access_token,refresh : refresh_token},userRole,request); 
    } 
    else
    {
        //Borrar cookies
        return handleGuest(currentUrl);
    }
    }
    catch(e){return handleGuest(currentUrl);}
}

    const deleteCookie = (request: NextRequest, response: NextResponse, cookieName: string) => 
    {
        let cookie = request.cookies.get(cookieName);
        if (cookie) 
        {
            if(!response.cookies.get(cookieName)) response.cookies.set(cookie);
            response.cookies.delete(cookie);
        }
    };

    const addCookie = (request: NextRequest, response: NextResponse, cookieName: string, cookieValue : string) => 
    {  
        response.cookies.set({
            name: cookieName,
            value: cookieValue,
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        })
    };

//Solo ejecutar en endpoints

export const config = {
    matcher: "/((?!api|static|.*\\..*|_next).*)"
}

