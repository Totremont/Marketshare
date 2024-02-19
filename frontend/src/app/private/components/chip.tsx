
export default function Chip(props : {id : string, title : string, checked : boolean, 
    callback : ((event : React.MouseEvent<HTMLElement>) => void)})
{
    let unChecked = (<button type="button" 
    className="mt-4 rounded-2xl border border-slate-600 p-1 px-3 text-sm font-semibold me-3 hover:bg-slate-800 mb-2" 
    id={props.id} key={props.id} onClick={props.callback}>{props.title}</button>)

    let checked = (<button type="button" className="ms-2 mt-4 rounded-2xl border border-slate-600 
    bg-slate-600 p-1 px-3 text-sm font-semibold me-3 mb-2" 
    id={props.id} key={props.id} onClick={props.callback}>{"✓ | " + props.title}</button>)

    return props.checked ? checked : unChecked
}

//Single selection not implemented yet
export function ChipGroup(props : 
    {data : ChipData[], singleSelection : boolean, checked : string[], setChecked : any})
{
    let unCheckedState = function(id : string, title : string)
    {
        return(<button type="button" 
        className="mt-4 rounded-2xl border border-slate-600 p-1 px-3 text-sm font-semibold me-3 hover:bg-slate-800 mb-2" 
        id={id} key={id} onClick={onClick}>{title}</button>)
    } 

    let checkedState = function(id : string, title : string)
    {
        return(<button type="button" className="ms-2 mt-4 rounded-2xl border border-slate-600 
        bg-slate-600 p-1 px-3 text-sm font-semibold me-3 mb-2" 
        id={id} key={id} onClick={onClick}>{"✓ | " + title}</button>)
    }

    let onClick = function(event : React.MouseEvent<HTMLElement>)
    {
        if(props.checked.find((it) => it === event.currentTarget.id))
        {   //Si ya estaba en la lista sacarlo (desclickearlo)
            props.setChecked(props.checked.filter((it) => it != event.currentTarget.id));
            //Si no, agregarlo
        } else props.setChecked(props.checked.concat(event.currentTarget.id));
    }

    
    let view = (
        <div id="chip_group_component">
        {props.data.map
        (it => props.checked.find((list) => list === it.id) ? checkedState(it.id,it.title) : unCheckedState(it.id,it.title))}
        </div>
    )

    return view;

}


export class ChipData
{
    id : string
    title : string

    constructor(id : string, title : string)
    {
        this.id = id;
        this.title = title;
    }
}