import { useRef } from "react";

export default function CircleColors(props : {data : CircleColorData[], setSelected : any, initialState : string})
{
    const selected = useRef<string>(props.initialState);

    const onClick = (event : React.MouseEvent<HTMLElement>) => 
    {
        if(selected.current != event.currentTarget.id)  //Switch selected color
        {
            selected.current = event.currentTarget.id;
            props.setSelected(event.currentTarget.id);
        }
    }

    const color = (id : string, color : string) => (
        <div key={id} id={id} onClick={onClick}
        className={`inline-block p-1 mx-1 ${selected.current === id ? 'border rounded-md border-orange-400' : ''} `}>
            <div className={`border rounded-full inline-block w-6 h-6 ${color}`}></div>
        </div>
    )

    return props.data.map(it => color(it.id,it.color));
}

export class CircleColorData
{
    id : string;
    color : string;   //Background color

    constructor(color : string, id : string)
    {
        this.color = color;
        this.id = id;
    }
}