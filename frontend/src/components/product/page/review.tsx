import { Skeleton } from "@nextui-org/react";

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

    const fullStar = (key : string) => <svg key={key} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-[#DAA520] w-8">
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>
    
    const halfStar = (key : string) => <svg key={key} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-[#DAA520] w-8">
        <path d="M12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27V2Z" /></svg>
    
    const noStar = (key : string) => <svg key={key} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-[#696969] w-8">
    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>

    const map = () => 
    {
        let list : any[] = [];
        for(let i = 0; i < fullCount; i++) list = list.concat(fullStar(`star_${i}`));
        if(halfCount) list = list.concat(halfStar('half_star'));
        if(!list.length) list = list.concat(noStar('no_star'));
        return list;

    }

    return (
        <div className="flex gap-x-2">
            {map()}
        </div>
    )
}