import RequestStatus from "@/private/mappers/RequestStatus"
import validate from "@/private/securityaspect";
import { findOpinionByOrder } from "@/private/services/OpinionService"

//localhost/api/reviews/{id}
export async function GET(request: Request, { params }: { params: { id: string } }) 
{
    //Si devolvió una respuesta es porque no tenia permisos
    let authorized = await validate(request.headers.get("Authorization"))
    if(authorized instanceof Response) return authorized;
    
    if(params.id)
    {
        return findOpinionByOrder(params.id).then(
            (response) => 
            {
                return response ? Response.json(response) : new Response('', {
                    status: RequestStatus.NOT_FOUND
                  })
            }
        )
    } else return new Response('', {
        status: RequestStatus.BAD_REQUEST
      })
}