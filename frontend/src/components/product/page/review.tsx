
export default function Review(props : {rating : number,
    date : string, title : string, body : string, orgName : string, totalReviews : number, mostRecent : boolean})
{
    const review = (
        <section className="p-2 border rounded-lg my-2 border-slate-600 me-2 flex-1">
        <p className="text-sm ">{props.date}
        { props.mostRecent ? <span className="ms-2 text-sm text-purple-400 font-semibold">Más reciente</span> : null}</p>
        <div className="flex gap-x-2 items-center">
            <RatingStars rating={props.rating}/>
            <p className="font-semiboldmy-1">{props.title}</p>
        </div>
        <p className="my-3 min-w-[300px]">{props.body}</p>
        <p className="font-semibold">{props.orgName}<span className="font-normal text-sm"> | {props.totalReviews} valoraciones</span></p>
        </section>
    )

    return review;
}

export function RatingStars(props : {rating : number})
{
    const fullCount = Math.floor(props.rating); //5.4 -> 5
    const halfCount = Math.round(props.rating) - fullCount;  //5.4 -> 5 | 5.6 -> 6

    const fullStar = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-[#DAA520] w-8">
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>
    
    const halfStar = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-[#DAA520] w-8">
        <path d="M12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27V2Z" /></svg>
    
    const noStar = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-[#696969] w-8">
    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>

    const map = () => 
    {
        let list = [];
        for(let i = 0; i < fullCount; i++) list = list.concat(fullStar);
        if(halfCount) list = list.concat(halfCount);
        if(!list.length) list = list.concat(noStar);
        return list;

    }

    return (
        <div className="flex gap-x-2">
            {map()}
        </div>
    )
}