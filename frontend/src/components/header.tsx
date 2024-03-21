'use client'
import { useState } from "react";
import Logo from "./logo";

export default function HeaderComponent(props : 
    {username : string})
{
    let [selected, setSelected] = useState('');

    let onNavigate = function(selected : string)
    {
        setSelected(selected);
        //Logic to navigate here
    }

    let view = (
    <nav className="z-10 text-slate-200 flex md:grid md:grid-cols-[20%_60%_20%] items-center border-b p-3
        border-slate-600 fixed top-0 w-full bg-gray-900">

        <section className="items-center px-2 hidden md:block">
            <Logo style='' inverted={false}/>
        </section>

        <section className="font-semibold md:mx-auto px-2">
            <button id={Sections.PRODUCTOS} onClick={() => onNavigate(Sections.PRODUCTOS)} className={`me-3 hover:text-slate-300 
            ${selected === Sections.PRODUCTOS ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Productos</button>

            <button id={Sections.PEDIDOS} onClick={() => onNavigate(Sections.PEDIDOS)} className={`me-3 hover:text-slate-300 
            ${selected === Sections.PEDIDOS ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Pedidos</button>

            <button id={Sections.CLIENTES} onClick={() => onNavigate(Sections.CLIENTES)} className={`me-3 hover:text-slate-300 
            ${selected === Sections.CLIENTES ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Clientes</button>

            <button id={Sections.EMPRESA} onClick={() => onNavigate(Sections.EMPRESA)} className={`me-3 hover:text-slate-300 
            ${selected === Sections.EMPRESA ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Empresa</button>
        </section>

        <section className="flex items-center px-2 ms-auto shrink-0">

        <button id={Sections.PERFIL} onClick={() => onNavigate(Sections.PERFIL)} className="px-2 border rounded-lg py-1 cursor-pointer bg-slate-900 border-slate-400 font-semibold">
        Hola, {props.username}<span className="text-sm text-slate-300 font-normal "> | Ver perfil</span></button>

        </section>
    </nav>);

    return view;
}

export class Sections
{
    static PRODUCTOS = 'header_0';
    static PEDIDOS = 'header_1';
    static CLIENTES = 'header_2';
    static EMPRESA = 'header_3';
    static PERFIL = 'header_4';
}