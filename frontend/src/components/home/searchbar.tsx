'use client'
import { BackgroundColors } from "@/private/utils/properties";
import { useRef, useState } from "react"

export default function SearchBar(props : {setTextWritten : any})
{
    const [isWriting, setIsWriting] = useState(false);
    const [textWritten, setTextWritten] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    let [isFocused, setIsFocused] = useState(false);

    const onClick = (event : React.SyntheticEvent) => 
    {
        inputRef.current?.focus();
        setIsFocused(true);
    }
    const onChange = (event : React.SyntheticEvent) => 
    {
        const target = event.target as HTMLInputElement;
        setIsWriting(!!target.value);
        setTextWritten(target.value);
    }
    //When element stops being focused
    const onBlur = () => 
    {
        setIsWriting(!!textWritten);
        setIsFocused(false);
    }
    
    const view = 
    <div onClick={onClick} className={`border min-w-[200px] md:w-[300px] rounded-md border-slate-600 p-2 my-4 ${isFocused ? 'border-slate-400' : ''}`}>
    <div className="flex items-center static">
        {isWriting ? <button className={`text-sm py-1 px-1 rounded-md bg-[${BackgroundColors.OLIVE}]`}>Buscar</button> :
        <svg className="fill-slate-400 w-6" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
        }
        {isWriting ? null : <span className="text-slate-400 mx-1 absolute mx-8 text-sm">Buscar</span>}
        <input ref={inputRef} onBlur={onBlur} type="text" onChange={onChange} className="bg-slate-900 outline-none flex-1 mx-2"/>
    </div>
    </div>

    return view;
}