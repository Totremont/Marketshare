import RequestStatus from "@/private/mappers/RequestStatus";
import validate from "@/private/security";
import { findAllOpinionFromClient, findAllOpinionFromProduct, findAllOpinionFromSeller, saveOpinion } from "@/private/services/OpinionService";


//localhost/api/reviews
export async function POST(request: Request) 
{    
    try
    {
        let review = await request.json()

        return saveOpinion(review).then
        (
            (response) => Response.json(response),
            (error) => 
            {
                console.log(error);
                return new Response('', {status: RequestStatus.INTERNAL})
            }
        )
    } catch(e) {return new Response('', {status: RequestStatus.BAD_REQUEST})}
}

//localhost/api/reviews?seller_id=xxx
//localhost/api/reviews?product_id=xxx
//localhost/api/reviews?client_id=xxx
export async function GET(request: Request) 
{
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('seller_id')
    const productId = searchParams.get('product_id')
    const clientId = searchParams.get('client_id')

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
    } else if(clientId)
    {
        return findAllOpinionFromClient(Number(clientId)).then(
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