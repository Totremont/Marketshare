import RequestStatus from "@/private/mappers/RequestStatus";
import validate from "@/private/securityaspect";
import { findAllOpinionFromProduct, findAllOpinionFromSeller, saveOpinion } from "@/private/services/OpinionService";



//localhost/api/reviews
export async function POST(request: Request) 
{
    //Si devolvió una respuesta es porque no tenia permisos
    let authorized = await validate(request.headers.get("Authorization"))
    if(authorized instanceof Response) return authorized;
    
    let review = await request.json()

    return saveOpinion(review).then(
        (response) => Response.json(response),
        (error) => 
        {
            console.log(error);
            return new Response('', {status: RequestStatus.INTERNAL})
        }
    )
}

//localhost/api/reviews?seller_id=xxx
//localhost/api/reviews?product_id=xxx
export async function GET(request: Request) 
{
    //Si devolvió una respuesta es porque no tenia permisos
    let authorized = await validate(request.headers.get("Authorization"))
    if(authorized instanceof Response) return authorized;

    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('seller_id')
    const productId = searchParams.get('product_id')

    if(sellerId)
    {
        return findAllOpinionFromSeller(Number(sellerId)).then(
            (response) => Response.json(response),
            (error) => new Response('', {
                status: RequestStatus.INTERNAL
                })
        )
    }
    else if(productId)
    {
        return findAllOpinionFromProduct(Number(productId)).then(
            (response) => Response.json(response),
            (error) => new Response('', {
                status: RequestStatus.INTERNAL
                })
        )
    }

    else return new Response('', {
        status: RequestStatus.BAD_REQUEST
        })
}