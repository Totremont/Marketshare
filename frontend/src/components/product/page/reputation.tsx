
export default function SellerReputation(props : {rating : number, totalReviews : number, totalSells : number})
{
    const rate = Math.round(props.rating);
    const great = ( 
    <div className="my-4 text-center">
        <div className="my-4 rounded-lg bg-[#A0522D] p-2 px-3 text-sm font-semibold text-gray-100 text-center">Gran vendedor</div>
        <p className="text-sm text-slate-300">Ha demostrado ser confiable y profesional</p>
    </div> 
    );

    const newby = ( 
    <div className="my-4 text-center">
        <div className="my-1 rounded-lg bg-[#FFE4C4] p-2 px-3 text-sm font-semibold text-gray-800 text-center">Vendedor nuevo</div>
    </div>
    );

    const bad = (
    <div className="my-4 text-center">
      <div className=" my-1 rounded-lg bg-[#CD5C5C] p-2 px-3 text-sm font-semibold text-gray-900 text-center">Vendedor polémico</div>
      <p className="text-sm text-slate-300">Este usuario tiene una baja calificación</p>
    </div>
    );

    const excellent = (
        <div className="my-4 text-center">
            <div className=" my-1 rounded-lg bg-[#48D1CC] p-2 px-3 text-sm font-semibold text-gray-800 text-center">Vendedor magnífico</div>
            <p className="text-sm text-slate-300">¡Es uno de los mejores del sitio!</p>
        </div>
    )

    const average = (
        <div className="my-4 text-center">
        <div className=" my-1 rounded-lg bg-[#808080] p-2 px-3 text-sm font-semibold text-gray-100 text-center">Vendedor común</div>
        <p className="text-sm text-slate-300">Sus calificaciones son variadas</p>
        </div>
    )

    if(props.totalReviews < 3 || props.totalSells < 10) return newby;

    if(rate < 3) return bad;    //2.2, 2.4, 1.3.. etc
    if(rate >= 3 || rate < 4) return average;
    if(rate >= 4 || rate < 5) return great;
    else return excellent;
}