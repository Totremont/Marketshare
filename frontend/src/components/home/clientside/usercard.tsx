import { ROLE_COMPRADOR } from "@/middleware";
import { getCategoryIcon } from "@/private/utils/mappers";
import { BackgroundColors, BorderColors } from "@/private/utils/properties";
import { Skeleton } from "@nextui-org/react";


export default function UserCard(props : {
    categories : {category : string, ocurrency : number}[], user : any, 
    role : string, amIClient : boolean, isClient : boolean, ordersCompleted : any })
{

    const borderColor =  props.amIClient ? BorderColors.BLUE : props.isClient ? BorderColors.YELLOW : BorderColors.GRAY
    const background = props.amIClient ? BackgroundColors.OLIVE : props.isClient ? BackgroundColors.SIENNA_BROWN : '';
    
    const view = 
    (
    <article className={`w-[300px] h-[350px]
    rounded-lg p-3 border ${borderColor} bg-gray-800`}>
        <div className="flex items-center flex-nowrap">
            <p className="text-lg font-semibold overflow-hidden flex-1">{props.user.name}</p>
            <p className="text-sm font-semibold shrink-0 p-1 
            px-2 border rounded-lg bg-gray-900 ms-2">{props.role === ROLE_COMPRADOR ? 'Comprador' : 'Vendedor'}</p>
        </div>
        <section className="my-3 py-3 border-t border-slate-500 text-center grid grid-cols-3 gap-y-3">
            <div className="col-span-3 text-center">
                <h1 className="text-sm">Organización</h1>
                <p className="text-lg font-semibold">{props.user.organization.name}</p>
            </div>
            <div className="text-center">
                <h2 className="text-sm">País</h2>
                <p className="text-lg font-semibold overflow-hidden">{props.user.country.name}</p>
            </div>
            <div className="text-center">
                <h2 className="text-sm">{props.role === ROLE_COMPRADOR ? 'Compras' : 'Ventas'}</h2>
                <p className="text-lg font-semibold">{props.ordersCompleted}</p>
            </div>
            <div className="text-center">
                <h2 className="text-sm">Registro</h2>
                <p className="text-lg font-semibold">{props.user.registerDate.slice(0,4)}</p>
            </div>
            <h2 className="text-sm col-span-3 text-center">{props.role === ROLE_COMPRADOR ? 'Mis intereses son' : 'Mis productos son'}</h2>
            <div className="flex items-center justify-center col-span-3 gap-x-3">
                {
                    props.categories.length > 0 ? 
                    props.categories.map((it,index) =>
                     getCategoryIcon(it.category,`icon_category_${index}_from_user_${props.user.id}`)) 
                    : <p className="font-semibold">No hay suficiente información</p>
                }
            </div>
        </section>
        {
            (props.amIClient || props.isClient) ?
            <div className={`text-center p-1 px-2 rounded-lg ${background}`}>
                <p className="text-sm font-semibold">Ha comprado productos de su empresa</p>
            </div>
            : null
        }
    </article>
    )

    return view;

}

export function UserCardSkeleton()
{
    const view = 
    (
    <article className="max-w-[280px] min-w-[200px] h-[225px] rounded-lg bg-gray-800 p-3 flex flex-col">

        <div>
            <Skeleton className="w-full bg-gray-700 h-6 my-2 rounded "></Skeleton>
            <Skeleton className="w-1/3 my-2 bg-gray-700 h-4 rounded "></Skeleton>
        </div>

        <div className="grid grid-rows-2 gap-3 flex-1 my-1 ">
            <Skeleton className="w-full bg-gray-700 rounded"></Skeleton>
            <Skeleton className="w-full bg-gray-700 rounded"></Skeleton>
        </div>

    </article>
    )
    return view;
}
