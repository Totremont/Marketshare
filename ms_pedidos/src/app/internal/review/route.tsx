import RequestStatus from "@/private/mappers/RequestStatus";
import { findAllOpinionFromProduct, findAllOpinionFromSeller, saveOpinion } from "@/private/services/OpinionService";



//localhost/internal/review
export async function POST(request: Request) 
{
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

//localhost/internal/review?seller_id=xxx
//localhost/internal/review?product_id=xxx
export async function GET(request: Request) 
{
    let review = await request.json()

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