import RequestStatus from "@/private/mappers/RequestStatus"
import validate from "@/private/securityaspect";
import { updatePedido } from "@/private/services/PedidoService"

//localhost/api/order/update?id=xxx&new_status=xxx
export async function PUT(request: Request) 
{
    //Si devolvió una respuesta es porque no tenia permisos
    let token = request.headers.get("Authorization");
    let authorized = await validate(token);
    if(authorized instanceof Response) return authorized;
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const newStatus = searchParams.get('new_status')

    if(id && newStatus)
    {
        return updatePedido(token!,id,newStatus).then(
            (response) => Response.json(response),
            (error) => new Response('', {
                status: RequestStatus.NOT_FOUND
                })
        )
    } else return new Response('', {
        status: RequestStatus.BAD_REQUEST
      })
    
}