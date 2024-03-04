import { PrismaClient } from '@prisma/client'
import ProductoService from '@/private/services/ProductoService';
import RequestStatus from '@/private/mappers/RequestStatus';
import validate from '@/private/securityaspect';

const prisma = new PrismaClient()

const service = new ProductoService(prisma);

//localhost/api/products/update y json body
export async function PUT(request: Request) 
{
    //Si devolvió una respuesta es porque no tenia permisos
    let authorized = await validate(request.headers.get("Authorization"))
    if(authorized instanceof Response) return authorized;
    
    let product = await request.json()
    
    return service.update(product).then(
            (response) => Response.json(response),
            (error) =>
            {
                console.log(error);
                return new Response('', {
                    status: RequestStatus.NOT_FOUND
                    }) 
            }
            )  
    
}