'use client'
import {useState, useRef, useEffect} from "react"
import Chip from "../../components/chip";
import Logo from "../../components/logo";
import ViewVisibility from "@/private/utils/domvisibility";
import RequestStatus from "@/private/utils/requeststatus";
import { NotificationComponent, NotificationOptions, NotificationProps, NotificationType } from "@/components/notification";
import { createUserSSA } from "@/private/actions/register";

//Pestaña para registrarse


export default function SignIn()
{
    let [showSnack,setShowSnack] = useState(false);
    let snackProps = useRef<NotificationProps>();
    //Datos
    /*
    let [user, setUser] = useState("");
    let [pass, setPass] = useState("");
    let [email, setEmail] = useState("")
    let [country, setCountry] = useState("Argentina")
    let [rol, setRol] = useState("ROLE_VENDEDOR")
    let [bank,setBank] = useState("Santander")
    let [money,setMoney] = useState("")
    let [organization,setOrganization] = useState("IBM")
    */
    //State para datos que se obtienen de otro ms
    let [bankList, setBankList] = useState([{value:"unknown",text:"Seleccioná un banco"}]);             //{value, text}
    let [countryList, setCountryList] = useState([{value:"unknown",text:"Seleccioná un país"}]);
    let [orgList, setOrgList] = useState([{value:"unknown",text:"Seleccioná una empresa"}]);

    useEffect(() => 
    {
        requestFormData(setOrgList,setBankList,setCountryList,setShowSnack,snackProps);
    },[])

    //View states
    let [rolSelected, setRolSelected] = useState("ROLE_VENDEDOR");
    let [customOrganization, setCustomOrganization] = useState(false)
    let onRolClick = (event : React.MouseEvent<HTMLElement>) => 
    {
        setRolSelected(event.currentTarget.id);
    }

    const createUser = createUserSSA.bind(null,rolSelected);

    /*

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

    */

    let setCurrentView = () =>
    {
        let view = rolSelected === 'ROLE_VENDEDOR' ?
                <>
                    {vendedorView(ViewVisibility.VISIBLE)}
                    {compradorView(ViewVisibility.INVISIBLE)}
                </>
        : 
                <>
                    {compradorView(ViewVisibility.VISIBLE)}
                    {vendedorView(ViewVisibility.INVISIBLE)}
                </>
        
        return view;
        
    }

    let customOrganizationView = (
        <><input type="text" name="organization" id="organization" /*onChange={onChange}*/ className="mt-2 w-[60%] rounded-md border border-slate-600 bg-gray-800 px-1 py-1 md:w-[300px]" />
        <button className="text-orange-100 text-sm mt-2 block font-semibold" onClick={(ev) => {ev.preventDefault(); setCustomOrganization(false)}}>Elegir de lista</button></>
    );

    let selectOrganizationView = (
    <>
        <select name="organization" id="organization" className="mt-2 w-[60%] rounded-md 
        border border-slate-600 bg-gray-800 px-1 py-1 md:w-[300px]" 
        /*onChange={onChange}*/>
            {orgList.map((it,index) =>
            <option key={`org_${index}`} value={it.value}>{it.text}</option> )}
        </select>
        <button className="text-orange-100 text-sm mt-2 block font-semibold" onClick={(ev) => {ev.preventDefault(); setCustomOrganization(true)}}>No encuentro mi empresa</button>
    </>
        
    );

    let compradorView = (visibility : string ) => 
    (
        <fieldset className={`${visibility} md:grid md:grid-cols-2 md:gap-10 mt-8 border-t border-slate-600 pt-6`}>
            <div className="md:max-w-[300px]">
                <p className="font-semibold">Datos bancarios y organizativos</p>
                <p className="mt-1 text-sm text-slate-400">Como comprador debes registrar esta información</p>
            </div>

            <div className="">
            <label htmlFor="organization" className="block font-semibold">Empresa que representas</label>
                {customOrganization ? customOrganizationView : selectOrganizationView } 

                <label htmlFor="bank" className="block font-semibold mt-4">Banco</label>
                <select name="bank" id="bank" /*onChange={onChange}*/ className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1">
                {bankList.map((it,index) => (<option key={`bank_${index}`} value={it.value}>{it.text}</option>))}
                </select>

                <label htmlFor="money" className="mt-4 block font-semibold">Dinero</label>
                <p className="text-sm text-slate-400 w-[60%] md:w-[300px]">Transfiere dinero a tu cuenta y empieza a comprar</p>
                <input type="number" name="money" id="money" /*onChange={onChange}*/ className="mt-2 w-[40%] md:w-[200px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

                <input className="mt-6 block rounded-xl bg-blue-900 px-6 py-2 font-semibold hover:bg-blue-800 cursor-pointer "type="submit" value="Crear cuenta" />
            </div>
        </fieldset>
    )

    let vendedorView = (visibility : string) => 
    (
        <fieldset className={`${visibility} md:grid md:grid-cols-2 md:gap-10 mt-8 border-t border-slate-600 pt-6`}>
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

    <form className="" /*onSubmit={onSubmit}*/ action={createUser} >
        <fieldset className="border-t border-slate-600 pt-6 md:grid md:grid-cols-2 md:gap-10">
        <div className="mb-6 md:max-w-[300px]">
            <p className="font-semibold">Información personal</p>
            <p className="mt-1 text-sm text-slate-400">Estos campos te identifican como usuario</p>
        </div>

        <div >
            <label htmlFor="user" className="block font-semibold">Nombre de usuario</label>
            <input type="text" name="user" id="user" /*onChange={onChange}*/ className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

            <label htmlFor="pass" className="mt-4 block font-semibold">Contraseña</label>
            <input type="password" name="pass" id="pass" /*onChange={onChange}*/ className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

            <label htmlFor="email" className="mt-4 block font-semibold">Correo electrónico</label>
            <input type="email" name="email" id="email" /*onChange={onChange}*/ className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

            <label htmlFor="country" className="mt-4 block font-semibold">País</label>
            <select id="country" name="country" /*onChange={onChange}*/ className="mt-2 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1">
            {countryList.map((it,index) => (<option key={`country_${index}`} value={it.value}>{it.text}</option>))}
            </select>

            <label className="mt-4 block font-semibold">Rol</label>
            <p className="text-sm text-slate-400">¿Qué deseas hacer en Marketshared?</p>

            <Chip id="ROLE_VENDEDOR" key="ROLE_VENDEDOR" title="Soy vendedor" 
            checked={rolSelected === "ROLE_VENDEDOR" ? true : false} callback={onRolClick}/>

            <Chip id="ROLE_COMPRADOR" key="ROLE_COMPRADOR" title="Soy comprador" 
            checked={rolSelected === "ROLE_COMPRADOR" ? true : false} callback={onRolClick}/>
            
        </div>
        </fieldset>

        {setCurrentView()}

    </form>
    </div>
    {showSnack ? <NotificationComponent key="SNACK" title={snackProps.current!.title} 
    body={snackProps.current!.body} type={snackProps.current!.type} options={snackProps.current!.options}/> : null}
    </main>
    )

    return view;
}

//Comprobar si existe el username y si no, crearlo
function getFromMsUsuarios(endpoint : string)
{
    return fetch(`${process.env.NEXT_PUBLIC_ms_usuarios_host}/${endpoint}`,
      { method : 'GET',
        mode : 'cors',
        headers: 
        {
          "Authorization":    `Basic ${process.env.NEXT_PUBLIC_clients_key}`,
          //"Content-Type":     "application/x-www-form-urlencoded",
          "Accept":           "application/json",
        },
      }
    );
}

/*

function validateUser(data: {username, password, country,type,email,organization,bank,money}, router, setShowSnack : any)
{
    getFromMsUsuarios(`api/users?username=${data.username}`).then(
        (response) => 
        {
            switch(response.status)
            {
                case RequestStatus.OK:
                    showUsernameTakenMsg(setShowSnack);
                    break;
                case RequestStatus.NOT_FOUND:
                    createUser(data,router,setShowSnack);
                    break;
                default:
                    showServerError(setShowSnack);
            }

        }
    )
}

async function createUser(data : {username, password, country,type,email,organization,bank,money}, router,setShowSnack)
{
    data.type = data.type === 'ROLE_COMPRADOR' ? 'comprador' : 'vendedor';
    let reqUser = fetch(`${process.env.NEXT_PUBLIC_ms_usuarios_host}/api/users`,
    { 
        method : 'POST',
        mode : 'cors',
        headers: 
        {
            "Authorization":    `Basic ${process.env.NEXT_PUBLIC_clients_key}`,
            "Content-Type":     "application/json",
            "Accept":           "application/json"
        },
        body: JSON.stringify(data)
    }
    )

    try
    {
        let post = await reqUser;
        if(post.status === RequestStatus.OK)
        {
            let result = await requestTokenSSA(data.username,data.password,data.type);
            if(result.title === 'SUCCESS') router.replace('/home');
            else showServerError(setShowSnack);
        } else showServerError(setShowSnack);
    } catch(e : any)
    {
        showServerError(setShowSnack);
    }

}
*/

//Datos de paises, organizaciones y bancos
function requestFormData(orgCallback : any, bankCallback : any, countryCallback : any, setShowSnack : any, ref : any)
{
    let callback = () => {setShowSnack(false); requestFormData(orgCallback,bankCallback,countryCallback,setShowSnack,ref);}

    Promise.all(
    [
        getFromMsUsuarios('api/countries'), 
        getFromMsUsuarios('api/banks'),
        getFromMsUsuarios('api/organizations')
    ]).then(
        (values : Response[]) => 
        {
            if(values.every(res => res.status === RequestStatus.OK))
            {
                values.forEach(async (it,index) => 
                {
                    let body = await it.json();
                    switch(index)
                    {
                        case 0:
                            countryCallback
                            (
                                [{value:"unknown",text:"Seleccioná un país"}].concat
                                (
                                    body.map((obj : any) => {return {value : obj.name, text : obj.name}})
                                )
                            );
                            break;
                        case 1:
                            bankCallback
                            (
                                [{value:"unknown",text:"Seleccioná un banco"}].concat
                                (
                                    body.map((obj : any) => {return {value : obj.name, text : obj.name}})
                                )
                            );
                            break;
                        case 2:
                            orgCallback
                            (
                                [{value:"unknown",text:"Seleccioná una empresa"}].concat
                                (
                                    body.map((obj : any) => {return {value : obj.name, text : obj.name}})
                                )
                            );
                            setShowSnack(false);
                            break;
                    }
                })
            } else showErrorGettingExternalData(setShowSnack,ref,callback);
        },
        (err) => showErrorGettingExternalData(setShowSnack,ref,callback))
    .catch(err => showErrorGettingExternalData(setShowSnack,ref,callback))
}


function showUsernameTakenMsg(setShowSnack : any, ref : any, time : number = NotificationType.NORMAL_TIME )
{
    ref.current = new NotificationProps(NotificationType.INFORMATIVE,"Problema con el nombre de usurio",
    "Ese nombre de usuario ya está en uso. Por favor, elegí otro.",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)

}

function showMissingForms(setShowSnack : any, ref : any, time : number = NotificationType.NORMAL_TIME )
{
    ref.current = new NotificationProps(NotificationType.INFORMATIVE,"Campos sin completar",
    "Te falta completar algunos campos obligatorios",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

function showServerError(setShowSnack : any, ref : any, time : number = NotificationType.NORMAL_TIME )
{
    ref.current = new NotificationProps(NotificationType.ERROR,"Error de servidor",
    "Ocurrió un error inesperado. Intentalo más tarde",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)

}

function showErrorGettingExternalData(setShowSnack : any, ref : any, retryCallback : any)
{
    ref.current = new NotificationProps(NotificationType.ERROR,"Error al recuperar datos",
    "Ocurrió un error al traer los datos necesarios para crearte una cuenta. Podés reintentar ahora o más tarde",
    [new NotificationOptions("Reintentar",retryCallback)]);

    setShowSnack(true);

}

