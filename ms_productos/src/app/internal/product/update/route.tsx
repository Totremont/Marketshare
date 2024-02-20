import { PrismaClient } from '@prisma/client'
import ProductoService from '@/private/services/ProductoService';
import RequestStatus from '@/private/mappers/RequestStatus';

const prisma = new PrismaClient()

const service = new ProductoService(prisma);

//localhost/internal/product/update y json body
export async function PUT(request: Request) 
{
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