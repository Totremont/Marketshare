import { useFormStatus } from "react-dom";

export default function SubmitButton(props: {title : string})
{
    let pendingForm = useFormStatus();
    return (
    pendingForm.pending ? 
    <input key="submit_button_disabled" className="mt-6 block rounded-xl bg-gray-800 px-6 
    py-2 font-semibold" aria-disabled type="submit" value="Enviando..." />
    
    : <input key="submit_button" className="mt-6 block rounded-xl bg-blue-900 px-6 py-2 font-semibold 
    hover:bg-blue-800 cursor-pointer" type="submit" value={props.title} />
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