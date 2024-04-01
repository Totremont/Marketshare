import { findAllPedido } from "@/private/services/PedidoService";

//localhost/api/orders/list
export async function GET(request: Request)
{
    return findAllPedido()
    .then
    (
        res => Response.json(res),
        err => Response.error()
    )
}