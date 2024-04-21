'use client'
import { useRef, useState } from "react";
import Logo from "./logo";
import { CreditCardIcon, ExpandIcon, ProfileIcon,} from "./icons/miscellaneous";
import { BackgroundColors, ContrastTextColors, FillColors } from "@/private/utils/properties";
import { AvatarIcon } from "@nextui-org/react";
import { ROLE_COMPRADOR, ROLE_VENDEDOR } from "@/middleware";
import { useRouter } from "next/navigation";
import Alert from "./alert";
import { formatPrice } from "@/private/utils/mappers";

export default function HeaderComponent(props : 
    {username : string, userId : number, money : string, role : string, bankName : string})
{
    const [selected, setSelected] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [newMoney, setNewMoney] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const router = useRouter();

    const onNavigate = function(selected : string)
    {
        setSelected(selected);
        switch(selected)
        {
            case Sections.PERFIL:
                setShowOptions(!!!showOptions)
                break;
        }
        //Logic to navigate here
    }

    const optionsList = () => 
    {
        const view = 
        (
            <section className="p-2 rounded-lg bg-gray-800 w-fit h-fit text-sm font-semibold absolute top-15">
                {
                    props.role === ROLE_COMPRADOR ? 
                    <button className="flex items-center gap-x-2 py-1 px-2 my-2 rounded-lg hover:bg-gray-700 w-full"
                    onClick={() => setShowAlert(true)}>
                        <CreditCardIcon/>
                        <p>Añadir fondos</p>
                    </button> : null
                }

                <button className="flex items-center gap-x-2 py-1 px-2 my-2 rounded-lg hover:bg-gray-700 w-full"
                onClick={() => {router.push(`/profile/${props.userId}`); setShowOptions(false);}}>
                    <ProfileIcon size="w-6 h-6" fillColor={FillColors.GRAY}/>
                    <p>Ver mi perfil</p>
                </button>

            </section>
        )
        return view;
    }

    const moneyAlert = () => 
    {
        const totalMoney = Number(props.money) + Number(newMoney);
        const mainView = 
        (
            <div className="p-4 px-8">
                <label htmlFor="money" className="mt-3 block text-sm">Escribe una cantidad</label>
                <input required type="number" min={0} id="money" name="money" value={newMoney}
                onChange={(e) => setNewMoney(e.currentTarget.value)} 
                className="my-2 w-[200px] rounded-md border border-slate-400 bg-gray-800 px-1 py-1" />
                <p className="my-3 text-sm">Dinero final</p>
                <p className={`text-center my-2 ${BackgroundColors.BEIGE} ${ContrastTextColors.BEIGE} py-2 px-4 w-fit mx-auto rounded-lg `}>
                    ${formatPrice(totalMoney)}</p>
                <div className="flex items-center font-semibold gap-x-2 text-sm my-4 justify-content w-fit mx-auto ">
                    <p className={`text-center ${BackgroundColors.BLUE} font-semibold rounded-lg py-1 px-2`}>${formatPrice(newMoney)}</p>
                    <span className="font-semibold text-xl">+</span>
                    <p className={`text-center ${BackgroundColors.GREEN} font-semibold rounded-lg py-1 px-2`}>${formatPrice(props.money)}</p>
                </div>
            </div>
        )

        const view = 
        (
            <div className="">
                <Alert title={'Añade fondos a tu cuenta'} 
                body=
                {
                    {
                    main : mainView, 
                    secondary : <p className="my-2">Se sacará de tu cuenta en <span className="font-semibold text-lg">{props.bankName}</span></p>
                    }
                }
                callbacks={{onConfirm : {}, onCancel : () => setShowAlert(false)}} /> 
            </div>
        )

        return view;
        
    }

    let view = (
    <nav className="bg-gray-900 z-10 text-slate-200 flex md:grid md:grid-cols-[20%_60%_20%] items-center border-b p-3
        border-slate-600 fixed top-0 w-full ">

        <section className="items-center px-2 hidden md:block">
            <Logo style='' inverted={false}/>
        </section>

        <section className="font-semibold md:mx-auto flex items-center px-2 gap-x-4">
            <button id={Sections.PRODUCTOS} onClick={() => onNavigate(Sections.PRODUCTOS)} className={`hover:text-slate-300 
            ${selected === Sections.PRODUCTOS ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Productos</button>

            <button id={Sections.PEDIDOS} onClick={() => onNavigate(Sections.PEDIDOS)} className={`hover:text-slate-300 
            ${selected === Sections.PEDIDOS ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Pedidos</button>

            <button id={Sections.CLIENTES} onClick={() => onNavigate(Sections.CLIENTES)} className={`hover:text-slate-300 
            ${selected === Sections.CLIENTES ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Clientes</button>

            <button id={Sections.EMPRESA} onClick={() => onNavigate(Sections.EMPRESA)} className={`hover:text-slate-300 
            ${selected === Sections.EMPRESA ? `text-orange-300 border-b pb-4 border-orange-300` : ""  }`}>Empresa</button>
        </section>
        <div className="relative px-4 ms-auto shrink-0">
            <section className="flex items-center gap-x-3">
                <button id={Sections.PERFIL} onClick={() => onNavigate(Sections.PERFIL)} 
                className={`p-2 rounded-lg ${showOptions ? 'bg-gray-800' : 'hover:bg-gray-800' }`}>
                    <div className="flex items-center gap-x-2">
                        <ExpandIcon size="w-6 h-6" fillColor={FillColors.GRAY}/>
                        <h3 className="font-semibold">{props.username}</h3>
                    </div>
                </button>
                {
                    props.role === ROLE_VENDEDOR ? 
                    <h3 className={`py-1 px-2 rounded-lg 
                    ${BackgroundColors.BEIGE} ${ContrastTextColors.BEIGE} font-semibold`}>Vendedor</h3> 
                    :
                    <h3 className={`py-1 px-2 rounded-lg ${BackgroundColors.GREEN} font-semibold`}>${formatPrice(props.money)}</h3>
                }
            </section>
            {
                showOptions ? optionsList() : null
            }
        </div>
        {
            showAlert ? moneyAlert() : null
        }
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