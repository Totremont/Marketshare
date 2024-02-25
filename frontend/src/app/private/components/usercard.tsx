import SellerReputation from "../Utils/reputation";

export default function UserCard(props : {name : string, 
    country : string, categories : string[], orgName : string, isClient : boolean, reputation : number
})
{
    let categories = "";
    let ribbon = props.isClient ? <div className="w-[25px] h-[35px] bg-gray-400 float-right mx-5 text-center "></div> : null;
    let reputation = props.isClient ? <p className="text-sm font-semibold text-gray-300 mt-1">No ha opinado sobre tus productos</p> : null;
    if(props.categories && props.categories.length > 0)
    {
        props.categories.forEach((it, index) => 
        {
            if(index == 0) categories.concat(`${it},`)
            else if(index < props.categories.length - 1) categories.concat(` ${it},`)
            else categories.concat(` ${it}`)
        })
    } else categories = "No hay información suficiente";

    switch(props.reputation)
    {
        case SellerReputation.BAD:
        case SellerReputation.REGULAR:
            ribbon = (<div className="w-[25px] h-[35px] bg-red-100 float-right mx-5 text-center "></div>);
            reputation = <p className="text-sm font-semibold text-red-200">Te ha dado opiniones regulares o malas</p>
            break;
        case SellerReputation.OK:
        case SellerReputation.GOOD:
            ribbon = (<div className="w-[25px] h-[35px] bg-yellow-100 float-right mx-5 text-center "></div>);
            reputation = <p className="text-sm font-semibold text-green-200">Te ha dado buenas opiniones</p>
            break;
        case SellerReputation.GREAT:
        case SellerReputation.EXCELLENT:
            ribbon = (
            <div className="w-[25px] h-[35px] bg-purple-200 float-right mx-5 text-center ">
                <img src="/heart.svg"/>
            </div>);
            reputation = <p className="text-sm font-semibold text-purple-200 mt-1">Te ha dado opiniones excelentes</p>
            break;

    }

    let view = (
    <article className="md:w-[280px] min-w-[200px] h-[225px] 
        rounded-lg bg-gray-800 text-slate-200 mb-3 me-3">
        {ribbon}    
        <div className="p-3">
        <p className="font-semibold text-lg">{props.name}</p>
        <p className="text-sm ">País: <span className="font-semibold">{props.country}</span></p>
        <p className="text-sm ">Organización: <span className="font-semibold">{props.orgName}</span></p>
        <p className="text-sm my-3 h-[65px]">Interesado en:<br/>
        {categories}
        </p>
        {
            props.isClient ? 
            <p className="text-sm font-semibold text-yellow-100">Ha comprado productos de su empresa</p>
            : <p className="text-sm font-semibold text-red-200">No te ha comprado ningún producto</p>
        }
        {reputation}
        </div>
    </article>
    );

    return view;


}