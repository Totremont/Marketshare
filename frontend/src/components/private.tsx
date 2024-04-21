import { LockIcon } from "./icons/miscellaneous";

export function PrivatePage(props : {title : string})
{
    const view = 
    (
        <div className="h-screen w-screen bg-gray-900 text-slate-200 p-3 flex flex-col items-center justify-center">
                <LockIcon size="w-16 h-16"/>
                <h1 className="text-5xl font-semibold my-5">Esa información es privada</h1>
                <h2 className="text-slate-300 mb-8">{props.title}</h2>
                <button className="font-semibold text-orange-300 text-sm">Volver</button>
        </div>
    )
    return view;
}