import ProductoService from '@/private/services/ProductoService';
import RequestStatus from '@/private/mappers/RequestStatus';
import { PrismaClient } from '@prisma/client'
import validate from '@/private/securityaspect';

const prisma = new PrismaClient()

const service = new ProductoService(prisma);

//localhost/internal/product?owner_id=xxx
export async function GET(request: Request) 
{
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('owner_id')
    if(id)
    {
        return service.findAllFrom(Number.parseInt(id)).then(
            (response) => 
            {
                return response.length > 0 ? Response.json(response) : new Response('', {
                    status: RequestStatus.NOT_FOUND
                    })
            }
        )
    } else return new Response('', {
        status: RequestStatus.BAD_REQUEST
        })
    
}

//localhost/api/product | Json body

export async function POST(request: Request) {

    //Si devolvió una respuesta es porque no tenia permisos
    let token = request.headers.get("Authorization");
    let authorized = await validate(token)
    if(authorized instanceof Response) return authorized;

    let product = await request.json()

    return service.save(token!,product).then(
        (response) => Response.json(response),
        (error) => {
            console.log(error);
            return new Response('', {status: RequestStatus.BAD_REQUEST})
        })
    
}

export async function OPTIONS(request: Request)
{
    return new Response('', {
        status: RequestStatus.OK,
        headers: RequestStatus.CORS_HEADERS
      })
}



