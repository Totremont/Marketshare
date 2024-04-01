'use client'
import {useState, useRef, useEffect} from "react"
import SingleChip from "../../components/chips";
import Logo from "../../components/logo";
import { SnackBar, SnackBarOption, SnackBarProps, SnackBarType } from "@/components/snackbar";
import { createUserSSA } from "@/private/actions/session";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {SubmitButton} from "@/components/buttons";
import { ViewVisibility } from "@/private/utils/properties";

//Pestaña para registrarse

export default function SignIn()
{
    let [showSnack,setShowSnack] = useState(false);
    let snackProps = useRef<SnackBarProps>();

    //View states
    const router = useRouter();
    let [rolSelected, setRolSelected] = useState("ROLE_VENDEDOR");
    let [customOrganization, setCustomOrganization] = useState(false)
    let [userTaken, setUserTaken] = useState(false);

    const initialState = {title : ''};

    const [state, formAction] = useFormState(createUserSSA, initialState);

    //State para datos que se obtienen de otro ms
    let [bankList, setBankList] = useState([{value:"unknown",text:"Seleccioná un banco"}]);             //{value, text}
    let [countryList, setCountryList] = useState([{value:"unknown",text:"Seleccioná un país"}]);
    let [orgList, setOrgList] = useState([{value:"unknown",text:"Seleccioná una empresa"}]);

    useEffect(() => 
    {
        requestFormData(setOrgList,setBankList,setCountryList,setShowSnack,snackProps);
    },[])

    useEffect(() => handleFormResult(router,state,setShowSnack,snackProps,setUserTaken),[state]);

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
        <><input type="text" name="organization" id="organization" required 
        className="mt-3 w-[60%] rounded-md border border-slate-600 bg-gray-800 px-1 py-1 md:w-[300px]" />
        <button className="text-orange-100 text-sm mt-3
         block font-semibold" onClick={(ev) => {ev.preventDefault(); setCustomOrganization(false)}}>Elegir de lista</button></>
    );

    let selectOrganizationView = (
    <>
        <select name="organization" id="organization" required className="mt-3
         w-[60%] rounded-md border border-slate-600 bg-gray-800 px-1 py-1 md:w-[300px]">
            {orgList.map((it,index) =>
            <option disabled={index==0} key={`org_${index}`} value={it.value}>{it.text}</option> )}
        </select>
        <button className="text-orange-100 text-sm mt-3
         block font-semibold" onClick={(ev) => {ev.preventDefault(); setCustomOrganization(true)}}>No encuentro mi empresa</button>
    </>
        
    );

    let compradorView = (visibility : string ) => 
    {
        
        const style = `${visibility} md:grid md:grid-cols-2 md:gap-10 mt-8 border-t border-slate-600 pt-6`;
        return (
        <fieldset className={style}>
            <div className="mb-6 md:max-w-[300px]">
                <p className="font-semibold">Datos bancarios y organizativos</p>
                <p className="mt-1 text-sm text-slate-400">Como comprador debes registrar esta información</p>
            </div>

            <div className="">
            <label htmlFor="organization" className="block font-semibold">Empresa que representas</label>
                {customOrganization ? customOrganizationView : selectOrganizationView } 

                <label htmlFor="bank" className="block font-semibold mt-4">Banco</label>
                <select name="bank" id="bank" required={rolSelected === 'ROLE_COMPRADOR'} className="mt-3
                 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1">
                {bankList.map((it,index) => (<option disabled={index==0} key={`bank_${index}`} value={it.value}>{it.text}</option>))}
                </select>

                <label htmlFor="money" className="mt-4 block font-semibold">Dinero</label>
                <p className="text-sm text-slate-400 w-[60%] md:w-[300px]">Transfiere dinero a tu cuenta y empieza a comprar</p>
                <input type="number" min={0} name="money" id="money" required={rolSelected === 'ROLE_COMPRADOR'} className="mt-3
                 w-[40%] md:w-[200px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />
                <SubmitButton title="Crear cuenta"/>
            </div>
        </fieldset>
    )
    }

    let vendedorView = (visibility : string) =>
    { 
        const style = `${visibility} md:grid md:grid-cols-2 md:gap-10 mt-8 border-t border-slate-600 pt-6`;
        return (
        <fieldset className={style}>
        <div className="mb-6 md:max-w-[300px]">
          <p className="font-semibold">Tu organización</p>
          <p className="mt-1 text-sm text-slate-400">Como vendedor debes registrar esta información</p>
        </div>
        <div>
          <label htmlFor="organization" className="block font-semibold">Empresa que representas</label>
            {customOrganization ? customOrganizationView : selectOrganizationView } 
            <SubmitButton title="Crear cuenta"/>
        </div>
      </fieldset>
    )
    }

    let view = (
    <main className="bg-gray-900 h-fit w-full py-6 ">
    <div className="mx-auto min-w-[400px] h-fit w-fit text-slate-200">
    <header className="py-4 text-center text-lg font-semibold">
        <Logo style="mx-auto" inverted={false}/>
        <h1 className="mt-3 text-base">Crear nueva cuenta</h1>
        <p className="mt-1 text-sm text-slate-400">¿Ya tenés una cuenta? <a className="ms-2 text-teal-400" href="/">Iniciar sesión</a></p>
    </header>

    <form action={formAction} >
        <fieldset className="border-t border-slate-600 pt-6 md:grid md:grid-cols-2 md:gap-10">
        <div className="mb-6 md:max-w-[300px]">
            <p className="font-semibold">Información personal</p>
            <p className="mt-1 text-sm text-slate-400">Estos campos te identifican como usuario</p>
        </div>

        <div >
            <label htmlFor="user" className="block font-semibold">Nombre de usuario</label>
            <input type="text" name="user" id="user" required 
            className={`mt-3 w-[60%] md:w-[300px] rounded-md border 
            ${userTaken ? 'border-red-300 text-red-300' : 'border-slate-600 text-slate-200'} focus:text-slate-200 bg-gray-800 px-1 py-1`} />

            <label htmlFor="pass" className="mt-4 block font-semibold">Contraseña</label>
            <input type="password" name="pass" id="pass" required className="mt-3 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

            <label htmlFor="email" className="mt-4 block font-semibold">Correo electrónico</label>
            <input type="email" name="email" id="email" required className="mt-3 w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

            <label htmlFor="country" className="mt-4 block font-semibold">País</label>
            <select id="country" name="country" required className="mt-3
             w-[60%] md:w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1">
            {countryList.map((it,index) => (<option disabled={index==0} key={`country_${index}`} value={it.value}>{it.text}</option>))}
            </select>

            <label className="mt-4 block font-semibold">Rol</label>
            <p className="text-sm text-slate-400">¿Qué deseas hacer en Marketshare?</p>

            <SingleChip id="ROLE_VENDEDOR" key="ROLE_VENDEDOR" title="Soy vendedor" 
            checked={rolSelected === "ROLE_VENDEDOR" ? true : false} callback={(e) => setRolSelected(e.currentTarget.id)}/>

            <SingleChip id="ROLE_COMPRADOR" key="ROLE_COMPRADOR" title="Soy comprador" 
            checked={rolSelected === "ROLE_COMPRADOR" ? true : false} callback={(e) => setRolSelected(e.currentTarget.id)}/>

            <input type="hidden" name="role" value={rolSelected} />
            
        </div>
        </fieldset>

        {setCurrentView()}

    </form>
    </div>
    {showSnack ? <SnackBar key="SNACK" title={snackProps.current!.title} 
    body={snackProps.current!.body} type={snackProps.current!.type} options={snackProps.current!.options}/> : null}
    </main>
    )

    return view;
}


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
            if(values.every(res => res.ok))
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

function handleFormResult(router : any, state : {title : string} | undefined, setShowSnack : any, ref : any,setUserTaken : any)
{
    if(!state) return;
    setUserTaken(false);
    //{'USERNAME_TAKEN','USER_CREATION_ERROR','REQUEST_ERROR',''SUCCESS','AUTH_ERROR'}
    switch(state.title)
    {
        case 'USERNAME_TAKEN':
            setUserTaken(true);
            showUsernameTakenMsg(setShowSnack,ref);
            break;
        case 'USER_CREATION_ERROR':
            showUsercreatedNoToken(setShowSnack,ref);    //Se creó el user pero fallo en obtener el token 
            setTimeout(() => router.push('/'), SnackBarType.NORMAL_TIME);
            break;
        default:
            showServerError(setShowSnack,ref);
            break;
    }
}


function showUsernameTakenMsg(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.INFORMATIVE,"Problema con el nombre de usuario",
    "Ese nombre de usuario ya está en uso. Por favor, elige otro.",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)

}

function showUsercreatedNoToken(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.SUCCESSFUL,"Usuario creado",
    "Tu usuario ha sido creado. Te redirigiremos a la pantalla de inicio de sesión",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)

}

function showMissingForms(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.INFORMATIVE,"Campos sin completar",
    "Te falta completar algunos campos obligatorios",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

function showServerError(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.ERROR,"Error de servidor",
    "Ocurrió un error inesperado. Intentalo más tarde",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)

}

function showErrorGettingExternalData(setShowSnack : any, ref : any, retryCallback : any)
{
    ref.current = new SnackBarProps(SnackBarType.ERROR,"Error al recuperar datos",
    "Ocurrió un error al traer los datos necesarios para crearte una cuenta. Podés reintentar ahora o más tarde",
    [new SnackBarOption("Reintentar",retryCallback)]);

    setShowSnack(true);

}

