'use client'
import { GeneralButton, SubmitButton, SubmitButtonWithState } from "@/components/buttons";
import { CheckIcon,HalfStarIcon, PendingIcon, StarIcon, UndoIcon } from "@/components/icons/miscellaneous";
import { SnackBar, SnackBarProps, SnackBarType } from "@/components/snackbar";
import { sendReviewSSA } from "@/private/actions/order";
import { getRatingStyle } from "@/private/utils/mappers";
import { FillColors } from "@/private/utils/properties";
import { Skeleton } from "@nextui-org/react";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

export default function Review(props : {key : string, rating : number,
    date : string, title : string, body : string, authorPresent : boolean, 
    orgName : string, totalReviews : number, mostRecent : boolean})
{
    const reviewsNoun = (amount : number) => amount != 1 ? 'valoraciones' : 'valoración' 
    const review = (
        <section key={props.key} className="p-2 border rounded-lg my-2 border-slate-600 me-2 flex-1">
        <p className="text-sm ">{props.date}
        { props.mostRecent ? <span className="ms-2 text-sm text-purple-400 font-semibold">Más reciente</span> : null}</p>
        <div className="flex gap-x-2 items-center">
            <RatingStars rating={props.rating}/>
            <p className="font-semibold my-1">{props.title}</p>
        </div>
        <p className="my-3 min-w-[300px]">{props.body}</p>
        {
            props.authorPresent ? <>
            <p className="font-semibold">{props.orgName}<span className="font-normal text-sm"> | {props.totalReviews} {reviewsNoun(props.totalReviews)}</span></p></> 
            : <Skeleton disableAnimation={true} className="px-2 h-6 rounded-lg w-2/3 bg-gray-700"></Skeleton>
        }
        
        </section>
    )

    return review;
}

export function RatingStars(props : {rating : number})
{
    const fullCount = Math.floor(props.rating); //5.4 -> 5
    const halfCount = Math.round(props.rating) - fullCount;  //5.4 -> 5 | 5.6 -> 6

    let stars : any[] = [];

    for(let i = 0; i < fullCount; i++) //Populate with stars
        stars = stars.concat(<StarIcon key={`rating_star_${i}`} size='w-8' fillColor={FillColors.YELLOW}/>);

    if(halfCount) stars = stars.concat(<HalfStarIcon key={`rating_halfstar`} size='w-8' fillColor={FillColors.YELLOW}/>);
    if(!stars.length) stars = stars.concat(<StarIcon key={`rating_star`} size='w-8' fillColor={FillColors.DARK_GRAY}/>);

    return (
        <div className="flex gap-x-2 justify-center">
            {stars}
        </div>
    )
}

export function CreateReview(props : {productName : string, image : string, orderId : number, setShowReview : any, createdCallback : any})
{
    const [titleText, setTitleText] = useState('');
    const [bodyText, setBodyText] = useState('');
    const [showSnack, setShowSnack] = useState(false);
    const [pending,setPending] = useState(false);
    const [ratingMissing, setRatingMissing] = useState(false);

    const snackProps = useRef<SnackBarProps>();
    const inputTitleRef = useRef<HTMLInputElement>(null);
    const inputBodyRef = useRef<HTMLTextAreaElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    
    //Star states (0, 0.5, 1)
    const [states, setStates] = useState([0,0,0,0,0,0]);
    const rating = useRef(-1);

    const ratingStates = {CURRENT : 0, HOVER_CHANGE : 1, CHANGING : 2}
    const [ratingView, setRatingView] = useState(ratingStates.CURRENT);
    
    const initialState = {title : ''};
    const [state, formAction] = useFormState(sendReviewSSA, initialState);

    useEffect(() => 
        {
            setPending(false);
            switch(state.title)
            {
                case 'SUCCESSFUL':
                    props.createdCallback();
                    props.setShowReview(false);
                    break;
                case 'SERVER_ERROR':
                case 'REQUEST_ERROR':
                    showReviewError(setShowSnack,snackProps);
                    break;
            }
        },
        [state]
    )

    const changeRatingPreview = () =>
    (
        <div className={`py-1 px-2 h-8 min-w-[130px] max-w-[160px] rounded-xl justify-content
        flex items-center text-center bg-gray-600 cursor-pointer gap-x-2`}
            onMouseLeave={() => setRatingView(ratingStates.CURRENT)}
            onClick={() => setRatingView(ratingStates.CHANGING)}>
                <UndoIcon size="w-6" fillColor="fill-slate-200"/>
            <p className="text-sm font-semibold flex-1 text-start">Cambiar puntaje</p>
        </div>
    )

    const currentRatingView = () => 
    {
        const ratingStyle = getRatingStyle(rating.current);
        return ( 
        <div className={`py-1 px-2 min-w-[130px] max-w-[160px] h-8 rounded-xl text-sm 
        ${ratingMissing ? 'border border-red-300' : ''}
        font-semibold ${ratingStyle.bgColor} ${ratingStyle.textColor} flex items-center gap-x-1 justify-content cursor-pointer`}
            onMouseEnter={() => setRatingView(ratingStates.HOVER_CHANGE)}>
            <StarIcon fillColor={ratingStyle.fillColor} size="w-6"/>
            <p>{`${rating.current >= 0 ? rating.current : '?'} | ${ratingStyle.title}`}</p>
        </div>
        )
    }

    const changeRatingView = () => 
    {
        const onLeave = () => 
        {
            setRatingView(ratingStates.CURRENT);
            if(rating.current >= 0) setRatingMissing(false);
        }

        const line = (position : number) => 
        {
            let fillColor = states[position] ? FillColors.YELLOW : FillColors.DARK_GRAY
            let currentIcon = () => 
            {
                let view;
                if(states[position] === 0.5)
                {
                    view = 
                    (
                        <HalfStarIcon key={`halfstar_at_${position}`} fillColor={fillColor} size="w-full" />
                    )
                } 
                else 
                {
                    view = 
                    (
                        <StarIcon key={`star_at_${position}`} fillColor={fillColor} size="w-full" />
                    )
                }
                return view;
                
            }  

            const handleStar = (hovering : boolean, half : boolean) => 
            {
                if(hovering) //Si estoy hovereado
                {
                    const value = half ? 0.5 : 1;
                    if(states[position] != value || states[position + 1])   //Si no estoy activado (o el sgte estaba hovereado y movió a mi)
                    {
                        //Me activo a mi y a los restantes (desactivo a los que están adelante)
                        setStates(states.map((_,index) => index < position ? 1 : index === position ? value : 0 ));
                        rating.current = position + (half ? 0.5 : 1);
                    }

                } 
                else //Si no estoy hovereando, desactivar a todos (no hay nadie hovereado)
                {
                    setStates(states.map((_) => 0));
                    rating.current = 0;  
                }
            }

            const view = 
            (
                <div className="relative">
                    <div className="cursor-pointer w-8 h-8" 
                        onMouseEnter={() => handleStar(true,false)}  
                        onMouseLeave={() => handleStar(false,false)}
                        onClick={onLeave}>
                            {currentIcon()}
                    </div>
                    <div className="absolute top-0 cursor-pointer w-4 h-8" 
                        onMouseEnter={() => handleStar(true,true)}  
                        onMouseLeave={() => handleStar(false,true)}
                        onClick={onLeave}>
                    </div>
                </div>
            )
            return view;
        }

        return (
        <div className={`px-2 rounded-xl w-fit bg-gray-600 flex items-center`}>
            {[line(0),line(1),line(2),line(3),line(4)]}
        </div>
        )
        
    }

    const currentView = () => 
    (
        <div className="flex-1">
            {
                ratingView === ratingStates.CURRENT ? currentRatingView() : ratingView === ratingStates.HOVER_CHANGE ?
                changeRatingPreview() : changeRatingView() 
            }
        </div>
    )

    function onChangeTitle(event : SyntheticEvent<HTMLInputElement>)
    {
        setTitleText(event.currentTarget.value);
    }

    function onChangeBody(event : SyntheticEvent<HTMLTextAreaElement>)
    {
        setBodyText(event.currentTarget.value);
    }

    function onFocus(ref : HTMLInputElement | HTMLTextAreaElement)
    {
        ref.focus();
    }

    function onSubmit(event : any) //action se ejecuta luego
    {
        event.preventDefault();
        const form = formRef.current;
        setPending(true);
        if(rating.current < 0 || !titleText || !bodyText )
        {
            showMissingData(setShowSnack,snackProps);
            if(rating.current < 0) setRatingMissing(true);
            setPending(false);
        }
        else form!.requestSubmit();
        
    }

    const view = 
    (
        <div className="fixed top-0 left-0 h-full w-full bg-slate-400 bg-opacity-60 flex items-center">
        <article className="text-slate-200 bg-gray-800 text-center border border-slate-200 w-[550px] h-fit mx-auto px-4 pb-4 rounded-lg">
            <form action={formAction} ref={formRef}>
                <h1 className={`text-center mx-auto w-fit p-2 bg-gray-600 font-semibold text-sm rounded-b-lg `}>Escribir nueva reseña</h1>
                <div className="flex items-center gap-x-3 flex-nowrap my-2">
                <img src={props.image} className="w-12 h-12 flex-shrink-0 rounded-full" />
                <h2 className={`text-nowrap overflow-hidden font-semibold p-1 border border-slate-600 mx-1 rounded-lg`}>
                    {props.productName}</h2>
                </div>

                <div className="flex items-center static" onClick={() => onFocus(inputTitleRef.current!)}>
                    <input type="text" id="title" name='title' required ref={inputTitleRef} onChange={onChangeTitle}
                    className="py-2 w-full bg-slate-800 outline-none flex-1 overflow-hidden"/>
                    {
                        titleText ? <div className="mx-1"><CheckIcon size="w-6" fillColor={FillColors.YELLOW}/></div>
                        :
                        <>
                        <p className="text-slate-400 font-semibold text-sm aria-disabled absolute">Título</p>
                        <div className="mx-1"><PendingIcon size="w-6" fillColor={FillColors.DARK_GRAY}/></div>
                        </>
                    }
                    
                </div>

                <div className="relative" onClick={() => onFocus(inputBodyRef.current!)}>
                    {
                        bodyText ? <div className="absolute right-0 top-0 mx-1 py-3"><CheckIcon size="w-6" fillColor={FillColors.YELLOW}/></div>
                        : 
                        <>
                        <div className="absolute right-0 top-0 mx-1 py-3"><PendingIcon size="w-6" fillColor={FillColors.DARK_GRAY}/></div>
                        <p className="text-slate-400 font-semibold aria-disabled text-sm absolute my-3">
                            Este producto me ha parecido...
                        </p>
                        </>
                    }
                    <textarea id="description" name='summary' required rows={1} cols={1} ref={inputBodyRef} onChange={onChangeBody} 
                    className="py-2 pe-3 bg-slate-800 border-t w-full border-slate-600 h-[125px] outline-none">
                    </textarea>
                </div>
        
                <section className="flex items-center border-t border-slate-600 pt-3">
                        {currentView()}
                        <GeneralButton title='Cancelar' main={false} onClick={() => props.setShowReview(false)}/>
                        <SubmitButtonWithState title='Confirmar' pending={pending} onClick={onSubmit}/>
                </section>

                <input type='hidden' name='rating' id='rating' value={rating.current}/>
                <input type='hidden' name='orderId' id='orderId' value={props.orderId}/>
            </form>
      </article>
        { 
            showSnack ? <SnackBar key="Review_Snack" title={snackProps.current!.title} 
            body={snackProps.current!.body} type={snackProps.current!.type} options={snackProps.current!.options}/> : null
        }
      </div>
      
    )

    return view;
}

function showReviewError(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.ERROR,"Error al publicar reseña.",
    "Ocurrió un error y no pudimos subir tu reseña. Inténtalo más tarde.",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

function showMissingData(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.INFORMATIVE,"Faltan datos",
    "Te quedan datos por completar",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}