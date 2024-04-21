import validate from "@/private/security";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request : NextRequest)
{
    //Si devolvió una respuesta es porque no tenia permisos
    if(request.method != 'OPTIONS'){
        let authorized = await validate(request.headers.get("Authorization"))
        if(authorized instanceof Response) return authorized;
    }

    const res = NextResponse.next();
    res.headers.append('Access-Control-Allow-Credentials', "true")
    res.headers.append('Access-Control-Allow-Origin', '*') // replace this your actual origin
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.headers.append('Access-Control-Allow-Headers','*')
    return res;
}

// specify the path regex to apply the middleware to
export const config = {
    matcher: '/api/:path*',
}