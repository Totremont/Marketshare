import { BackgroundColors } from "@/private/utils/properties";
import { useFormStatus } from "react-dom";

export function SubmitButton(props: {title : string})
{
    const pendingForm = useFormStatus();
    return (
    pendingForm.pending ? 
    <input key="submit_button_disabled" className="mt-6 block rounded-xl bg-gray-800 px-6 
    py-2 font-semibold w-full" aria-disabled type="submit" value="Enviando..." />
    
    : <input key="submit_button" className="mt-6 block rounded-xl bg-blue-900 px-6 py-2 font-semibold 
    hover:bg-blue-800 cursor-pointer w-full" type="submit" value={props.title} />
    )
}

export function SubmitButtonWithState(props : {pending : boolean, onClick : any})
{
    return(
        props.pending ? <input key="submit_button_disabled" className="mt-6 block rounded-xl bg-gray-800 px-6 
        py-2 font-semibold" aria-disabled type="button" value="Enviando..." />
        
        : <input key="submit_button" className="mt-6 block rounded-xl bg-blue-900 px-6 py-2 font-semibold 
        hover:bg-blue-800 cursor-pointer" type="button" value={"Crear producto"} onClick={props.onClick}  />

    )
}

export function GeneralButton(props : {title : string, onClick : any, main : boolean})  //Main or secondary
{
    const view = (
        <button onClick={props.onClick} className={`mx-4 
        ${props.main ? 'bg-[#F4A460]' : BackgroundColors.GRAY} 
            rounded-lg px-2 py-2 text-sm font-semibold text-slate-800 cursor-pointer
            ${props.main ? 'hover:bg-[#DEB887]' : 'hover:bg-[#787878]' }`}>
        {props.title}
        </button>
    )
    return view;
}