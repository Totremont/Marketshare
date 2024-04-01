import ProductoService from '@/private/services/ProductoService';
import RequestStatus from '@/private/mappers/RequestStatus';
import { PrismaClient } from '@prisma/client'
import validate from '@/private/security';
import ProductoMapper from '@/private/mappers/ProductoMapper';
import { NotFoundError } from '@/private/exceptions';

const prisma = new PrismaClient()

const service = new ProductoService(prisma);

const mapper = new ProductoMapper();

//localhost/api/product?owner_id=xxx   |&send_images=true optional
export async function GET(request: Request) 
{
    //Si devolvió una respuesta es porque no tenia permisos
    let token = request.headers.get("Authorization");
    let authorized = await validate(token)
    if(authorized instanceof Response) return authorized;

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('owner_id')
    const sendImages = searchParams.get('send_images');

    if(id)
    {
        return service.findAllFrom(Number.parseInt(id),!!sendImages).then
        (
            (response) => new Response(mapper.jsonToForm(response)),
            (err) => {
                if(err instanceof NotFoundError) return new Response('',{status : RequestStatus.NOT_FOUND});
                else return new Response('',{status : RequestStatus.BAD_REQUEST});
            }
        )
    } else return new Response('', {status: RequestStatus.BAD_REQUEST})
    
}

//localhost/api/product | Json body

export async function POST(request: Request) {

    const { searchParams } = new URL(request.url);
    const sendImages = searchParams.get('send_images');
    const token = request.headers.get("Authorization");

    //Body es un formdata | Los arreglos se convierten en string al enviarse y deben ser parseados
    let form = await request.formData();
    try
    {
        let product = mapper.formToJSON(form);

        return service.save(token!,product,sendImages === 'true').then
        (
            (response) => new Response(mapper.jsonToForm([response])),
            (err) => {console.log(err); return new Response('',{status : RequestStatus.BAD_REQUEST})}        
        )
    } catch(e){return new Response('', {status: RequestStatus.BAD_REQUEST})}
    
}

export async function OPTIONS(request: Request)
{
    return new Response('', {
        status: RequestStatus.OK,
        headers: RequestStatus.CORS_HEADERS
      })
}



