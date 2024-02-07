'use client'
import Image from "next/image";
import {FormEvent, useState} from "react"
import {redirect} from 'next/navigation'

//Pestaña principal de inicio de sesión

export default function Login() 
{
  let [user, setUser] = useState("")
  let [pass, setPass] = useState("")

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

    alert(`Has iniciado sesión con usuario: ${user} y contraseña: ${pass}`)

    if(user && pass)  //Si no son null, undefined, empty string, false, etc | [Falsy]
    {
      //validateLogin(user,pass).then()
      redirect("/home")
    }

  }

  return (
  <main className="bg-gray-900 h-screen w-screen flex items-center">
  <div className="w-fit h-fit text-slate-200 my-6 mx-auto min-w-[300px]">
    <header className="mx-auto text-center py-4">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/512px-Tailwind_CSS_Logo.svg.png?20230715030042" className="w-10 mx-auto" />
      <h1 className="font-bold mt-2">Bienvenido a Marketshared</h1>
      <h2 className="text-slate-400">Ingresa con tu cuenta</h2>
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
          text-teal-400 hover:text-teal-300 my-1 block" href="#">Crea una nueva cuenta</a>¡Es gratis!</h1>
      <div className="m-4 border-t border-slate-600 p-2">
        <h1 className="font-semibold">Marketshared es la red de ventas B2B más usada del mundo</h1>
        <p className="text-slate-400">Descubre miles de productos y negocia con las empresas más importantes del mundo</p>
      </div>
    </section>
  </div>
  </main>

  );

  async function validateLogin(user : String, pass : String)
  {
      let result = await fetch("localhost/3000/api...")
      return result.ok
  }

}
