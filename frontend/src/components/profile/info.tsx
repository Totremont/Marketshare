'use client'
import { ROLE_COMPRADOR, ROLE_VENDEDOR } from "@/middleware";
import { formatPrice, getCategoryIcon, getOrderStatus, isOrderTerminated} from "@/private/utils/mappers";
import { useEffect, useRef, useState } from "react";
import { RatingStars } from "../product/page/reviews";
import SellerReputation from "../product/page/reputation";
import { BackgroundColors, ContrastTextColors, OrderStatus } from "@/private/utils/properties";
import { useRouter } from "next/navigation";

//roleProducts -> Mis productos si soy vendedor, productos sugeridos si soy comprador
export default function ProfileInfo(props : 
    {
        role : string, 
        ordersWithData : {order : any, product : {id : string, name : string}, seller : any | null, client : any | null}[], 
        user : any, 
        categories : {category : string, ocurrency : number}[], 
        roleProducts : {id : string, name : string, stock : string, price : string, published : string, seller : any, orders : any[], 
        category : string}[]
    }
) 
{
    const ordersCompleted = useRef<any[]>(props.ordersWithData.filter(it => getOrderStatus(it.order).status === OrderStatus.ENTREGADO));
    const moneySpent = useRef<string>(setMoneySpent());
    const userOrderSpecial = useRef<any>();

    const ordersWithReview = useRef<any[]>(ordersCompleted.current.filter(it => it.order.review));
    const sellerValoration = useRef(0);
    const statusProps = useRef<{background : string, text : string}>();

    const router = useRouter();

    const [render, setRender] = useState(false);

    useEffect(() => 
    {
        //reviews.current = ordersCompleted.current.filter(it => it.review).map(it => it.review);
        userOrderSpecial.current = props.role === ROLE_COMPRADOR ? setMostExpensiveOrder() : setBestSellingProduct();
        sellerValoration.current = setValoration();
        setRender(true);
    },[])

    function setMoneySpent() 
    {
        let sum = 0;
        ordersCompleted.current.forEach(it => sum += it.order.price);
        return formatPrice(sum);
    }

    function setMostExpensiveOrder()
    {
        ordersCompleted.current.sort((a,b) => b.order.price - a.order.price)    //Si a es más caro, va primero
        const mostExpensive = ordersCompleted.current[0];

        return {
            product : mostExpensive.product,
            order : mostExpensive.order,
            price : formatPrice(mostExpensive.order.price)
        }
    }

    function setBestSellingProduct()
    {
        //Al ordenar estamos poniendo los elementos repetidos uno al lado del otro
        ordersCompleted.current.sort((a,b) => a.order.product_id - b.order.product_id);
        let lastId = -1;
        let data : {product : any, units : number}[] = [];

        ordersCompleted.current.forEach(it => 
            {
                if(it.order.product_id === lastId) data[data.length - 1].units += it.order.amount;
                else
                {
                    //const product = props.roleProducts.find(pr => Number(pr.id) === it.order.product_id);
                    data = data.concat({product : it.product, units : it.order.amount});
                    lastId = it.order.product_id;
                }
            }
        );
        data.sort((a,b) => b.units - a.units);

        return data[0]; //{product, units}
    }

    function setValoration()
    {
        let sum = 0;
        let div = ordersWithReview.current.length;
        ordersWithReview.current.forEach(it => {sum += it.order.review.rating});
        const value = sum/(div > 0 ? div : 1);
        return Math.round(value*100)/100;
    }

    function setOrderInfoProps(status : string)
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

    function reviewsView()
    {
        if(props.role === ROLE_VENDEDOR)
        {
            return (
                <div>
                    <p className="my-2 text-sm">Tu valoración</p>
                    <RatingStars rating={sellerValoration.current} starSize='w-5 h-5'/>
                        <p className="text-sm my-1">{ordersWithReview.current.length} reseñas</p>
                    {
                        <SellerReputation rating={sellerValoration.current} 
                        totalReviews={ordersWithReview.current.length} totalSells={ordersCompleted.current.length} />
                    }
                </div>
            )
        } 
        else 
        {
            //De menor rating a mayor
            const reviews = ordersWithReview.current.map(it => it.order.review);
            reviews.sort((a,b) => a.rating - b.rating)
            const worst = reviews[0];
            const best = reviews.length > 0 ? reviews[reviews.length - 1] : null;

            return (
                <div>
                    <p className="mb-1 text-sm">Tus reseñas</p>
                    <h3 className="my-1 text-2xl overflow-hidden font-semibold">{reviews.length}</h3>
                    <p className="my-2">Peor reseña: <span className="font-semibold">{worst?.rating ?? 'ninguna'}</span></p>
                    <p className="my-2">Mejor reseña: <span className="font-semibold">{best?.rating ?? 'ninguna'}</span></p>
                </div>
            )
        }
    }

    const view = 
    (
    <div className="h-fit max-w-[1500px] mx-auto">
        <article className="rounded-lg border border-slate-600 bg-slate-800 
        sm:grid sm:grid-cols-2 md:grid-cols-4 w-fit sm:mx-auto md:text-center">
            <section className="border-b border-slate-600 p-4 sm:col-span-2 md:col-span-4">
                <h1>Tu vista como {props.role === ROLE_COMPRADOR ? 'comprador' : 'vendedor'}</h1>
                <h2 className="my-2 text-xl font-semibold my-1">{props.user.name}</h2>
                
                <h3 className='text-lg'>{props.user.country.name} • {props.user.organization.name} 
                {props.user.bank ? ` • ${props.user.bank.name}` : ''}</h3>
                
                <div className="flex gap-x-2 justify-center items-center my-4">
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
                <p className="mt-1 text-2xl font-semibold">${moneySpent.current}</p>
            </section>

            <section className="border-e border-slate-600 p-4">
                <p>{props.role === ROLE_COMPRADOR ? 'Tu pedido más caro es' : 'Tu producto más vendido es'}</p>
                <p className="mt-1 text-2xl h-16 overflow-hidden font-semibold">
                    {
                        userOrderSpecial.current ? userOrderSpecial.current.product.name  : 'Ninguno'
                    }
                </p>
                <div className="my-1">
                    {
                        userOrderSpecial.current ? 
                            (props.role === ROLE_COMPRADOR) ? 
                            <div>
                                    <p>Unidades compradas: 
                                        <span className="font-semibold mx-2">{userOrderSpecial.current.order.amount}</span></p>
                                    <h3 className="my-2 font-semibold">${userOrderSpecial.current.price}</h3>
                            </div>
                            : 
                            <div>
                                <p>Unidades vendidas: <span className="font-semibold">{userOrderSpecial.current.units}</span> </p>
                            </div>
                        : <p>¡Es tu momento de empezar!</p>
                    }
                </div>
            </section>

            <section className="p-4">
                <div className="rounded-xl bg-slate-700  px-3 py-1 md:text-center w-fit md:mx-auto">
                    {reviewsView()}
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
                        <th className="w-[25%] text-left py-4 px-2 overflow-hidden">Producto</th>
                        <th className="w-[20%] text-left py-4 px-2">{props.role === ROLE_COMPRADOR ? 'Vendedor' : 'Comprador'}</th>
                        <th className="w-[20%] text-left py-4 px-2">Estado</th>
                        <th className="w-[15%] text-left py-4 px-2">Precio</th>
                        <th className="w-[10%] text-left py-4 px-2">Unidades</th>
                        <th className="w-[10%] text-left py-4 px-2">Acciones</th>
                    </tr>
                    {
                        props.ordersWithData.map(({order, product, client, seller},index) => 
                        {
                            const status = getOrderStatus(order).status;
                            setOrderInfoProps(status);
                            let actionText = 'No disponible';
                            let actionColor = BackgroundColors.GRAY;
                            let reviewed = false;
                            if(status === OrderStatus.ENTREGADO && props.role === ROLE_COMPRADOR)
                            {
                                if(!order.review)
                                {
                                    actionText = 'Reseñar'
                                    actionColor = BackgroundColors.GREEN;
                                } else reviewed = true;
                            } 
                            else if(!isOrderTerminated(status) && props.role === ROLE_COMPRADOR)
                            {
                                actionText = 'Cancelar';
                                actionColor = BackgroundColors.SIENNA_BROWN;
                            }

                            return (
                            <tr key={`order_row_${index}`} className="border-b border-slate-600">
                                <td className="py-4 px-2">
                                    <button onClick={() => router.push(`/product/${product.id}`)}
                                    className="rounded-lg border border-slate-600 
                                    bg-gray-800 p-1 px-3 text-sm text-nowrap overflow-hidden">{product.name}</button>
                                </td>
                                <td className="py-4 px-2">{props.role === ROLE_COMPRADOR ? seller.name : client.name}</td>
                                <td className="py-4 px-2">
                                    <div className="flex items-center gap-x-2 ">
                                        <div className={`${statusProps.current?.background} w-4 h-4 rounded-full`}></div>
                                        <p>{statusProps.current?.text}</p>
                                    </div>
                                </td>
                                <td className="py-4 px-2">{formatPrice(order.price)}$</td>
                                <td className="py-4 px-2">{order.amount}</td>
                                <td className="py-4 px-2">
                                    {
                                        reviewed ? <RatingStars rating={order.review.rating} starSize="w-5"/>
                                        :
                                            <button className={`rounded-lg w-full text-center 
                                            ${actionColor} p-1 px-3 text-sm overflow-hidden`}>
                                                {actionText}
                                            </button>
                                        
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
                        <th className="w-[25%] py-4 px-2 text-left overflow-hidden">Producto</th>
                        <th className="w-[20%] py-4 px-2 text-left">{props.role === ROLE_COMPRADOR ? 'Vendedor' : 'Publicado'}</th>
                        <th className="w-[20%] py-4 px-2 text-left">Categoria</th>
                        <th className="w-[15%] py-4 px-2 text-left">Precio</th>
                        <th className="w-[10%] py-4 px-2 text-left">Stock</th>
                        <th className="w-[10%] py-4 px-2 text-left">{props.role === ROLE_COMPRADOR ? 'Publicado' : 'Reseñas'}</th>
                    </tr>
                {
                    props.roleProducts.map((it,index) => 
                        {
                            const reviews = it.orders.filter(it => it.review);
                            return (
                            <tr key={`product_row_${index}`} className="border-b border-slate-600">
                                <td className="py-4 px-2">
                                    <button onClick={() => router.push(`/product/${it.id}`)} 
                                    className="rounded-lg border border-slate-600 
                                    bg-gray-800 p-1 px-3 text-sm text-nowrap overflow-hidden">{it.name}</button>
                                </td>
                                <td className="py-4 px-2">{props.role === ROLE_COMPRADOR ? it.seller.name : it.published}</td>
                                <td className="py-4 px-2">{it.category}</td>
                                <td className="py-4 px-2">${it.price}</td>
                                <td className="py-4 px-2">{it.stock}</td>
                                <td className="py-4 px-2">
                                {
                                    props.role === ROLE_VENDEDOR ? reviews.length
                                    : it.published
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