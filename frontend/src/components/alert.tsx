import { GeneralButton } from "./buttons";

export default function Alert(props : 
    {title : string, body : {main : string, secondary : string}, callbacks : {onConfirm : any, onCancel : any}})
{
    const view = 
    (
    <article className="text-slate-200 bg-slate-800 text-center w-fit h-fit mx-auto p-8 my-2 rounded-xl">
        <p className="font-semibold my-1">{props.title}</p>
        <div className="my-3 bg-gray-700 rounded-lg py-1 px-2">
            <p className="text-sm">{props.body.secondary}</p>
            <p className="text-lg mt-1 font-semibold">{props.body.main}</p>
        </div>
        <p className="text-sm text-slate-300 my-3 ">¿Estás seguro?</p>
        <div className="mt-5 flex gap-x-2 justify-center">
            <GeneralButton title='Confirmar' onClick={props.callbacks.onConfirm} main={true}/>
            <GeneralButton title='Cancelar' onClick={props.callbacks.onCancel} main={false}/>
        </div>
    </article>
    )

    return <div className="fixed top-0 left-0 w-full h-full flex items-center bg-slate-400 bg-opacity-60">{view}</div>;
}