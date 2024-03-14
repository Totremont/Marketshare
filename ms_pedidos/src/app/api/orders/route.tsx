import RequestStatus from "@/private/mappers/RequestStatus";
import validate from "@/private/securityaspect";
import { findAllPedidoFromClient, findAllPedidoFromClientAndProduct, findAllPedidoFromSeller, savePedido } from "@/private/services/PedidoService"


//localhost/api/orders?client_id=xxx    |&product_id=xxx (opcional)
export async function GET(request: Request) 
{
    //Si devolvió una respuesta es porque no tenia permisos
    let token = request.headers.get("Authorization");
    let authorized = await validate(token);
    if(authorized instanceof Response) return authorized;
    
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('seller_id')
    const clientId = searchParams.get('client_id')
    const productId = searchParams.get('product_id')
    if(sellerId)
    {
        return (findAllPedidoFromSeller(Number(sellerId))).then(
            (response) => 
            {
                return response.length > 0 ? Response.json(response) : new Response('', {
                    status: RequestStatus.NOT_FOUND
                    })
            }
        )
    } 
    if(clientId)
    {
        if(productId)
            return (findAllPedidoFromClientAndProduct(Number(clientId), Number(productId))).then(
                (response) => 
                {
                    return response.length > 0 ? Response.json(response) : 
                    new Response('', {status: RequestStatus.NOT_FOUND})
                },
                (err) => new Response('', {status : RequestStatus.INTERNAL})
            )
        else
            return (findAllPedidoFromClient(Number(clientId))).then(
                (response) => 
                {
                    return response.length > 0 ? Response.json(response) : 
                    new Response('', {status: RequestStatus.NOT_FOUND})
                },
                (err) => new Response('', {status : RequestStatus.INTERNAL})
            )
    }
    else return new Response('', {
    status: RequestStatus.BAD_REQUEST
    })
    
}

export async function POST(request: Request) {

        //Si devolvió una respuesta es porque no tenia permisos
        let token = request.headers.get("Authorization");
        let authorized = await validate(token);
        if(authorized instanceof Response) return authorized;

    let product = await request.json()

    return savePedido(token!,product).then(
        (response) => Response.json(response),
        (error) => {
            console.log(error);
            return new Response('', {status: RequestStatus.BAD_REQUEST})
        })
    
}