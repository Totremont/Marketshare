import RequestStatus from "@/private/mappers/RequestStatus";
import validate from "@/private/securityaspect";
import { findAllPedidoFromClient, findAllPedidoFromSeller, savePedido } from "@/private/services/PedidoService"


//localhost/api/order?client_id=xxx
export async function GET(request: Request) 
{
    //Si devolvió una respuesta es porque no tenia permisos
    let token = request.headers.get("Authorization");
    let authorized = await validate(token);
    if(authorized instanceof Response) return authorized;
    
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('seller_id')
    const clientId = searchParams.get('client_id')
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
        return (findAllPedidoFromClient(Number(clientId))).then(
            (response) => 
            {
                return response.length > 0 ? Response.json(response) : new Response('', {
                    status: RequestStatus.NOT_FOUND
                    })
            }
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