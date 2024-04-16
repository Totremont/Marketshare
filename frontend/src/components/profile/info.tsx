'use client'
import { ROLE_COMPRADOR, ROLE_VENDEDOR } from "@/middleware";
import { formatPrice, getCategoryIcon, getOrderStatus, isOrderTerminated} from "@/private/utils/mappers";
import { useEffect, useRef, useState } from "react";
import { RatingStars } from "../product/page/reviews";
import SellerReputation from "../product/page/reputation";
import { BackgroundColors, OrderStatus } from "@/private/utils/properties";

//order.product debe ser un atributo
export default function ProfileInfo(props : {role : string, orders : any[], 
    user : any, categories : {category : string, ocurrency : number}[], 
    products : {name : string, stock : string, price : string, published : string, seller : any, orders : any[], category : string}[]}) 
{
    const ordersCompleted = useRef<any[]>([]);
    const moneySpent = useRef<string>('0');
    const userOrderSpecial = useRef<any>();
    const reviews = useRef<any[]>([]);
    const userValoration = useRef(0);
    const statusProps = useRef<{background : string, text : string}>();
    const [render, setRender] = useState(false);

    useEffect(() => 
    {
        ordersCompleted.current = props.orders.filter(it => getOrderStatus(it).status === OrderStatus.ENTREGADO);
        reviews.current = ordersCompleted.current.filter(it => it.review).map(it => it.review);

        setMoneySpent();
        if(props.role == ROLE_COMPRADOR) setMostExpensiveOrder();
        else setBestSellingProduct();
        setValoration();
        setRender(true);
    },[])

    const setMoneySpent = () => 
    {
        let sum = 0;
        ordersCompleted.current.forEach(it => sum += it.price);
        moneySpent.current = formatPrice(sum);
    }

    const setMostExpensiveOrder = () => 
    {
        ordersCompleted.current.sort((a,b) => b.price - a.price)    //Si a es más caro, va primero
        userOrderSpecial.current = ordersCompleted.current[0];
    }

    const setBestSellingProduct = () => 
    {
        //Al ordenar estamos poniendo los elementos repetidos uno al lado del otro
        ordersCompleted.current.sort((a,b) => a.product.name < b.product.name ? -1 : a.product.name > b.product.name ? 1 : 0 );
        let lastProduct = '';
        let data : {product : any, units : number}[] = [];
        ordersCompleted.current.forEach(it => 
        {
            if(it.product.name === lastProduct) data[data.length - 1].units += it.amount;
            else
            {
                data = data.concat({product : it.product, units : it.amount});
                lastProduct = it.product.name;
            }
        }
        );
        data.sort((a,b) => b.units - a.units);
        userOrderSpecial.current = data[0];
    }

    const setValoration = () => 
    {
        let sum = 0;
        let div = reviews.current.length;
        reviews.current.forEach(it => {sum += it.rating});
        userValoration.current = sum/(div > 0 ? div : 1);
    }

    const setStatusProps = (status : string) => 
    {
        switch(status)
        {
            case OrderStatus.RECIBIDO:
                statusProps.current = {background : BackgroundColors.YELLOW, text : 'Recibido'}
                break;
            case OrderStatus.EN_DISTRIBUCION:
                statusProps.current = {background : BackgroundColors.BLUE, text : 'Despachado'}
                break;
            case OrderStatus.ENTREGADO:
                statusProps.current = {background : BackgroundColors.GREEN, text : 'Entregado'}
                break;
            case OrderStatus.CANCELADO:
                statusProps.current = {background : BackgroundColors.RED, text : 'Cancelado'}
                break;
            case OrderStatus.SIN_STOCK:
                statusProps.current = {background : BackgroundColors.GRAY, text : 'Sin stock'}
                break;
            case OrderStatus.RECHAZADO:
                statusProps.current = {background : BackgroundColors.GRAY, text : 'Rechazado'}
                break;
        }
    }

    const view = 
    (
    <div className="h-fit max-w-[1500px] mx-auto">
        <article className="rounded-lg border border-slate-600 bg-slate-800 
        sm:grid sm:grid-cols-2 md:grid-cols-4 w-fit sm:mx-auto md:text-center">
            <section className="border-b border-slate-600 p-4 sm:col-span-2 md:col-span-4">
                <h1>Tu vista como {props.role === ROLE_COMPRADOR ? 'comprador' : 'vendedor'}</h1>
                <h2 className="my-2 text-xl font-semibold my-1">{props.user.organization.name}</h2>
                <div className="flex gap-x-2 justify-center items-center">
                {
                    props.categories.length > 0 ? 
                    props.categories.map((it,index) =>
                     getCategoryIcon(it.category,`icon_category_${index}_from_user_${props.user.id}`)) 
                    : null
                }
                </div>
            </section>

            <section className="border-e border-slate-600 p-4">
                <p>{`Número de ${props.role === ROLE_COMPRADOR ? 'compras' : 'ventas'}`}</p>
                <p className="mt-1 text-2xl font-semibold">{ordersCompleted.current.length}</p>
            </section>

            <section className="border-e border-slate-600 p-4">
                <p>{`${props.role === ROLE_COMPRADOR ? 'Dinero gastado' : 'Ingresos brutos'}`}</p>
                <p className="mt-1 text-2xl font-semibold">{moneySpent.current}$</p>
            </section>

            <section className="border-e border-slate-600 p-4">
                <p>{`Producto ${props.role === ROLE_COMPRADOR ? 'más caro' : 'más vendido'}`}</p>
                <p className="mt-1 text-2xl h-16 overflow-hidden font-semibold">
                    {
                        userOrderSpecial.current ? userOrderSpecial.current.product.name  : '?'
                    }
                </p>
                <p className="mt-1">
                    {
                        userOrderSpecial.current ?
                        props.role === ROLE_COMPRADOR ? `$${formatPrice(userOrderSpecial.current.product.price)}` 
                        : `${userOrderSpecial.current.units} unidades vendidas` 
                        : '?'
                    }
                </p>
            </section>

            <section className="p-4">
                <div className="rounded-xl bg-slate-700  px-3 py-1 md:text-center w-fit md:mx-auto">
                    <p className="mb-1 text-sm">
                        {`${props.role === ROLE_COMPRADOR ? 'Reseñas promedio' : 'Valoración'}`}</p>
                        <RatingStars rating={userValoration.current}/>
                        <p className="text-sm">{reviews.current.length} reseñas</p>
                    {
                        props.role === ROLE_VENDEDOR ? 
                        <SellerReputation rating={userValoration.current} 
                        totalReviews={reviews.current.length} totalSells={ordersCompleted.current.length} />
                        : null
                    }
                </div>
            </section>
        </article>

        <article>
            <header className="mx-4 my-6 text-2xl font-semibold">
                <h1>Órdenes</h1>
            </header>

            <table className="w-full text-sm md:text-base">
                <tbody>
                    <tr className="border-b border-slate-600 text-base">
                        <th className="w-[25%] text-left py-4 px-2">Producto</th>
                        <th className="w-[20%] text-left py-4 px-2">{props.role === ROLE_COMPRADOR ? 'Vendedor' : 'Comprador'}</th>
                        <th className="w-[20%] text-left py-4 px-2">Estado</th>
                        <th className="w-[15%] text-left py-4 px-2">Precio</th>
                        <th className="w-[10%] text-left py-4 px-2">Unidades</th>
                        <th className="w-[10%] text-left py-4 px-2">Acciones</th>
                    </tr>
                    {
                        props.orders.map((order,index) => 
                        {
                            const status = getOrderStatus(order).status;
                            setStatusProps(status);
                            let actionText = '';
                            let actionColor = '';
                            if(status === OrderStatus.ENTREGADO)
                            {
                                actionText = 'Reseñar'
                                actionColor = BackgroundColors.GREEN;
                            } 
                            else if(!isOrderTerminated(status))
                            {
                                actionText = 'Cancelar';
                                actionColor = BackgroundColors.SIENNA_BROWN;
                            }
                            return (
                            <tr key={`order_row_${index}`} className="border-b border-slate-600">
                                <td className="py-4 px-2">
                                    <button className="rounded-lg border border-slate-600 
                                    bg-gray-800 p-1 px-3 text-sm text-nowrap overflow-hidden">{order.product.name}</button>
                                </td>
                                <td className="py-4 px-2">{props.role === ROLE_COMPRADOR ? order.seller.name : order.client.name}</td>
                                <td className="py-4 px-2">
                                    <div className="flex items-center gap-x-2 ">
                                        <div className={`${statusProps.current?.background} w-4 h-4 rounded-full`}></div>
                                        <p>{statusProps.current?.text}</p>
                                    </div>
                                </td>
                                <td className="py-4 px-2">{formatPrice(order.price)}$</td>
                                <td className="py-4 px-2">{order.amount}</td>
                                <td className="py-4 px-2">{
                                    actionText && actionColor ? 
                                    <button className={`rounded-lg w-full text-center 
                                    ${actionColor} p-1 px-3 text-sm overflow-hidden`}>
                                        {actionText}
                                    </button> : 'No disponible'
                                    }
                                </td>
                            </tr>
                            )
                        }
                        )
                    }
                </tbody>
            </table>
        </article>

        <article>
            <header className="mx-4 my-6 text-2xl font-semibold">
                <h1 className="">{`Productos ${props.role === ROLE_COMPRADOR ? 'que te podrían interesar' : 'añadidos'}`}</h1>
            </header>

            <table className="mx-1 w-full text-sm md:text-base">
                <tbody>
                    <tr className="border-b border-slate-600 text-base">
                        <th className="w-[25%] py-4 px-2 text-left">Producto</th>
                        <th className="w-[20%] py-4 px-2 text-left">Publicado</th>
                        <th className="w-[20%] py-4 px-2 text-left">Categoria</th>
                        <th className="w-[15%] py-4 px-2 text-left">Precio</th>
                        <th className="w-[10%] py-4 px-2 text-left">Stock</th>
                        <th className="w-[10%] py-4 px-2 text-left">{props.role === ROLE_COMPRADOR ? '' : 'Eliminar'}</th>
                    </tr>
                {
                    props.products.map((product,index) => 
                        {
                            return (
                            <tr key={`product_row_${index}`} className="border-b border-slate-600">
                                <td className="py-4 px-2">
                                    <button className="rounded-lg border border-slate-600 
                                    bg-gray-800 p-1 px-3 text-sm text-nowrap overflow-hidden">{product.name}</button>
                                </td>
                                <td className="py-4 px-2">{product.published}</td>
                                <td className="py-4 px-2">{product.category}</td>
                                <td className="py-4 px-2">${product.price}</td>
                                <td className="py-4 px-2">{product.stock}</td>
                                <td className="py-4 px-2">{
                                    props.role === ROLE_VENDEDOR ?
                                    <button className="bg-red-600 py-1 
                                    px-2 rounded-xl text-sm font-semibold hover:bg-red-500 inline">X</button>
                                    : null
                                    }
                                </td>
                            </tr>
                            )
                        }
                    )
                    }
                </tbody>
            </table>
        </article>
    </div>

    )

    return view;
}