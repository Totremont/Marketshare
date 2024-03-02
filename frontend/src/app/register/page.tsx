'use client'
import {useState, useRef, useEffect} from "react"
import Chip from "../../components/chip";
import Logo from "../../components/logo";
import Visibility from "@/private/utils/domvisibility";
import RequestStatus from "@/private/utils/requeststatus";

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
    //State para datos que se obtienen de otro ms
    let [bankList, setBankList] = useState([{value:"unknown",text:"Seleccioná un banco"}]);             //{value, text}
    let [countryList, setCountryList] = useState([{value:"unknown",text:"Seleccioná un país"}]);
    let [orgList, setOrgList] = useState([{value:"unknown",text:"Seleccioná una empresa"}]);

    useEffect(() => 
    {
        requestFormData(setOrgList,setBankList,setCountryList);
    },[])

    //View states
    let [rolSelected, setRolSelected] = useState("vendedor");
    let [customOrganization, setCustomOrganization] = useState(false)
    let onRolClick = (event : React.MouseEvent<HTMLElement>) => 
    {
        setRolSelected(event.currentTarget.id)
        setRol(event.currentTarget.id)
    }

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
        let view = rolSelected === 'vendedor' ?
                <>
                    {vendedorView(Visibility.VISIBLE)}
                    {compradorView(Visibility.INVISIBLE)}
                </>
        : 
                <>
                    {compradorView(Visibility.VISIBLE)}
                    {vendedorView(Visibility.INVISIBLE)}
                </>
        
        return view;
        
    }

    let customOrganizationView = (
        <><input type="text" id="organization" onChange={onChange} className="mt-2 w-[60%] rounded-md border border-slate-600 bg-gray-800 px-1 py-1 md:w-[300px]" />
        <button className="text-orange-100 text-sm mt-2 block font-semibold" onClick={(ev) => {ev.preventDefault(); setCustomOrganization(false)}}>Elegir de lista</button></>
    );

    let selectOrganizationView = (
    <>
        <select id="organization" className="mt-2 w-[60%] rounded-md 
        border border-slate-600 bg-gray-800 px-1 py-1 md:w-[300px]" 
        onChange={onChange}>
            {orgList.map((it,index) =>
            <option key={`org_${index}`} value={it.value}>{it.text}</option> )}
        </select>
        <button className="text-orange-100 text-sm mt-2 block font-semibold" onClick={(ev) => {ev.preventDefault(); setCustomOrganization(true)}}>No encuentro mi empresa</button>
    </>
        
    );

    let compradorView = (visibility : string ) => 
    (
        <fieldset className={`${visibility} mt-8 border-t border-slate-600 pt-6 md:grid md:grid-cols-2 md:gap-10`}>
            <div className="md:max-w-[300px]">
                <p className="font-semibold">Datos bancarios y organizativos</p>
                <p className="mt-1 text-sm text-slate-400">Como comprador debes registrar esta información</p>
            </div>

            <div className="">
            <label htmlFor="organization" className="block font-semibold">Empresa que representas</label>
                {customOrganization ? customOrganizationView : selectOrganizationView } 

                <label htmlFor="bank" className="block font-semibold mt-4">Banco</label>
                <select id="bank" onChange={onChange} className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1">
                {bankList.map((it,index) => (<option key={`bank_${index}`} value={it.value}>{it.text}</option>))}
                </select>

                <label htmlFor="money" className="mt-4 block font-semibold">Dinero</label>
                <p className="text-sm text-slate-400 w-[60%] md:w-[300px]">Transfiere dinero a tu cuenta y empieza a comprar</p>
                <input type="number" id="money" onChange={onChange} className="mt-2 w-[40%] md:w-[200px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

                <input className="mt-6 block rounded-xl bg-blue-900 px-6 py-2 font-semibold hover:bg-blue-800 cursor-pointer "type="submit" value="Crear cuenta" />
            </div>
        </fieldset>
    )

    let vendedorView = (visibility : string) => 
    (
        <fieldset className={`${visibility} mt-8 border-t border-slate-600 pt-6 md:grid md:grid-cols-2 md:gap-10`}>
        <div className="mb-6 md:max-w-[300px]">
          <p className="font-semibold">Tu organización</p>
          <p className="mt-1 text-sm text-slate-400">Como vendedor debes registrar esta información</p>
        </div>
        <div>
          <label htmlFor="organization" className="block font-semibold">Empresa que representas</label>
            {customOrganization ? customOrganizationView : selectOrganizationView } 
            <input className="mt-6 block rounded-xl bg-blue-900 px-6 py-2 font-semibold hover:bg-blue-800 cursor-pointer" type="submit" value="Crear cuenta" />
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
        <fieldset className="border-t border-slate-600 pt-6 md:grid md:grid-cols-2 md:gap-10">
        <div className="mb-6 md:max-w-[300px]">
            <p className="font-semibold">Información personal</p>
            <p className="mt-1 text-sm text-slate-400">Estos campos te identifican como usuario</p>
        </div>

        <div >
            <label htmlFor="user" className="block font-semibold">Nombre de usuario</label>
            <input type="text" id="user" onChange={onChange} className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

            <label htmlFor="pass" className="mt-4 block font-semibold">Contraseña</label>
            <input type="password" id="pass" onChange={onChange} className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

            <label htmlFor="email" className="mt-4 block font-semibold">Correo electrónico</label>
            <input type="email" id="email" onChange={onChange} className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

            <label htmlFor="country" className="mt-4 block font-semibold">País</label>
            <select id="country" onChange={onChange} className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1">
            {countryList.map((it,index) => (<option key={`country_${index}`}value={it.value}>{it.text}</option>))}
            </select>

            <label className="mt-4 block font-semibold">Rol</label>
            <p className="text-sm text-slate-400">¿Qué deseas hacer en Marketshared?</p>

            <Chip id="vendedor" key="vendedor" title="Soy vendedor" 
            checked={rolSelected === "vendedor" ? true : false} callback={onRolClick}/>

            <Chip id="comprador" key="vendedor" title="Soy comprador" 
            checked={rolSelected === "comprador" ? true : false} callback={onRolClick}/>
            
        </div>
        </fieldset>

        {setCurrentView()}

    </form>
    </div>
    </main>
    )

    return view;
}

//Datos de paises, organizaciones y bancos
function requestFormData(orgCallback : any, bankCallback : any, countryCallback : any)
{
    let req = (endpoint : string) => fetch(`${process.env.NEXT_PUBLIC_MS_USUARIO_HOST}/${endpoint}`,
      { method : 'GET',
        mode : 'cors',
        headers: 
        {
          "Authorization":    "Basic cHJ1ZWJhOmRhbg==",
          //"Content-Type":     "application/x-www-form-urlencoded",
          "Accept":           "application/json",
        },
      }
    );

    req('internal/countries').then(
        async (response) => 
        {
            if(response.status === RequestStatus.OK)
            {
                let body = await response.json();
                countryCallback
                (
                    [{value:"unknown",text:"Seleccioná un pais"}].concat
                    (
                        body.map((it : any) => {return {value : it.name, text : it.name}})
                    )
                );
            }
        }
    )

    req('internal/banks').then(
        async (response) => 
        {
            if(response.status === RequestStatus.OK)
            {
                let body = await response.json();
                bankCallback
                (
                    [{value:"unknown",text:"Seleccioná un banco"}].concat
                    (
                        body.map((it : any) => {return {value : it.name, text : it.name}})
                    )
                );
            }
        }
    )

    req('internal/organizations').then(
        async (response) => 
        {
            if(response.status === RequestStatus.OK)
            {
                let body = await response.json();
                orgCallback
                (
                    [{value:"unknown",text:"Seleccioná una empresa"}].concat
                    (
                        body.map((it : any) => {return {value : it.name, text : it.name}})
                    )
                );
            }
        }
    )
    
     
}

