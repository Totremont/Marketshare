'use client'
import {useState, useRef, useEffect} from "react"
import { NotificationType,NotificationComponent, NotificationProps } from "../components/notification";
import Logo from "../components/logo";
import validateSession from "@/private/authorization";

//Pestaña principal de inicio de sesión

export default function Login() 
{
  let [user, setUser] = useState("");
  let [pass, setPass] = useState("");
  let [show,setShow] = useState(false);
  let props = useRef(setIncompleteFieldsProps());

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
    }
  }

  let onSubmit = function(event : React.SyntheticEvent)
  {
    event.preventDefault()  //Necesario en formularios que usan un input type="submit"

    if(user && pass)  //Si no son null, undefined, empty string, false, etc | [Falsy]
    {
      let msRequest = request(user,pass);
      msRequest.then(response => 
      {
        switch(response.status)
        {
          case 200:
            alert("Todo salió OK");
            break;
          case 404:
            setNotFoundProps();
            showNotification;
            break;
          default:
            setDisconnectedProps();
            showNotification;
            break;
        }
      })
      msRequest.catch(e =>
      {
        setDisconnectedProps();
          showNotification;
      } )
  
    }
    else  //Completar campos
    {
      props.current = setIncompleteFieldsProps();
      showNotification();
    }

  }

  return (
  <main className="bg-gray-900 h-full w-full flex items-center">
  <div className="w-fit h-fit text-slate-200 my-6 mx-auto min-w-[300px]">
    <header className="mx-auto text-center py-4">
      <Logo/>
      <h1 className="font-semibold text-lg mt-2">Bienvenido</h1>
      <h2 className="text-slate-400">Ingresá con tu cuenta</h2>
    </header>

    <form onSubmit={onSubmit} className="bg-gray-900 w-fit mx-auto rounded-lg p-3">
      
      <label htmlFor="user" className="block font-semibold">Usuario</label>
      <input type="text" id="user" onChange={onChange} className="border 
      rounded-md py-1 px-1  w-full md:w-[350px] bg-gray-800 border-slate-600 mt-2"/>

      <div className="flex items-center mt-4">
        <label htmlFor="pass" className="block font-semibold flex-1">Contraseña</label>
        <a className="text-sm font-semibold 
        text-teal-400 hover:text-teal-300 ms-8" href="#">Olvidé mi contraseña</a>
      </div>
      <input type="password" id="pass" onChange={onChange} className="border 
      rounded-md py-1 px-1 w-full md:w-[350px] bg-gray-800 border-slate-600 mt-2"/>

      <input className="block mt-6 bg-blue-900 py-2 px-6 rounded-xl font-semibold
        hover:bg-blue-700 w-full" type="submit" value="Iniciar sesión"/>

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
    {show ? <NotificationComponent title={props.current.title} 
    body={props.current.body} type={props.current.type} options={props.current.options}/> : null}
  </main>

  );

  //Un get al ms_usuario no requiere bearer token
  async function request(user : String, pass : String)
  {
      let result = await fetch('http://localhost:8080/internal/user',
      { method : 'GET',
        mode : 'cors',
        headers: 
        {
          "Authorization":    "Basic cHJ1ZWJhOmRhbg==",
          "Content-Type":     "application/x-www-form-urlencoded",
          "Accept":           "application/json",
        },
      }
      );
      return result
  }

  function showNotification(time : number = NotificationType.NORMAL_TIME)
  {
      setShow(true);
      setTimeout(() => setShow(false),time)
  }

}

  function setDisconnectedProps()
  {
    return new NotificationProps(NotificationType.ERROR,"Ocurrió un error",
    "Ocurrió un problema inesperado",[]);
  }

  function setNotFoundProps()
  {
    return new NotificationProps(NotificationType.INFORMATIVE,"Error al iniciar sesión",
    "No se encontró ninguna cuenta con esos valores",[]);
  }

  function setIncompleteFieldsProps()
  {
    return new NotificationProps(NotificationType.ERROR,"Campos incompletos",
    "Complete todos los campos antes de continuar",[]);
  }


