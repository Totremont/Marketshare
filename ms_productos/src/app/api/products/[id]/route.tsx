import ProductoService from '@/private/services/ProductoService';
import RequestStatus from '@/private/mappers/RequestStatus';
import { PrismaClient } from '@prisma/client'
import validate from "@/private/security" 
import { NotFoundError } from '@/private/exceptions';
import ProductoMapper from '@/private/mappers/ProductoMapper';

const prisma = new PrismaClient()

const service = new ProductoService(prisma);

const mapper = new ProductoMapper();


//localhost/api/products/{id}
export async function GET(request: Request, { params }: { params: { id: string } }) 
{

    const { searchParams } = new URL(request.url);
    const sendImages = searchParams.get('send_images');

    if(params.id)
    {
        return service.find(Number.parseInt(params.id),sendImages === 'true').then(
            (response) => new Response(mapper.jsonToForm([response])),
            (err) => {
            if(err instanceof NotFoundError) return new Response('',{status : RequestStatus.NOT_FOUND});
            else return new Response('',{status : RequestStatus.BAD_REQUEST});
            }
        )
    } else return new Response('', {status: RequestStatus.BAD_REQUEST})
}