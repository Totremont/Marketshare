import { sendGreetings, sendOrderDelivered, sendOrderCanceled, sendOrderCreated, sendAccountChanged } from "@/app/private/MessageService";
import MessageType, { toMessageType } from "@/app/private/MessageType"
import RequestStatus from "@/app/private/RequestStatus";
import validate from "@/app/private/securityaspect";

//localhost/internal/mail?type=xxx || json
export async function PUT(request: Request) 
{
    //Si devolvió una respuesta es porque no tenia permisos
    let authorized = await validate(request.headers.get("Authorization"))
    if(authorized instanceof Response) return authorized;
    
    const { searchParams } = new URL(request.url)
    const newStatus = searchParams.get('type')
    const args = await request.json();
    let onResponse = (response : any) => new Response('', 
    {
        status: RequestStatus.OK
    });
    let onError = (error : any) => new Response('', 
    {
        status: RequestStatus.INTERNAL
    });

    if(newStatus)
    {
        const type = toMessageType(newStatus);
        switch(type)
        {
            case MessageType.NEW_ACCOUNT:
                return sendGreetings(args).then(onResponse,onError);
            case MessageType.ORDER_CREATED:
                return sendOrderCreated(args).then(onResponse,onError);
            case MessageType.ORDER_DELIVERED:
                return sendOrderDelivered(args).then(onResponse,onError);
            case MessageType.ORDER_CANCELLED:
                return sendOrderCanceled(args).then(onResponse,onError);
            case MessageType.ACCOUNT_CHANGED:
                return sendAccountChanged(args).then(onResponse,onError);
            default: return new Response('', 
            {
                status: RequestStatus.BAD_REQUEST
            });

        }
    } else return new Response('', 
    {
        status: RequestStatus.BAD_REQUEST
    });
    
}