import { readImages } from "@/private/utils/files";
import { NextRequest } from "next/server";

//api/images
export async function POST(request: NextRequest) 
{
    try
    {
        const body : {paths : string[]} = await request.json();
        const images = await readImages(body.paths);

        const form = new FormData();
        images.forEach(it => form.append('files',it as File));

        return new Response(form);
    } 
    catch(err){ return Response.error()}
    
}