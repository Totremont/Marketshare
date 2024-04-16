'use client'
import Alert from "@/components/alert";
import { ChipFeature } from "@/components/chips";
import { CashIcon, CheckbookIcon, CreditCardIcon, MarkIcon } from "@/components/icons/miscellaneous";
import CircleColors, { CircleColorData } from "@/components/product/page/colors";
import SellerReputation from "@/components/product/page/reputation";
import Review, { RatingStars } from "@/components/product/page/reviews";
import { SnackBar, SnackBarOption, SnackBarProps, SnackBarType } from "@/components/snackbar";
import { ROLE_VENDEDOR, ROLE_VISITANTE } from "@/middleware";
import { createOrderSSA, findReviewsFromClientSSA } from "@/private/actions/order";
import { findUserByIdSSA } from "@/private/actions/user";
import { formatPrice, getAverageRating, getCategoryIcon, getOrderStatus, toBackgroundColor, toSpecialFeature } from "@/private/utils/mappers";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


export default function ProductInfo(props : {
    //Rol del usuario que está viendo la pantalla
    role : string,
    //Product props
    id : number, name : string, category : string, images : string[], productState : string,
    brief : string, price : {full : {value : number, text : string}, discount : {value : number,text : string}}, 
    discount : number, colors : string[], 
    published : string, description : string, features : {feature : string, value : string}[], 
    specialFeatures : string[], stock : number, sellerRegisterDate : string,
    
    productOrders : any[], productReviews : any[],                  //Only completed (sold)
    seller : any, sellerOrders : any[], sellerReviews : any[],    //Only completed
    client : any

})
{
    //Reviews include date and client_id | 
    const [color, setColor] = useState(props.colors[0]);
    const [units, setUnits] = useState(1);
    const [mainImage, setMainImage] = useState<{url : string, id : string}>({url : props.images[0], id : 'image_0'});
    const [authors, setAuthors] = useState<any[]>([]);
    const [reviews, setReviews] = useState<{review : any, author : any | null}[]>([]);
    const [showPurchaseAlert, setShowPurchaseAlert] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [showSnack, setShowSnack] = useState(false);

    const finalPrice = useRef(props.price.discount.value);
    const snackProps = useRef<SnackBarProps>();

    const router = useRouter();

    const colorData = props.colors.map(it => 
    {
        const color = toBackgroundColor(it);
        return new CircleColorData(color,it);
    })

    const specialFeatures = props.specialFeatures.map(it => toSpecialFeature(it));
    const productRating = getAverageRating(props.productReviews.map(it => it.rating));
    const sellerRating = getAverageRating(props.sellerReviews.map(it => it.rating));
    //const sellerTota = 

    const unitsNoun = (amount : number) => amount != 1 ? 'unidades' : 'unidad'; 
    const reviewsNoun = (amount : number) => amount != 1 ? 'valoraciones' : 'valoración';
    const soldNoun = (amount : number) => amount != 1 ? 'vendidas' : 'vendida';

    const changeUnits = (increase : boolean) => 
    {
        if(!increase && units > 1) setUnits(units - 1);
        
        else if(increase && units < props.stock) setUnits(units + 1);
        
        //finalPrice.current = props.price.discount.value * units;
    }

    const onPurchase = () => 
    {
        if(props.role == ROLE_VENDEDOR) showInvalidRole(setShowSnack,snackProps);
        else if(props.role == ROLE_VISITANTE) router.push('/'); 
        else 
        {
            finalPrice.current = Math.round(props.price.discount.value * units);
            setShowPurchaseAlert(true);
        }
    }

    const onConfirmPurchase = () => 
    {
        setIsBuying(true);
        setShowPurchaseAlert(false);
        const data = {
            clientId : props.client.id,
            sellerId : props.seller.id,
            productId : props.id,
            amount : units,
            discount : props.discount,
            finalPrice : finalPrice.current,
            extras : color
        };
        createOrderSSA(data)
        .then
        (
            res => 
            {
                const status : {status : string, date : Date} = getOrderStatus(res);
                switch(status.status)
                {
                    case 'RECIBIDO':
                    {
                        showSuccessful(setShowSnack,snackProps);
                        setIsBuying(false);
                        break;
                    }
                    case 'SIN_STOCK':
                    {
                        showNotEnoughStock(setShowSnack,snackProps);
                        setIsBuying(false);
                        break;
                    }
                    case 'RECHAZADO':
                    {
                        showNotEnoughMoney(setShowSnack,snackProps);
                        setIsBuying(false);
                        break;
                    }
                    default:
                    {
                        showServerError(setShowSnack,snackProps);
                        setIsBuying(false);
                        break;
                    }
                }
            },
            (err) => { showServerError(setShowSnack,snackProps); setIsBuying(false);}
        )

    };
    const onDismiss = () => {setShowPurchaseAlert(false)};

    const findReviewsAuthors = () =>
    {
        props.productReviews.forEach(current => 
        {
            let author = authors.find(auth => auth.id === current.client_id);
            if(author)  //If author was already fetched
            {
                setReviews(reviews.concat({review : current, author : author}))
            }
            else findUserByIdSSA(current.client_id) //If not, fire a promise
            .then(
                async user => {
                    author = user;
                    let authorReviews : any[] = [];
                    await findReviewsFromClientSSA(author.id).then(res => authorReviews = res );
                    author.reviews = authorReviews;
                    setAuthors(authors.concat(author));
                    setReviews(reviews.concat({review : current, author : author}))
                },
                err => setReviews(reviews.concat({review : current, author : null})) 
            ); 
        })
    }

    useEffect(findReviewsAuthors,[]);   

    const view = 
    (    
    <div className="h-fit max-w-[1500px] mx-auto">
        <div className="flex items-center gap-x-2">
            {getCategoryIcon(props.category,`icon_category_from_product_${props.id}`)}
            <p className="text-gray-300 text-sm flex-1">Categoría |
            <span className="text-blue-400 font-semibold mx-1">{props.category}</span> 
            </p>
        </div>

        <article className="border-y border-slate-600 mt-2 flex items-center py-2 content-start">
            <section className="text-slate-200 overflow-hidden">
                <h1 className="px-2 border rounded-lg py-1 bg-slate-900 border-slate-400 font-semibold">
                {props.seller.organization.name}<span className="text-sm text-slate-300 font-normal "> | Tienda oficial</span>
                </h1>
            </section> 
            <div className="text-end flex-1">
                <button className="rounded-lg bg-blue-500 p-1 px-3 font-semibold text-gray-100 my-1 text-sm mx-2">Sitio web</button>
                <button className="rounded-lg bg-gray-500 p-1 px-3 font-semibold text-slate-50 my-1 text-sm mx-2">Contacto</button>
            </div>
        </article>

        <div className="sm:grid sm:grid-cols-[2fr_1fr] sm:gap-x-3">

        <section className="my-3">
            <article className="sm:grid sm:grid-cols-[1fr_1fr] sm:gap-x-3">

                <div className="shrink-0">
                    <img src={mainImage.url}/>
                    <p className="font-semibold my-2">Más imágenes</p>

                    {props.images.map((it,index) =>  
                    {
                        const id = `image_${index}`;
                        return <img 
                        id={id}
                        key={id}
                        onClick={() => setMainImage({url : it, id : id})}
                        src={it} 
                        className={`w-10 cursor-pointer h-10 mx-2 my-1 rounded-md inline ${mainImage.id === id ? 'border-yellow-600 border-2' : ''}`}/>
                     } )}

                </div>

                <div>

                    <h1 className="font-bold text-2xl sm:m-1 my-5">{props.name}</h1>
                    <section className="my-3 border p-2 rounded-lg border-slate-500 flex items-center gap-3">
                        <div className="text-center">
                            <RatingStars rating={productRating}/>
                            <p className="font-semibold">{productRating}</p>
                        </div>
                        <div className="text-sm border-s ps-2 border-slate-600 text-slate-300">
                            <p className="mb-1">
                            <span className="font-semibold text-orange-200">{props.productState}</span> | {props.productOrders.length} {soldNoun(props.productOrders.length)}</p>
                            <p>{props.productReviews.length} {reviewsNoun(props.productReviews.length)}</p>
                        </div>
                    </section>

                    <p className="my-3 max-h-[200px] overflow-hidden">{props.brief}</p>
                    <p className="font-bold text-3xl my-4">${props.price.discount.text}
                    {
                        props.discount > 0 ? 
                        <>
                            <span className="text-sm text-orange-200 mx-2">-{props.discount}%</span>
                            <span className="text-lg line-through font-normal text-slate-300">${props.price.full.text}</span>
                        </> : null 
                    }</p>

                    <div>
                        <div>
                            <h4 className="mb-2 font-semibold">Colores disponibles</h4>
                            <CircleColors data={colorData} setSelected={setColor} initialState={props.colors[0]}/>
                        </div>
                        <div className="my-3">
                            <h4 className="font-semibold">Publicado</h4>
                            <p>{props.published}</p>
                        </div>

                    </div>
                </div>

            </article>

            <article className="my-3 sm:border-t sm:pt-2 sm:border-slate-600 sm:me-3">
                <h1 className="font-semibold my-2">Características</h1>
                <p className="my-3 ">{props.description}</p>
                <section className="sm:grid sm:grid-cols-2 overflow-hidden">
                    {props.features.map((it,index) => 
                    <div key={`row_${index}`} className="flex items-center gap-x-4 overflow-hidden border-s sm:border-s-0 border-e px-3 py-2 border-slate-600">
                        <h4 className="font-semibold py-2 flex-1">{it.feature}</h4>
                        <p className="flex-2 text-end">{it.value}</p>
                    </div> )}
                    
                </section>
            </article>

        </section>

        <section className="shrink-0">
            <article className="bg-gray-800 rounded-lg my-3 p-3">
            <h1 className="font-semibold">Detalles de compra</h1>
            <ul className="my-3">
            <div className="flex my-2 gap-2 flex-wrap">
                {specialFeatures.map((it,index) => <ChipFeature key={`feature_${index}`} feature={it} />)}
            </div>
                <li className="font-semibold before:content-['•'] before:pr-2 before:text-orange-200 mt-1">Stock disponible <span className="text-gray-300 text-sm">({props.stock} restantes)</span></li>
                <div className="flex items-center my-3">
                    <li className="before:content-['•'] before:pr-2 before:text-orange-200 w-[180px]">
                        Cantidad: <span className="font-semibold">{units} {unitsNoun(units)}</span>
                    </li>
                    <div className="border rounded-full mx-3 border-slate-300 flex" >
                        <button 
                            onClick={() => changeUnits(true)}
                            className="pb-1 px-2 border-e border-inherit rounded-l-full hover:bg-gray-700">+</button>
                        <button 
                            onClick={() => changeUnits(false)}
                            className="pb-1 px-2 pe-3 rounded-r-full hover:bg-gray-700 ">-</button>
                    </div>
                </div>
            </ul>
            {
                !isBuying ? <button onClick={onPurchase} 
                className="hover:bg-teal-600 rounded-lg bg-teal-700 p-2 px-4 font-semibold text-gray-100 my-5 block w-full">
                    Comprar ahora</button>

                : <button aria-disabled
                className="rounded-lg bg-[#696969] p-2 px-4 font-semibold text-gray-100 my-5 block w-full">
                    Comprando...</button>
            }

            <h2 className="font-semibold">Opciones de pago</h2>
            <div className="flex items-center gap-x-2 my-2">
                <CashIcon/>
                <p className="flex-1">Efectivo</p>
                <div className=" w-fit flex items-center gap-x-1 font-semibold text-purple-200 p-1 px-2 text-sm bg-purple-800 rounded-lg">
                <MarkIcon/>
                <p>3 cuotas sin interés</p>
                </div>
            </div>
            <div className="flex items-center gap-x-2 my-2">
                <CreditCardIcon/>
                <p>Tarjetas de crédito y débito</p>
            </div>
            <div className="flex items-center gap-x-2 my-2">
                <CheckbookIcon/>
                <p>Cheque bancario</p>
            </div>


            <div className="flex my-5 border-t pt-3 border-slate-600 items-center ">
            <img src={`/marketshare.svg`} className={`w-32`} />
            <p className="mx-2 text-sm">Compra protegida</p>
            </div>
            </article>

            <article className="bg-gray-800 rounded-lg my-4 p-3">
                <h1 className="font-semibold">Detalles del vendedor</h1>
                <section className="border-slate-600 pt-2 text-slate-200 overflow-hidden my-1 text-center">
                <h1 className="px-2 border rounded-lg py-1 bg-slate-900 border-slate-400 font-semibold">
                {props.seller.organization.name}, {props.seller.country.name}</h1>
                <p className="mt-1 font-semibold text-slate-300 ">{props.seller.name}</p>
                </section>

                <div className="my-2">
                    <p className="text-center text-sm text-slate-300">En marketshare desde {props.sellerRegisterDate}</p>
                    <div className="flex gap-8 justify-center my-4">

                        <div className="text-center">
                        <h2 className="">Valoración</h2>
                        <h3 className="font-semibold text-3xl">{sellerRating}</h3>
                        <h5 className="text-sm">{props.sellerReviews.length} {reviewsNoun(props.sellerReviews.length)}</h5>
                        </div>

                        <div className="text-center">
                        <h2 className="">Ventas</h2>
                        <h3 className="font-semibold text-3xl">{props.sellerOrders.length}</h3>
                        </div>

                    </div>
                </div>

                <SellerReputation rating={sellerRating} totalSells={props.sellerOrders.length} totalReviews={props.sellerReviews.length}/>

                {sellerRating >= 4 ?
                    <section>
                        <h1 className="text-center font-semibold">¿Qué caracteriza a Microsoft?</h1>
                        <div className="mt-3">
                            <div className="border-b border-slate-600 py-2 flex items-center gap-2">
                                <p className="before:content-['🪙']"></p>
                                <p className="text">Buenos precios</p>
                            </div>
                            <div className="border-b border-slate-600 py-2 flex items-center gap-2">
                                <p className="before:content-['🤝🏻']"></p>
                                <p className="text">Atención post-venta</p>
                            </div>
                            <div className="border-b border-slate-600 py-2 flex items-center gap-2">
                                <p className="before:content-['🚚']"></p>
                                <p className="text">Envíos rápidos</p>
                            </div>
                        </div>
                    </section> : null
                } 
                
            </article>

        </section>

        </div>

        <article className="">
            <h2 className="font-semibold border-slate-600 my-3">Opiniones de compradores</h2>
            <div className="flex flex-wrap">    
            {
                reviews.map(({review,author},index) => 
                <Review key={`review_by_${author.name ?? 'unknown'}_${index}`} rating={review.rating} date={review.date} authorPresent={!!author}
                    title={review.title} body={review.summary} orgName={author.organization.name} 
                    totalReviews={author.reviews.length} mostRecent={index === 0}  /> 
                )
            }
            </div>
        </article>

        { showPurchaseAlert ? 
        <Alert title={'Estás a punto de realizar una compra'} 
        body={{main : `$${formatPrice(finalPrice.current)}`, secondary : `${props.name} (x${units})`}}
        callbacks={{onConfirm : onConfirmPurchase, onCancel : onDismiss}} /> : null
        }

        { showSnack ? 
        <SnackBar key="SNACK" title={snackProps.current!.title} 
            body={snackProps.current!.body} type={snackProps.current!.type} options={snackProps.current!.options}/> : null
        }

    </div>
    );

    return view;
}

function showNotEnoughStock(setShowSnack : any, ref : any, time : number = SnackBarType.LONG_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.ERROR,"Falta de stock",
    "No hay suficiente stock de este producto para realizar esta compra. Lo sentimos.",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

function showNotEnoughMoney(setShowSnack : any, ref : any, time : number = SnackBarType.LONG_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.ERROR,"No tienes dinero",
    "No posees el dinero suficiente para realizar esta compra.",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

function showServerError(setShowSnack : any, ref : any, time : number = SnackBarType.LONG_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.ERROR,"Ocurrió un error",
    "Algo salió mal al tratar de procesar el pedido. La orden no fue concretada.",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

function showSuccessful(setShowSnack : any, ref : any, time : number = SnackBarType.LONG_TIME )
{
    const viewOrder = new SnackBarOption('Ver estado', () => {});
    ref.current = new SnackBarProps(SnackBarType.SUCCESSFUL,"Order hecha!",
    "Tu orden ha sido procesada y recibida correctamente.",[viewOrder]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

function showInvalidRole(setShowSnack : any, ref : any, time : number = SnackBarType.LONG_TIME )
{
    const changeAccount = new SnackBarOption('Cambiar cuenta', () => {});
    ref.current = new SnackBarProps(SnackBarType.INFORMATIVE,"Eres vendedor",
    "Para adquirir productos debes poseer una cuenta de tipo comprador.",[changeAccount]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}