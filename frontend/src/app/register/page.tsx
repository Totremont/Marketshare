'use client'
import {useState, useRef} from "react"
import Chip from "../private/components/chip";
import Logo from "../private/components/logo";

//Pestaña para registrarse

export default function SignIn()
{
    //Datos
    let [user, setUser] = useState("");
    let [pass, setPass] = useState("");
    let [email, setEmail] = useState("")
    let [country, setCountry] = useState("Argentina")
    let [rol, setRol] = useState("")
    let [bank,setBank] = useState("Santander")
    let [money,setMoney] = useState("")
    let [organization,setOrganization] = useState("IBM")

    const bankOptions = 
    [
        {value: 'Santander', text: 'Santander'},
        {value: 'BBVA', text: 'BBVA'},
        {value: 'Nación', text: 'Nación'}
    ];

    const countryOptions = 
    [
        {value: 'Argentina', text: 'Argentina'},
        {value: 'Estados Unidos', text: 'Estados Unidos'},
        {value: 'Canada', text: 'Canada'}
    ];

    const orgOptions = 
    [
        {value: 'IBM', text: 'IBM', selected : true},
        {value: 'Microsoft', text: 'Microsoft'},
        {value: 'Apple', text: 'Apple'}
    ];


    //View states
    let [buttonChecked, setButtonChecked] = useState("vendedor");
    let [customOrganization, setCustomOrganization] = useState(false)
    let onRolClick = (event : React.MouseEvent<HTMLElement>) => {
        setButtonChecked(event.currentTarget.id)
        setRol(event.currentTarget.id)}

    let onChange = function(event : React.SyntheticEvent)
    {
        let target = event.target as HTMLInputElement
        switch(target.id)
        {
            case "user":
                setUser(target.value)
                break;
            case "pass":
                setPass(target.value)
                break;
            case "email":
                setEmail(target.value)
                break;
            case "country":
                setCountry(target.value)
                break;
            case "bank":
                setBank(target.value)
                break;
            case "organization":
                setOrganization(target.value)
                break;
            case "money":
                setMoney(target.value)
                break;
        }
    }

    let onSubmit = function(event : React.SyntheticEvent)
    {
        event.preventDefault()  //Necesario en formularios que usan un input type="submit"
        alert(`Usuario con: \n user =${user}\n pass =${pass}\n email =${email}
        \n country =${country}\n org =${organization}\n rol =${rol}\n bank =${bank}\n money =${money} `);
    }

    let setCurrentView = () =>
    {
        switch(buttonChecked)
        {
            case "vendedor":
                return vendedorView
            case "comprador":
                return compradorView
            default:
                return null;
        }
    }

    let customOrganizationView = (
        <><input type="text" id="organization" onChange={onChange} className="mt-2 w-[60%] rounded-md border border-slate-600 bg-gray-800 px-1 py-1 md:w-[300px]" />
        <button className="text-teal-400 mt-1 block" onClick={() => setCustomOrganization(false)}>Elegir de lista</button></>
    )

    let selectOrganizationView = (
        <select id="organization" className="mt-2 w-[60%] rounded-md
            border border-slate-600 bg-gray-800 px-1 py-1 md:w-[300px]" onChange={onChange}>
                <option value="0" onClick={() => setCustomOrganization(true)}>No encuentro mi empresa</option>
                {orgOptions.map(it => it.hasOwnProperty("selected") ? 
                (<option selected value={it.value}>{it.text}</option>) : (<option value={it.value}>{it.text}</option>) )}
            </select>
    )

    let compradorView = (
        <fieldset className="my-6 border-t border-slate-600 py-6 md:grid md:grid-cols-2 md:gap-10">
        <div className="md:max-w-[300px]">
            <p className="font-semibold">Datos bancarios y organizativos</p>
            <p className="mt-1 text-sm text-slate-400">Como comprador debes registrar esta información</p>
        </div>

        <div className="">
          <label htmlFor="organization" className="block font-semibold">Empresa que representas</label>
            {customOrganization ? customOrganizationView : selectOrganizationView } 

            <label htmlFor="bank" className="block font-semibold mt-4">Banco</label>
            <select id="bank" onChange={onChange} className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1">
            {bankOptions.map(it => (<option value={it.value}>{it.text}</option>))}
            </select>

            <label htmlFor="money" className="mt-4 block font-semibold">Dinero</label>
            <p className="text-sm text-slate-400 w-[60%] md:w-[300px]">Transfiere dinero a tu cuenta y empieza a comprar</p>
            <input type="number" id="money" onChange={onChange} className="mt-2 w-[40%] md:w-[200px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

            <input className="mt-6 block rounded-xl bg-blue-900 px-6 py-2 font-semibold hover:bg-blue-700" type="submit" value="Crear cuenta" />
        </div>
        </fieldset>
    )

    let vendedorView = (
        <fieldset className="my-6 border-t border-slate-600 py-6 md:grid md:grid-cols-2 md:gap-10 h-[30vh]">
        <div className="mb-6 md:max-w-[300px]">
          <p className="font-semibold">Tu organización</p>
          <p className="mt-1 text-sm text-slate-400">Como vendedor debes registrar esta información</p>
        </div>

        <div>
          <label htmlFor="organization" className="block font-semibold">Empresa que representas</label>
            {customOrganization ? customOrganizationView : selectOrganizationView } 

            <input className="mt-6 block rounded-xl bg-blue-900 px-6 py-2 font-semibold hover:bg-blue-700" type="submit" value="Crear cuenta" />
        </div>
      </fieldset>
    )

    let view = (
    <main className="bg-gray-900 h-fit w-full py-6 ">
    <div className="mx-auto min-w-[400px] h-fit w-fit text-slate-200">
    <header className="py-4 text-center text-lg font-semibold">
        <Logo/>
        <h1 className="mt-3 text-base">Crear nueva cuenta</h1>
        <p className="mt-1 text-sm text-slate-400">¿Ya tenés una cuenta? <a className="ms-2 text-teal-400" href="/">Iniciar sesión</a></p>
    </header>

    <form className="" onSubmit={onSubmit} >
        <fieldset className="border-t border-slate-600 py-6 md:grid md:grid-cols-2 md:gap-10">
        <div className="mb-6 md:max-w-[300px]">
            <p className="font-semibold">Información personal</p>
            <p className="mt-1 text-sm text-slate-400">Estos campos te identifican como usuario</p>
        </div>

        <div className="">
            <label htmlFor="user" className="block font-semibold">Nombre de usuario</label>
            <input type="text" id="user" onChange={onChange} className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

            <label htmlFor="pass" className="mt-4 block font-semibold">Contraseña</label>
            <input type="password" id="pass" onChange={onChange} className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

            <label htmlFor="email" className="mt-4 block font-semibold">Correo electrónico</label>
            <input type="email" id="email" onChange={onChange} className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

            <label htmlFor="country" className="mt-4 block font-semibold">País</label>
            <select id="country" onChange={onChange} className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1">
            {countryOptions.map(it => (<option value={it.value}>{it.text}</option>))}
            </select>

            <label className="mt-4 block font-semibold">Rol</label>
            <p className="text-sm text-slate-400">¿Qué deseas hacer en Marketshared?</p>
            <Chip id="vendedor" title="Soy vendedor" 
            checked={buttonChecked === "vendedor" ? true : false} callback={onRolClick}/>
            <Chip id="comprador" title="Soy comprador" 
            checked={buttonChecked === "comprador" ? true : false} callback={onRolClick}/>
            
        </div>
        </fieldset>

        {setCurrentView()}

    </form>
    </div>
    </main>
    )

    return view;
}