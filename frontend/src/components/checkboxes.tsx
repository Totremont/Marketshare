import { useRef } from "react";

export default function CheckBoxes(props : 
    {checked : string[], setChecked: any, data : CheckBoxData[], singleSelection : boolean})
{
    //const checked = useRef<string[]>(props.initialState);

    const onClick = function(event : React.MouseEvent<HTMLElement>)
    {
        //event.preventDefault();
        const selectedIndex = props.checked.findIndex((it) => it === event.currentTarget.id);
        if(selectedIndex > -1) 
        {   //Si ya estaba en la lista (y no es el único) sacarlo (desclickearlo)
            if(props.checked.length > 1)
            {
                props.setChecked(props.checked.filter((_,index) => index != selectedIndex));
                //props.setChecked(checked.current);
            }
            
        } //Si no, agregarlo y  descliquear todos los demás (si es singleSelection)
        else 
        { 
            props.setChecked(props.singleSelection ? 
                [event.currentTarget.id] 
                : props.checked.concat(event.currentTarget.id));
            //props.setChecked(checked.current);
        }
    }

    const checkedState = function(id : string, label : string)
    {   
        return (
            <div key={id} className="flex items-center gap-x-2">
                <button id={id} type="button" onClick={onClick} className="flex items-center w-5 h-5 border text-sm
                rounded border-slate-300 bg-[#7B68EE]">
                  <span className="text-center flex-1">✓</span>
                </button>
                <label className="font-semibold text-sm">{label}</label>
            </div>
        )
    }
    

    const unCheckedState = function(id : string, label : string) 
    {
        return (
        <div key={id} className="flex items-center gap-x-2">
            <button id={id} type="button" onClick={onClick} className="flex items-center w-5 h-5 border text-sm font-semibold
            rounded border-slate-600 bg-gray-800">
                <span className="text-center flex-1"></span>
            </button>
            <label className="font-semibold text-sm">{label}</label>
        </div>
        )
    }

    const view = (
        <div className="flex items-center gap-x-4">
        {props.data.map
        ((it) => props.checked.find((list) => list === it.id) ? checkedState(it.id,it.label) : unCheckedState(it.id,it.label))}
        </div>
    )

    return view;

}

export class CheckBoxData
{
    id : string
    label : string

    constructor(id : string, label : string)
    {
        this.id = id;
        this.label = label;
    }
}