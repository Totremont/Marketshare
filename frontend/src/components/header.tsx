import { useState } from "react";
import Logo from "./logo";

export default function Header(props : {
    onClick : (selected : string) => any,
    selected : string}) //El prop 'selected' es un state que permite cambiar la opción seleccionada cuando 
                        //el usuario no hace clic pero scrollea (esto no activa callbacks)
{
    let [selected, setSelected] = useState(props.selected);
    let onClick = function(newSelected : string)
    {
        setSelected(newSelected);
        props.onClick(newSelected);
    }

    let view = (
    <nav className="text-slate-200 flex md:grid md:grid-cols-[20%_60%_20%] items-center border-b p-3
        border-slate-600 fixed top-0 w-full bg-gray-900">

        <section className="items-center px-2 hidden md:block">
            <Logo/>
        </section>

        <section className="font-semibold md:mx-auto px-2">
            <p id="header_0" onClick={() => onClick("header_0")} className={`me-3 hover:text-slate-300 
            ${selected === "header_0" ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Productos</p>

            <p id="header_1" onClick={() => onClick("header_1")} className={`me-3 hover:text-slate-300 
            ${selected === "header_1" ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Pedidos</p>

            <a id="header_2" onClick={() => onClick("header_2")} className={`me-3 hover:text-slate-300 
            ${selected === "header_2" ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Clientes</a>

            <a id="header_3" onClick={() => onClick("header_3")} className={`me-3 hover:text-slate-300 
            ${selected === "header_3" ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Empresa</a>
        </section>

        <section className="flex items-center px-2 ms-auto shrink-0">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fc/IBM_logo_in.jpg" 
            className="w-8 h-8 rounded-full aspect-auto"/>
            <p className="before:content-['🔔'] mx-4">3</p>
        </section>
    </nav>);

    return view;
}