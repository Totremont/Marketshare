import Colors from "../Utils/Colors";
import { ChipFeature } from "./chip";

export default function ProductCard(props : 
    {date : string, category : string, 
        name : string, image : string, description : string, 
        price : string, feature : number, link : string, orgName : string, orgIcon : string})
{
    let view = (
        <article className="h-fit max-w-[300px] min-w-[250px] rounded-lg p-3 border border-slate-600 me-3 mb-3 md:mb-0 hover:text-teal-200 text-slate-200 cursor-pointer">

          <section className="flex items-center border-b pb-2 border-slate-600 text-slate-200">
            <p className="text-gray-300 text-sm">{props.date}</p>
            <p className="text-end flex-1 text-sm">{props.category}</p>
          </section>

          <h1 className="my-3 font-semibold text-lg">{props.name}</h1>
          <img src={props.image} 
          className="h-[200px] mx-auto"/>
          <p className="text-sm my-3 text-slate-200">{props.description}</p>

          <section className="flex items-center my-4">
            <h1 className="font-bold text-3xl flex-1 text-slate-200">${props.price}</h1>
            <ChipFeature feature={props.feature}/>
          </section>

          <section className="flex items-center border-t border-slate-600 pt-2 text-slate-200">
            <img src={props.orgIcon} className="w-8 h-8 rounded-full"/>
            <div className="ms-3">
              <p className="font-semibold flex items-center">
                <img className={`me-1 text-[${Colors.GREEN}]`} src="/check.svg"/>{props.orgName}</p>
              <p className="text-gray-300 text-sm">Tienda oficial</p>
            </div>
          </section>
          
        </article>
    )

    return view;
}