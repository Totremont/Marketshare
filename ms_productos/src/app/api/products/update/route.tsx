import { PrismaClient } from '@prisma/client'
import ProductoService from '@/private/services/ProductoService';
import RequestStatus from '@/private/mappers/RequestStatus';
import validate from '@/private/security';
import ProductoMapper from '@/private/mappers/ProductoMapper';
import { NotFoundError } from '@/private/exceptions';

const prisma = new PrismaClient()

const service = new ProductoService(prisma);

const mapper = new ProductoMapper();

//localhost/api/products/update ||?stock={}&id={} y json body
export async function PUT(request: Request) 
{
    const { searchParams } = new URL(request.url);

    const id = searchParams.get('id');
    const newStock = searchParams.get('stock');
    const sendImages = searchParams.get('send_images');

    if(id && newStock)  //Only update this data
    {
        return service.subUpdate({stock : Number(newStock),id : Number(id)})
        .then(
            res => Response.json(res),
            err => new Response('',{status : RequestStatus.INTERNAL})
        )
    }
    
    let form = await request.formData();
    let product = mapper.formToJSON(form);
    
    return service.update(product,sendImages === 'true')
    .then
    (
        (response) => new Response(mapper.jsonToForm([response])),
        (err) => {
            if(err instanceof NotFoundError) return new Response('',{status : RequestStatus.NOT_FOUND});
            else return new Response('',{status : RequestStatus.BAD_REQUEST});
        }
    )  
    
}