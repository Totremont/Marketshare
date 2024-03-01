
export default function Checkboxes(props : 
    {checked : string[], setChecked: any, data : CheckboxData[], singleSelection : boolean})
{
    //let [checked, setChecked] = useState([""]);

    let onClick = function(event : React.MouseEvent<HTMLElement>)
    {
        if(props.checked.find((it) => it === event.currentTarget.id) ) 
        {   //Si ya estaba en la lista (y no es el único) sacarlo (desclickearlo)
            if(props.checked.length > 1)
            props.setChecked(props.checked.filter((it) => it != event.currentTarget.id));
            
        } //Si no, agregarlo o descliquear todos los demás (si es singleSelection)
        else { 
            props.setChecked(props.singleSelection ? [event.currentTarget.id] :
                props.checked.concat(event.currentTarget.id));
        }
    }

    let checkedState = function(id : string, label : string)
    {   return (
        <div id={id} key={id} className="inline"><input onClick={onClick} className="h-4 w-4 rounded border border-[#556B2F] bg-[#556B2F] text-sm font-semibold ps-[0.12rem] cursor-pointer text-slate-300 focus:outline-none" 
        value="✓" readOnly/>
        <label htmlFor={id} className="ms-2 me-3 text-sm">{label}</label></div>)
    }
    

    let unCheckedState = function(id : string, label : string) 
    {
        return (
        <div id={id} key={id} className="inline"><input onClick={onClick} className="h-4 w-4 rounded border border-slate-600 bg-gray-800 cursor-pointer text-sm focus:outline-none" 
        value="" readOnly/>
        <label htmlFor={id} className="ms-2 me-3 text-sm">{label}</label></div>)
    }

    let view = (
        <div>
        {props.data.map
        ((it) => props.checked.find((list) => list === it.id) ? checkedState(it.id,it.label) : unCheckedState(it.id,it.label))}
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