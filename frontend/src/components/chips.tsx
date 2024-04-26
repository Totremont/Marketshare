'use client'
import { BackgroundColors, ContrastTextColors, FillColors, SpecialFeature } from "@/private/utils/properties"
import { CardIcon, CheckIcon, LeafIcon, ShieldIcon, ShippingIcon } from "./icons/miscellaneous"

export default function SingleChip(props : {id : string, title : string, checked : boolean, 
    callback : ((event : React.MouseEvent<HTMLElement>) => void)})
{
    const unChecked = (<button type="button" 
    className={`my-4 rounded-2xl flex items-center gap-x-2 
    border border-slate-600 py-1 px-3 text-sm font-semibold hover:bg-gray-800`} 
    id={props.id} key={props.id} onClick={props.callback}>{props.title}</button>)

    const checked = (<button type="button" 
    className={`my-4 rounded-2xl flex items-center gap-x-2
    border border-slate-600 py-1 px-3 text-sm font-semibold bg-gray-800`}  
    id={props.id} key={props.id} onClick={props.callback}>
        <CheckIcon size="w-5 h-5" fillColor={FillColors.WHITE} />
        <p>{props.title}</p>
    </button>)

    return props.checked ? checked : unChecked
}


export function ChipGroup(props : 
    {data : ChipData[], singleSelection : boolean, selectionRequired : boolean, checked : string[], setChecked : any})
{
    //const checked = useRef<string[]>(props.initialState);

    const unCheckedState = function(id : string, title : string)
    {
        return(<button type="button" 
        className={`my-4 rounded-2xl flex items-center gap-x-2 
        border border-slate-600 py-1 px-3 text-sm font-semibold hover:bg-gray-800`}
        id={id} key={id} onClick={onClick}>{title}</button>)
    } 

    const checkedState = function(id : string, title : string)
    {
        return(<button type="button" className={`my-4 rounded-2xl flex items-center gap-x-2 
        border border-slate-600 py-1 px-3 text-sm font-semibold bg-gray-800`} 
        id={id} key={id} onClick={onClick}>
            <CheckIcon size="w-5 h-5" fillColor={FillColors.WHITE} />
            <p>{title}</p>
        </button>)
    }

    const onClick = function(event : React.MouseEvent<HTMLElement>)
    {
        let selectedIndex = props.checked.findIndex((it) => it === event.currentTarget.id);
        if(selectedIndex > -1) 
        {   //Si ya estaba en la lista (y no es el único) sacarlo (desclickearlo)
            if(props.checked.length > 1 || !props.selectionRequired)
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

    const view = (
        <div id="chip_group_component" className="flex items-center gap-x-4">
        {props.data.map
        (it => props.checked.find((list) => list === it.id) ? checkedState(it.id,it.title) : unCheckedState(it.id,it.title))}
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
    let textColor;
    switch(props.feature)
    {
        case SpecialFeature.ENVIO_GRATIS:
            color = BackgroundColors.GREEN;
            icon = <ShippingIcon fillColor={FillColors.DARK_GREEN}/>;
            title = "Envío gratis";
            textColor = ContrastTextColors.GREEN;
            break;
        case SpecialFeature.AHORA_12:
            color = BackgroundColors.GRAY;
            icon = <CardIcon fillColor={FillColors.DARK_GRAY}/>;
            title = "Ahora 12";
            textColor = ContrastTextColors.GRAY;
            break;
        case SpecialFeature.GARANTIA:
            color = BackgroundColors.PURPLE;
            icon = <ShieldIcon fillColor={FillColors.DARK_PURPLE}/>;
            title = "Garantía 12";
            textColor = ContrastTextColors.BEIGE;
            break;
        case SpecialFeature.SUSTENTABLE:
            color = BackgroundColors.OLIVE;
            icon = <LeafIcon fillColor={FillColors.DARK_GREEN}/>
            title = "Sustentable";
            textColor = ContrastTextColors.GREEN;
            break;
        default:
            return null;
    }
    const style = `rounded-lg ${color} ${textColor} p-1 px-3 text-sm font-semibold text-slate-200 flex items-center gap-x-1`
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