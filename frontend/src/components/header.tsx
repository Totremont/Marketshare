import { useState } from "react";
import Logo from "./logo";

export default function Header(props : 
    {onClickSection : (selected : string) => any, username : string, onClickProfile : any})
{
    let [selected, setSelected] = useState('');

    let onClick = function(newSelected : string)
    {
        setSelected(newSelected);
        props.onClickSection(newSelected);
    }

    let view = (
    <nav className="text-slate-200 flex md:grid md:grid-cols-[20%_60%_20%] items-center border-b p-3
        border-slate-600 fixed top-0 w-full bg-gray-900">

        <section className="items-center px-2 hidden md:block">
            <Logo/>
        </section>

        <section className="font-semibold md:mx-auto px-2">
            <button id="header_0" onClick={() => onClick("header_0")} className={`me-3 hover:text-slate-300 
            ${selected === "header_0" ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Productos</button>

            <button id="header_1" onClick={() => onClick("header_1")} className={`me-3 hover:text-slate-300 
            ${selected === "header_1" ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Pedidos</button>

            <button id="header_2" onClick={() => onClick("header_2")} className={`me-3 hover:text-slate-300 
            ${selected === "header_2" ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Clientes</button>

            <button id="header_3" onClick={() => onClick("header_3")} className={`me-3 hover:text-slate-300 
            ${selected === "header_3" ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Empresa</button>
        </section>

        <section className="flex items-center px-2 ms-auto shrink-0">

        <button onClick={props.onClickProfile} className="px-2 border rounded-lg py-1 cursor-pointer bg-slate-900 border-slate-400 font-semibold">
        Hola, {props.username}<span className="text-sm text-slate-300 font-normal "> | Ver perfil</span></button>

        </section>
    </nav>);

    return view;
}