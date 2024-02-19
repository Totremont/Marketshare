import { PrismaClient } from '@prisma/client'
import ProductoService from '@/private/services/ProductoService';
import RequestStatus from '@/private/mappers/RequestStatus';

const prisma = new PrismaClient()

const service = new ProductoService(prisma);

//localhost/internal/product/update?product_id=xxx y json body
export async function PUT(request: Request) 
{
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('product_id')
    let product = await request.json()
    
    if(id)
    {
        return service.update(Number.parseInt(id),product).then(
            (response) => Response.json(response),
            (error) =>
            {
                return new Response('', {
                    status: RequestStatus.NOT_FOUND
                    }) 
            }
            )
    } else return new Response('', {
        status: RequestStatus.BAD_REQUEST
        }) 
    
    
}