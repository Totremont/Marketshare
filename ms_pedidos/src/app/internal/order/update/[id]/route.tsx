import RequestStatus from "@/private/mappers/RequestStatus"
import { updatePedido } from "@/private/services/PedidoService"

//localhost/internal/order/update/1?status=xxx
export async function PUT(request: Request, { params }: { params: { id: string } }) 
{
    const { searchParams } = new URL(request.url)
    const newStatus = searchParams.get('status')

    if(params.id && newStatus)
    {
        return updatePedido(params.id,newStatus).then(
            (response) => Response.json(response),
            (error) => new Response('', {
                status: RequestStatus.NOT_FOUND
                })
        )
    } else return new Response('', {
        status: RequestStatus.BAD_REQUEST
      })
    
}