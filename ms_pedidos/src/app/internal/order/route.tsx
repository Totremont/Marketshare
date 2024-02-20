import RequestStatus from "@/private/mappers/RequestStatus";
import { findAllFromClient, findAllFromSeller, save } from "@/private/services/PedidoService"


//localhost/internal/order?client_id=xxx
export async function GET(request: Request) 
{
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('seller_id')
    const clientId = searchParams.get('client_id')
    if(sellerId)
    {
        return (findAllFromSeller(Number(sellerId))).then(
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
        return (findAllFromClient(Number(clientId))).then(
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

    let product = await request.json()

    return save(product).then(
        (response) => Response.json(response),
        (error) => {
            console.log(error);
            return new Response('', {status: RequestStatus.BAD_REQUEST})
        })
    
}