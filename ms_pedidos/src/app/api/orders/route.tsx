import RequestStatus from "@/private/mappers/RequestStatus";
import { findAllPedidoFromClient, findAllPedidoFromClientAndProduct, findAllPedidoFromSeller, savePedido } from "@/private/services/PedidoService"


//localhost/api/orders?client_id=xxx    |&product_id=xxx&count_only=true (opcional) 
export async function GET(request: Request) 
{
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('seller_id')
    const clientId = searchParams.get('client_id')
    const productId = searchParams.get('product_id')
    //const countOnly = searchParams.get('count_only')
    if(sellerId)
    {
        return findAllPedidoFromSeller(Number(sellerId))
        .then(
            (response) => Response.json(response),
            (err) => new Response('', {status: RequestStatus.INTERNAL})
        )
    } 
    if(clientId)
    {
        if(productId)
            return (findAllPedidoFromClientAndProduct(Number(clientId), Number(productId))).then(
                (response) => Response.json(response),
                (err) => new Response('', {status : RequestStatus.INTERNAL})
            )
        else
            return (findAllPedidoFromClient(Number(clientId))).then(
                (response) => Response.json(response),
                (err) => new Response('', {status : RequestStatus.INTERNAL})
            )
    }
    else return new Response('', {status: RequestStatus.BAD_REQUEST})
    
}

export async function POST(request: Request) {

    let token = request.headers.get("Authorization");

    let product = await request.json()

    return savePedido(token!,product).then(
        (response) => Response.json(response),
        (error : Error) => {
            console.log(error); return new Response(error.message, {status: RequestStatus.BAD_REQUEST})
        })
    
}