'use client'
import {useState, useRef, useEffect} from "react"
import { SnackBarType,SnackBar, SnackBarProps } from "../components/snackbar";
import Logo from "../components/logo";
import { useFormState, useFormStatus } from "react-dom";
import { requestTokenSSA } from "@/private/actions/session";
import SubmitButton from "@/components/submitbutton";

//Pestaña principal de inicio de sesión

export default function Login() 
{
  let [showSnack,setShowSnack] = useState(false);
  let snackProps = useRef<SnackBarProps>();

  const initialState = {title : ''};

  const [state, formAction] = useFormState(requestTokenSSA, initialState);

  useEffect(() => handleFormResult(state,setShowSnack,snackProps),[state])

  return (
  <main className="bg-gray-900 h-full w-full flex items-center">
  <div className="w-fit h-fit text-slate-200 my-6 mx-auto min-w-[300px]">
    <header className="mx-auto text-center py-4">
      <Logo style="mx-auto" inverted={false}/>
      <h1 className="font-semibold text-lg mt-2">Bienvenido</h1>
      <h2 className="text-slate-400">Ingresá con tu cuenta</h2>
    </header>

    <form action={formAction} className="bg-gray-900 w-fit mx-auto rounded-lg p-3">
      
      <label htmlFor="user" className="block font-semibold">Usuario</label>
      <input type="text" name="user" required className="border 
      rounded-md py-1 px-1  w-full md:w-[350px] bg-gray-800 border-slate-600 mt-3"/>

      <div className="flex items-center mt-4">
        <label htmlFor="pass" className="block font-semibold flex-1">Contraseña</label>
        <a className="text-sm font-semibold 
        text-teal-400 hover:text-teal-300 ms-8" href="#">Olvidé mi contraseña</a>
      </div>
      <input type="password" name="pass" required className="border 
      rounded-md py-1 px-1 w-full md:w-[350px] bg-gray-800 border-slate-600 mt-3"/>

      <SubmitButton title="Iniciar sesión"/>

    </form>

    <section className="text-sm text-center mt-4">
      <h1 className="text-slate-400">¿No sos miembro?<a className="font-semibold 
          text-teal-400 hover:text-teal-300 my-1 block" href="/register">Crea una nueva cuenta</a>¡Es gratis!</h1>
      <div className="m-4 border-t border-slate-600 p-2">
        <h1 className="font-semibold">Marketshare es la red de ventas B2B más usada del mundo</h1>
        <p className="text-slate-400">Descubre miles de productos y negocia con las empresas más importantes del mundo</p>
      </div>
    </section>
  </div>
    {showSnack ? <SnackBar title={snackProps.current!.title} 
    body={snackProps.current!.body} type={snackProps.current!.type} options={snackProps.current!.options}/> : null}
  </main>

  ); 

}

function handleFormResult(state : {title : string}, setShowSnack : any, ref : any)
{
  if(!state) return;
  setShowSnack(false);
    //{'USERNAME_TAKEN','USER_CREATION_ERROR','REQUEST_ERROR',''SUCCESS','AUTH_ERROR'}
    switch(state.title)
    {
        case 'AUTH_ERROR':
            showInvalidData(setShowSnack,ref);
            break;
        case 'REQUEST_ERROR':
            showServerError(setShowSnack,ref);
            break;
        default:
            break;
    }
}

function showServerError(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.ERROR,"Error de servidor",
    "Ocurrió un error inesperado. Intentalo más tarde",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)

}

function showInvalidData(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.ERROR,"Datos erroneos",
    "La combinación de usuario y contraseña es incorrecta.",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)

}

function showMissingData(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.INFORMATIVE,"Datos incompletos",
    "Complete todos los campos antes de continuar.",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)

}

