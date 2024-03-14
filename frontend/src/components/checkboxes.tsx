import { useRef } from "react";

export default function Checkboxes(props : 
    {initialState : string[], setChecked: any, data : CheckboxData[], singleSelection : boolean})
{
    const checked = useRef<string[]>(props.initialState);

    const onClick = function(event : React.MouseEvent<HTMLElement>)
    {
        let selectedIndex = checked.current.findIndex((it) => it === event.currentTarget.id);
        if(selectedIndex > -1) 
        {   //Si ya estaba en la lista (y no es el único) sacarlo (desclickearlo)
            if(checked.current.length > 1)
            {
                checked.current = checked.current.filter((_,index) => index != selectedIndex);
                props.setChecked(checked.current);
            }
            
        } //Si no, agregarlo y  descliquear todos los demás (si es singleSelection)
        else 
        { 
            checked.current = props.singleSelection ? [event.currentTarget.id] : checked.current.concat(event.currentTarget.id);
            props.setChecked(checked.current);
        }
    }

    const checkedState = function(id : string, label : string)
    {   return (
        <div id={id} key={id} onClick={onClick} className="inline"><input className="h-4 w-4 rounded border border-[#556B2F] bg-[#556B2F] text-sm font-semibold ps-[0.12rem] cursor-pointer text-slate-300 focus:outline-none" 
        value="✓" readOnly/>
        <label htmlFor={id} className="ms-2 me-3 text-sm">{label}</label></div>)
    }
    

    const unCheckedState = function(id : string, label : string) 
    {
        return (
        <div id={id} key={id} onClick={onClick} className="inline"><input className="h-4 w-4 rounded border border-slate-600 bg-gray-800 cursor-pointer text-sm focus:outline-none" 
        value="" readOnly/>
        <label htmlFor={id} className="ms-2 me-3 text-sm">{label}</label></div>)
    }

    const view = (
        <div>
        {props.data.map
        ((it) => checked.current.find((list) => list === it.id) ? checkedState(it.id,it.label) : unCheckedState(it.id,it.label))}
        </div>
    )

    return view;

}

export class CheckboxData
{
    id : string
    label : string

    constructor(id : string, label : string)
    {
        this.id = id;
        this.label = label;
    }
}