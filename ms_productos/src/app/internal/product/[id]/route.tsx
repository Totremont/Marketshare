import ProductoService from '@/private/services/ProductoService';
import RequestStatus from '@/private/mappers/RequestStatus';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const service = new ProductoService(prisma);

//localhost/internal/product/{id}
export async function GET(request: Request, { params }: { params: { id: string } }) 
{
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