import { NextRequest, NextResponse } from "next/server";
import validateSession from "./private/authorization";

export const TOKEN_KEY = "marketshare.user.token"

//Middleware que setea una cookie antes de enviar respuesta
//En realidad solo se debe usar al logearse

//Redirect con ?usertype=xxx&&username=xxx
export async function middleware(request: NextRequest) 
{
    const token  = request.cookies.get(TOKEN_KEY)?.value;
    const currentUrl = new URL(request.nextUrl.pathname, request.nextUrl);
    const host = new URL("/", request.nextUrl);
    console.log("Me ejecuté");
    try
    {
        let userData = await validateSession(token);
        //Si la sesión es válida

        // Añadir datos de usuario al header
        currentUrl.searchParams.set('usertype', userData.role)
        currentUrl.searchParams.set('username', userData.username)

        // And redirect to the new URL
        return NextResponse.redirect(currentUrl)

    } catch(e : any)
    {   //Si es inválida redireccionar a login
        //if(request.nextUrl.pathname != "/") return NextResponse.redirect(host);
        //else 
        return NextResponse.next();
    }
    //response.cookies.set(TOKEN_KEY, "hola");
}


//Solo ejecutar en endpoints
export const config = {
    matcher: "/((?!api|static|.*\\..*|_next).*)"
}
