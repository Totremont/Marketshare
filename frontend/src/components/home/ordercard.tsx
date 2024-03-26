'use client'
import { OrderStatus } from "@/private/utils/properties";
import {Skeleton} from "@nextui-org/skeleton";


export default function GetOrderCards()
{
    
}

function OrderCard(props : {productName : string, image : string,
    buyerName : string, units : number, price : number, status : number, date : string})
{
    let ribbon;
    let status;

    switch(props.status){
        case OrderStatus.CONFIRMED:
            status = (<><p className="font-semibold text-blue-200 text-lg">
                Confirmado<span className="text-sm text-slate-300 font-normal"> | {props.date}</span></p>
                <p className="text-sm text-slate-300">En espera para ser despachado</p></>);
            ribbon = <div className="w-[25px] h-[35px] bg-blue-200 float-right mx-5 text-center "></div>
            break;
        case OrderStatus.ON_DELIVERY:
            status = (<><p className="font-semibold text-yellow-100 text-lg">
                Despachado<span className="text-sm text-slate-300 font-normal"> | {props.date}</span></p>
                <p className="text-sm text-slate-300">En viaje para llegar a destino</p></>);
            ribbon = <div className="w-[25px] h-[35px] bg-yellow-100 float-right mx-5 text-center "></div>
            break;
        case OrderStatus.DELIVERED:
            status = (<><p className="font-semibold text-yellow-200 text-lg">
                Entregado<span className="text-sm text-green-200 font-normal"> | {props.date}</span></p>
                <p className="text-sm text-slate-300">Ha llegado a manos del cliente</p></>);
            ribbon = <div className="w-[25px] h-[35px] bg-green-200 float-right mx-5 text-center "></div>
            break;
        case OrderStatus.CANCELLED:
            status = (<><p className="font-semibold text-yellow-200 text-lg">
                Cancelado<span className="text-sm text-red-200 font-normal"> | {props.date}</span></p>
                <p className="text-sm text-slate-300">Fue cancelado por el cliente</p></>);
            ribbon = <div className="w-[25px] h-[35px] bg-red-200 float-right mx-5 text-center "></div>
            break;
    }

    let view = 
    (
    <article className="max-w-[280px] min-w-[200px] h-[225px] 
    rounded-lg bg-gray-800 text-slate-200 mb-3 me-3">
    {ribbon}
        <section className="p-3">
        <div className="flex items-center">
            <img src={props.image} className="w-10 rounded-full"/>
        <p className="font-semibold text-lg mx-2">{props.productName}</p>
        </div>
        <p className="text-sm mt-2">Comprador: <span className="font-semibold">{props.buyerName}</span></p>
        <p className="text-sm ">Unidades: <span className="font-semibold">{props.units}</span></p>
        <p className="text-sm ">Valor: <span className="font-semibold">${props.price}</span></p>
        <div className="border-t mt-2 py-1 border-slate-600">
            {status}
        </div>
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