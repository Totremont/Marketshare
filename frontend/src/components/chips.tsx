'use client'
import { BackgroundColors, SpecialFeature } from "@/private/utils/properties"
import { useRef } from "react"
import { CardIcon, LeafIcon, ShieldIcon, ShippingIcon } from "./icons/miscellaneous"

export default function SingleChip(props : {id : string, title : string, checked : boolean, 
    callback : ((event : React.MouseEvent<HTMLElement>) => void)})
{
    const unChecked = (<button type="button" 
    className="mt-4 rounded-2xl border border-slate-600 p-1 px-3 text-sm font-semibold me-3 hover:bg-slate-800 mb-2" 
    id={props.id} key={props.id} onClick={props.callback}>{props.title}</button>)

    const checked = (<button type="button" className="ms-2 mt-4 rounded-2xl border border-slate-600 
    bg-slate-600 p-1 px-3 text-sm font-semibold me-3 mb-2" 
    id={props.id} key={props.id} onClick={props.callback}>{"✓ | " + props.title}</button>)

    return props.checked ? checked : unChecked
}


export function ChipGroup(props : 
    {data : ChipData[], singleSelection : boolean, selectionRequired : boolean, initialState : string[], setChecked : any})
{
    const checked = useRef<string[]>(props.initialState);

    const unCheckedState = function(id : string, title : string)
    {
        return(<button type="button" 
        className="mt-4 rounded-2xl border border-slate-600 p-1 px-3 text-sm font-semibold me-3 hover:bg-slate-800 mb-2" 
        id={id} key={id} onClick={onClick}>{title}</button>)
    } 

    const checkedState = function(id : string, title : string)
    {
        return(<button type="button" className="ms-2 mt-4 rounded-2xl border border-slate-600 
        bg-slate-600 p-1 px-3 text-sm font-semibold me-3 mb-2" 
        id={id} key={id} onClick={onClick}>{"✓ | " + title}</button>)
    }

    const onClick = function(event : React.MouseEvent<HTMLElement>)
    {
        let selectedIndex = checked.current.findIndex((it) => it === event.currentTarget.id);
        if(selectedIndex > -1) 
        {   //Si ya estaba en la lista (y no es el único) sacarlo (desclickearlo)
            if(checked.current.length > 1 || !props.selectionRequired)
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

    const view = (
        <div id="chip_group_component">
        {props.data.map
        (it => checked.current.find((list) => list === it.id) ? checkedState(it.id,it.title) : unCheckedState(it.id,it.title))}
        </div>
    )

    return view;

}

//No son clickeables, solo resaltan una cualidad de un producto
export function ChipFeature(props : {feature : number})
{
    let color;
    let icon;
    let title;
    switch(props.feature)
    {
        case SpecialFeature.ENVIO_GRATIS:
            color = BackgroundColors.GREEN;
            icon = <ShippingIcon/>;
            title = "Envío gratis";
            break;
        case SpecialFeature.AHORA_12:
            color = BackgroundColors.GRAY;
            icon = <CardIcon/>;
            title = "Ahora 12";
            break;
        case SpecialFeature.GARANTIA:
            color = BackgroundColors.PURPLE;
            icon = <ShieldIcon/>;
            title = "Garantía 12";
            break;
        case SpecialFeature.SUSTENTABLE:
            color = BackgroundColors.OLIVE;
            icon = <LeafIcon/>
            title = "Sustentable";
            break;
        default:
            return null;
    }
    const style = `rounded-lg ${color} p-1 px-3 text-sm font-semibold text-slate-200 flex items-center gap-x-1`
    return(
    <div className={style}>
        {icon}
        {title}
    </div>)

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