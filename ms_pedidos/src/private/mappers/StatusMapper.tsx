import PedidoStatus from "../PedidoStatus";

export function toStatus(status : string)
{
    switch(status.toUpperCase())
    {
        case "RECHAZADO":
            return PedidoStatus.RECHAZADO;
        case "SIN_STOCK":
            return PedidoStatus.SIN_STOCK;
        case "RECIBIDO":
            return PedidoStatus.RECIBIDO;
        case "CANCELADO":
            return PedidoStatus.CANCELADO;
        case "EN_DISTRIBUCION":
            return PedidoStatus.EN_DISTRIBUCION;
        case "ENTREGADO":
            return PedidoStatus.ENTREGADO;
        default:
            return PedidoStatus.RECHAZADO;
    }
}
