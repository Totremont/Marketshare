import { PrismaClient } from '@prisma/client'
import ProductoService from '@/private/services/ProductoService';
import RequestStatus from '@/private/mappers/RequestStatus';
import validate from '@/private/securityaspect';
import ProductoMapper from '@/private/mappers/ProductoMapper';
import { NotFoundError } from '@/private/exceptions';

const prisma = new PrismaClient()

const service = new ProductoService(prisma);

const mapper = new ProductoMapper();

//localhost/api/products/update y json body     |&send_images=true optional
export async function PUT(request: Request) 
{

    const { searchParams } = new URL(request.url);
    const sendImages = searchParams.get('send_images');
    
    let form = await request.formData();
    let product = mapper.formToJSON(form);
    
    return service.update(product,sendImages === 'true').then(
        (response) => new Response(mapper.jsonToForm([response])),
        (err) => {
            if(err instanceof NotFoundError) return new Response('',{status : RequestStatus.NOT_FOUND});
            else return new Response('',{status : RequestStatus.BAD_REQUEST});
        }
    )  
    
}