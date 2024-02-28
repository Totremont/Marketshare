import ProductoService from '@/private/services/ProductoService';
import RequestStatus from '@/private/mappers/RequestStatus';
import { PrismaClient } from '@prisma/client'
import validate from "@/private/securityaspect" 

const prisma = new PrismaClient()

const service = new ProductoService(prisma);

let functions = {"functions" : [GET]}


//localhost/internal/product/{id}
export async function GET(request: Request, { params }: { params: { id: string } }) 
{
    //Si devolvió una respuesta es porque no tenia permisos
    let authorized = await validate(request.headers.get("Authorization"))
    if(authorized instanceof Response) return authorized;

    if(params.id)
    {
        return service.find(Number.parseInt(params.id)).then(
            (response) => 
            {
                return response ? Response.json(response) : new Response('', {
                    status: RequestStatus.NOT_FOUND
                  })
            }
        )
    } else return new Response('', {
        status: RequestStatus.BAD_REQUEST
      })
}