import { NotFoundError } from "@/private/exceptions";
import ProductoMapper from "@/private/mappers/ProductoMapper";
import RequestStatus from "@/private/mappers/RequestStatus";
import validate from "@/private/securityaspect";
import ProductoService from "@/private/services/ProductoService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const service = new ProductoService(prisma);

const mapper = new ProductoMapper();

//localhost/api/products/list
export async function GET(request: Request) 
{
    //Si devolvió una respuesta es porque no tenia permisos
    let authorized = await validate(request.headers.get("Authorization"))
    if(authorized instanceof Response) return authorized;
    
    const { searchParams } = new URL(request.url);
    const sendImages = searchParams.get('send_images');
    
    return service.findAll(!!sendImages).then(
        (response) => new Response(mapper.jsonToForm(response)),
        (err) => {
            if(err instanceof NotFoundError) return new Response('',{status : RequestStatus.NOT_FOUND});
            else return new Response('',{status : RequestStatus.BAD_REQUEST});
        }
    )
    
}