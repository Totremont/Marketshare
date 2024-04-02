'use client'
import { ROLE_COMPRADOR } from "@/middleware";
import { BackgroundColors, BorderColors} from "@/private/utils/properties";
import {Skeleton} from "@nextui-org/skeleton";

export default function OrderCard(props : {productName : string, image : string, 
    ownRole : string, orgName : string, price : string, units : number, status : string, date : string})
{
    let [statusTitle, statusDescription] = ['',''];
    let background = '';
    let borderColor;
    switch(props.status)
    {
        case 'RECIBIDO':
            [statusTitle,statusDescription] = ['Recibido','Fue recibido y está siendo procesado.'];
            background = BackgroundColors.YELLOW;
            borderColor = BorderColors.YELLOW;
            break;
        case 'EN_DISTRIBUCION':
            [statusTitle,statusDescription] = ['En distribución','El pedido está siendo despachado.'];
            background = BackgroundColors.BLUE;
            borderColor = BorderColors.BLUE;
            break;
        case 'ENTREGADO':
            [statusTitle,statusDescription] = ['Entregado','El pedido ha sido recibido.'];
            background = BackgroundColors.GREEN;
            borderColor = BorderColors.GREEN;
            break;
        case 'CANCELADO':
            [statusTitle,statusDescription] = ['Cancelado','El pedido fue cancelado por el cliente.'];
            background = BackgroundColors.RED;
            borderColor = BorderColors.RED;
            break;
        case 'SIN_STOCK':
            [statusTitle,statusDescription] = ['Sin stock','Se intentó comprar el producto pero no habia stock.'];
            background = BackgroundColors.GRAY;
            borderColor = BorderColors.GRAY;
            break;
        case 'RECHAZADO':
            [statusTitle,statusDescription] = ['Rechazado','La orden era inválida por algún motivo.'];
            background = BackgroundColors.GRAY;
            borderColor = BorderColors.GRAY;
            break;

    }
    let statusView = 
    (
    <div className={`border-t border-slate-500 py-3`}>
        <p className={`font-semibold rounded-lg w-fit px-2 ${background}`}>{statusTitle}</p>  
        <div className="flex items-center mt-2 gap-x-2">
            <div className={`rounded-full w-3 h-3 mx-1 ${background}`}></div>
            <div>
                <p className="text-sm ">{props.date}</p>
                <p className="text-sm text-slate-300 font-semibold ">{statusDescription}</p>
            </div>
        </div>
    </div>
    )
    const view = 
    (
    <article className={`h-[325px] w-[300px]
    rounded-lg border ${borderColor} bg-gray-800 text-slate-200 p-3`}>
        <div className="flex flex-nowrap items-center gap-x-3">
            <img src={props.image} className="w-10 flex-shrink-0 rounded-full" />
            <p className="flex-1 text-lg font-semibold overflow-hidden">{props.productName}</p>
        </div>
        <section className="grid grid-rows-[auto_1fr] gap-y-2 border-t border-slate-500 items-center mt-3 py-1">
            <div className="grid grid-cols-2 text-center">
                <p className="text-sm col-span-2 text-center">
                    {props.ownRole === ROLE_COMPRADOR ? 'Vendedor' : 'Comprador'}
                    <span className="font-semibold block text-lg">{props.orgName}</span></p>
                <p className="text-sm my-1">Valor <span className="font-semibold block text-lg">${props.price}</span></p>
                <p className="text-sm my-1">Unidades <span className="font-semibold block text-lg">{props.units}</span></p>
            </div>
           {statusView}
        </section>
    </article>
    )

    return view;
}

export function OrderCardSkeleton()
{
    const view = 
    (
    <article className="flex h-[225px] min-w-[200px] max-w-[280px] flex-col rounded-lg bg-gray-800 p-3">
      <div className="flex items-center">
        <Skeleton className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-700"></Skeleton>
        <Skeleton className="ms-2 h-6 w-full rounded bg-gray-700"></Skeleton>
      </div>
      <div className="mt-3 grid flex-1 grid-rows-2 gap-3">
        <Skeleton className="w-full rounded bg-gray-700"></Skeleton>
        <Skeleton className="w-full rounded bg-gray-700"></Skeleton>
      </div>
    </article>
    )
    return view;
}