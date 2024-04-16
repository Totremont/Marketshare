'use client'
import { CreateReview } from "@/components/product/page/reviews";
import { SnackBar, SnackBarProps, SnackBarType } from "@/components/snackbar";
import { ROLE_COMPRADOR } from "@/middleware";
import { cancelOrderSSA } from "@/private/actions/order";
import { BackgroundColors, BorderColors, OrderStatus} from "@/private/utils/properties";
import {Skeleton} from "@nextui-org/skeleton";
import { useEffect, useRef, useState } from "react";

export default function OrderCard(props : {id : number, productName : string, image : string, 
    ownRole : string, orgName : string, price : string, units : number, status : string, date : string})
{
    const statusProps = useRef({title : '', desc : '', bg : '', border : ''});
    const buttonProps = useRef({show : false, bg : '', text : '', action : () => {} });
    const [showSnack, setShowSnack] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const snackProps = useRef<SnackBarProps>();

    //Gets trigger when this view or its parent's view needs to be re-render
    const [layoutChange, setlayoutChange] = useState(0);

    const setCancelProps = () =>
    {
        buttonProps.current.show = true;
        buttonProps.current.bg = BackgroundColors.SIENNA_BROWN;
        buttonProps.current.text = 'Cancelar';
        buttonProps.current.action = () => 
        {
            cancelOrderSSA(props.id).then(
                res => res.ok ? showOrderCancelled(setShowSnack,snackProps) : showOrderActionAborted(setShowSnack,snackProps),
                err => showOrderActionAborted(setShowSnack,snackProps)
            )
        }
    }

    const setReviewProps = () => 
    {
        buttonProps.current.show = true;
        buttonProps.current.bg = BackgroundColors.OLIVE;
        buttonProps.current.text = 'Reseñar';
        buttonProps.current.action = () => 
        {
            setShowReview(true);
        }
    }

    const setViewData = () => {
        switch(props.status)
        {
            case OrderStatus.RECIBIDO:
                statusProps.current.title = 'Recibido';
                statusProps.current.desc = 'Fue recibido y está siendo procesado'
                statusProps.current.bg = BackgroundColors.YELLOW;
                statusProps.current.border = BorderColors.YELLOW;
                if(props.ownRole === ROLE_COMPRADOR) setCancelProps();
                else buttonProps.current.show = false;
                setlayoutChange(layoutChange + 1);
                break;

            case OrderStatus.EN_DISTRIBUCION:
                statusProps.current.title = 'En distribución';
                statusProps.current.desc = 'El pedido está siendo despachado'
                statusProps.current.bg = BackgroundColors.BLUE;
                statusProps.current.border = BorderColors.BLUE;
                if(props.ownRole === ROLE_COMPRADOR) setCancelProps();
                else buttonProps.current.show = false;
                setlayoutChange(layoutChange + 1);
                break;

            case OrderStatus.ENTREGADO:
                statusProps.current.title = 'Entregado';
                statusProps.current.desc = 'El pedido fue entregado al cliente.'
                statusProps.current.bg = BackgroundColors.GREEN;
                statusProps.current.border = BorderColors.GREEN;
                if(props.ownRole === ROLE_COMPRADOR) setReviewProps();
                else buttonProps.current.show = false;
                setlayoutChange(layoutChange + 1);
                break;
            case OrderStatus.CANCELADO:
                statusProps.current.title = 'Cancelado';
                statusProps.current.desc = 'El pedido fue cancelado por el cliente.'
                statusProps.current.bg = BackgroundColors.RED;
                statusProps.current.border = BorderColors.RED;
                buttonProps.current.show = false;
                setlayoutChange(layoutChange + 1);
                break;

            case OrderStatus.SIN_STOCK:
                statusProps.current.title = 'Sin stock';
                statusProps.current.desc = 'Se intentó comprar el producto pero no habia stock.'
                statusProps.current.bg = BackgroundColors.GRAY;
                statusProps.current.border = BorderColors.GRAY;
                buttonProps.current.show = false;
                setlayoutChange(layoutChange + 1);
                break;

            case OrderStatus.RECHAZADO:
                statusProps.current.title = 'Rechazado';
                statusProps.current.desc = 'La orden era inválida por algún motivo.'
                statusProps.current.bg = BackgroundColors.GRAY;
                statusProps.current.border = BorderColors.GRAY;
                buttonProps.current.show = false;
                setlayoutChange(layoutChange + 1);
                break;
        }
    }

    const statusView = 
    (
    <div className={`border-t border-slate-500 py-3`}>
        <p className={`font-semibold rounded-lg w-fit px-2 ${statusProps.current.bg}`}>{statusProps.current.title}</p>  
        <div className="flex items-center mt-2 gap-x-2">
            <div className={`rounded-full w-3 h-3 mx-1 ${statusProps.current.bg}`}></div>
            <div>
                <p className="text-sm text-slate-300">{props.date}</p>
                <p className="text-sm font-semibold ">{statusProps.current.desc}</p>
            </div>
        </div>
        { 
            buttonProps.current.show ?
                <button onClick={buttonProps.current.action} 
                    className={`${buttonProps.current.bg} px-2 py-1 my-3 rounded-lg font-semibold w-full `}>
                    {buttonProps.current.text}</button>
                : null
        }
    </div>
    )

    useEffect(setViewData, []);

    const view = 
    (
    <article className={`h-[350px] w-[300px]
    rounded-lg border ${statusProps.current.border} bg-gray-800 text-slate-200 p-3`}>
        <div className="flex flex-nowrap items-center gap-x-3">
            <img src={props.image} className="w-12 h-12 flex-shrink-0 rounded-full" />
            <p className="flex-1 text-lg font-semibold max-h-[55px] overflow-hidden">{props.productName}</p>
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
        { 
            showSnack ? <SnackBar key="Ordercard_snackbar" title={snackProps.current!.title} 
            body={snackProps.current!.body} type={snackProps.current!.type} options={snackProps.current!.options}/> : null
        }
        {
            showReview ? <CreateReview productName={props.productName} image={props.image} orderId={props.id} setShowReview={setShowReview} /> : null
        }
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

function showOrderCancelled(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.SUCCESSFUL,"Orden cancelada",
    "Esta orden fue cancelada y el dinero y stock devueltos",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

function showOrderActionAborted(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.ERROR,"Acción abortada",
    "Ocurrió un error al tratar de procesar esa acción",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}