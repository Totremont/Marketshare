'use client'
import { ChipFeature } from "@/components/chips";
import ColorsPreview, { ColorData } from "@/components/product/page/colors";
import SellerReputation from "@/components/product/page/reputation";
import Review, { RatingStars } from "@/components/product/page/review";
import { getAverageRating, toBackgroundColor, toSpecialFeature } from "@/private/utils/mappers";
import { useEffect, useState } from "react";


export default function ProductInfo(props : {
    //Product props
    category : string, images : string[], productState : string,
    brief : string, price : {full : string, discount : string}, discount : number, colors : string[], 
    published : string, description : string, features : {feature : string, value : string}[], 
    specialFeatures : string[], stock : number, 
    
    productOrders : any[], productReviews : any[],                  //Only completed (sold)
    seller : any, sellerOrders : any[], sellerReviews : any[]    //Only completed

})
{
    const [color, setColor] = useState('');
    const [units, setUnits] = useState(1);
    const [mainImage, setMainImage] = useState<{url : string, id : string}>({url : props.images[0], id : 'image_0'});

    const colorData = props.colors.map(it => 
    {
        const color = toBackgroundColor(it);
        return new ColorData(color,it);
    })

    const specialFeatures = props.specialFeatures.map(it => toSpecialFeature(it));

    const productRating = getAverageRating(props.productReviews.map(it => it.rating));

    const sellerRating = getAverageRating(props.sellerReviews.map(it => it.rating));

    //useEffect(() => setMainImage('image_0'),[]);

    const view = 
    (    
    <div className="h-fit max-w-[1500px] mx-auto">

        <p className="text-gray-300 text-sm">Categoría |
        <span className="text-blue-400 font-semibold mx-1">{props.category}</span> 
        </p>

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
                        className={`w-10 h-10 rounded-md inline ${mainImage.id === id ? 'border-yellow-600 border-2' : ''}`}/>
                     } )}

                </div>

                <div>

                    <h1 className="font-bold text-2xl sm:my-0 my-5">Cafetera Express Daewoo</h1>
                    <section className="my-2 border p-2 rounded-lg border-slate-500 flex items-center gap-3">
                        <div className="text-center">
                            <RatingStars rating={productRating}/>
                            <p className="font-semibold">{productRating}</p>
                        </div>
                        <div className="text-sm border-s ps-2 border-slate-600 text-slate-300">
                            <p className="mb-1">
                            <span className="font-semibold text-orange-200">{props.productState}</span> | {props.productOrders.length} vendidas</p>
                            <p>{props.productReviews.length} valoraciones</p>
                        </div>
                    </section>

                    <p className="my-3 max-h-[200px] overflow-hidden">{props.brief}</p>
                    <p className="font-bold text-3xl my-4">${props.price.discount}
                    {
                        props.discount > 0 ? 
                        <>
                            <span className="text-sm text-orange-200 mx-2">-{props.discount}%</span>
                            <span className="text-lg line-through font-normal text-slate-300">${props.price.full}</span>
                        </> : null 
                    }</p>

                    <div>
                        <div>
                            <h4 className="mb-2 font-semibold">Colores disponibles</h4>
                            <ColorsPreview data={colorData} setSelected={setColor} initialState={props.colors[0]}/>
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
                    {props.features.map(it => 
                    <div className="flex items-center gap-x-4 overflow-hidden border-s sm:border-s-0 border-e px-3 py-2 border-slate-600">
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
                {specialFeatures.map(it => <ChipFeature feature={it} />)}
            </div>
                <li className="font-semibold before:content-['•'] before:pr-2 before:text-orange-200 mt-1">Stock disponible <span className="text-gray-300 text-sm">({props.stock} restantes)</span></li>
                <div className="flex items-center my-3">
                    <li className="before:content-['•'] before:pr-2 before:text-orange-200">
                        Cantidad: <span className="font-semibold">{units} unidad</span>
                    </li>
                    <div className="border rounded-full mx-3 border-slate-300 flex" >
                        <button 
                            onClick={() => setUnits(units + 1)}
                            className="pb-1 px-2 border-e border-inherit rounded-l-full hover:bg-gray-700">+</button>
                        <button 
                            onClick={() => {if(units > 1) setUnits(units - 1)}}
                            className="pb-1 px-2 pe-3 rounded-r-full hover:bg-gray-700 ">-</button>
                    </div>
                </div>
            </ul>

            <button className="rounded-lg bg-teal-700 p-2 px-4 font-semibold text-gray-100 my-5 block w-full">Comprar ahora</button>

            <h2 className="font-semibold">Opciones de pago</h2>
            <div className="my-3 flex items-center">
                <p className="before:content-['💵'] before:pr-1">Efectivo</p>
                <p className="flex-1 text-end text-purple-200 font-semibold">3 cuotas sin interés</p>
            </div>
                <p className="mt-2 before:content-['💳'] before:pr-1">Tarjetas de crédito</p>
                <p className="mt-2 before:content-['💳'] before:pr-1">Tarjetas de débito</p>

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
                </section>

                <div className="my-2">
                    <p className="text-center text-sm text-slate-300">En marketshare desde {props.seller.registerDate}</p>
                    <div className="flex gap-8 justify-center my-4">

                        <div className="text-center">
                        <h2 className="">Valoración</h2>
                        <h3 className="font-semibold text-3xl">{sellerRating}</h3>
                        <h5 className="text-sm">{props.sellerReviews.length} valoraciones</h5>
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
                props.productReviews.map((it,index) => <Review rating={it.rating} date={'25/06/24'} 
                    title={it.title} body={it.summary} orgName={'IBM'} 
                    totalReviews={5} mostRecent={index === 0}  /> )
            }
            </div>
        </article>


    </div>
    );

    return view;
}