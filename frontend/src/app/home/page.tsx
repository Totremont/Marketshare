import { cookies, headers } from "next/headers";
import Headline from "../../components/home/headline";
import OrderCard from "../../components/home/ordercard";
import ProductCard from "../../components/home/productcard";
import UserCard from "../../components/home/usercard";
import { ACCESS_TOKEN, USERNAME_HEADER, USER_ROLE_HEADER } from "@/middleware";
import { findAllOrdersByRole, findAllProducts, findAllUsersByOppositeRole, findUser } from "@/private/actions/homedata";
import ErrorPage, { ERROR_MISSING_DATA } from "@/components/error";
import { redirect } from "next/navigation";

export default function Home()
{ 
  /*
  //Home es un server component. Los componentes son clients (y en ellos se encuentra la interactividad)
  let username = headers().get(USERNAME_HEADER);
  let userRole = headers().get(USER_ROLE_HEADER);
  let token = cookies().get(ACCESS_TOKEN)?.value;

  //Eliminar cookies y otros datos
  const onRefresh = () => 
  {
      cookies().getAll().forEach(cookie => cookies().delete(cookie));
      redirect('/');
  }

  if(!username || !userRole || !token) return <ErrorPage errorType={ERROR_MISSING_DATA} onClick={onRefresh} />

  let notFoundView = (title : string) => <p>{title}</p>;

  //Datos | Cuando son null hubo un problema con la request
  let ownUser;
  let otherUsers;
  let products;
  let orders;

  //Callback que se añade a cualquier fetch. Esto devuelve otra promesa (por ser async) que resuelve en null o el body
  let resolve = (arg : Error | Response) => 
  {
    if(arg instanceof Error) return Promise.resolve(undefined);
    else if(arg.ok) return arg.json()
    else return Promise.resolve(undefined);
  }

  try
  {
    ownUser = await findUser(username);     
  } catch(e){}

  if(ownUser)
  {
    let requestUsers = findAllUsersByOppositeRole(userRole,token).then(resolve,resolve);
    let requestProducts = findAllProducts(token).then(resolve,resolve);
    let requestOrders = findAllOrdersByRole(userRole,ownUser.id,token).then(resolve,resolve);
    //Como todos los callbacks resuelven, este conjunto nunca se rechaza
    Promise.all([requestUsers,requestProducts,requestOrders]).then(
      (values) => 
      {
        values.forEach((it, index) => 
        {
          if(index === 0) otherUsers = values[index];
          else if(index == 1) products = values[index];
          else orders = values[index];
        }
        )
      })     
  }
  */

  let view = 
  (       
  <div className="h-fit w-full bg-gray-900 px-3 pb-3 text-slate-200">
    {
      /*
      findUser(username).then
      (
        (res) => "<Header/>"
      ,
      (err) => 
      )
      */
    }

  <main className="max-w-[1500px] mx-auto">

  <div className="md:flex mt-[60px]">

    <aside className="md:max-w-[250px] mb-3 md:mb-0 bg-gray-800 p-3 rounded-lg">

      <section>
        <header className="pb-3 border-b border-slate-600">
          <h1 className="text-lg font-semibold">Última actividad</h1>
        </header>

        <div className="flex md:block">
          <p>Acá va un headline</p>
        </div>
      </section>
        
      <section>
        <header className="mt-4 md:mt-10 pb-3 border-b flex border-slate-600 items-center">
          <h1 className="text-lg font-semibold">Últimos avisos</h1>
          <button className="mx-4 bg-[#A0522D] rounded-xl px-2 py-1 
            text-sm font-semibold hover:bg-[#b55d33]">+ Aviso</button>
        </header>

        <div className="flex md:block">
        <p>Acá va un headline</p>
        </div>
      </section>

    </aside>

    <section className="md:mx-10 border-t py-4 border-slate-600 md:border-0 md:py-0">

      <header className="border-slate-600">
        <section className="flex">
          <h1 className="text-lg font-semibold">Productos</h1>
          <button className="mx-4 bg-[#A0522D] rounded-xl px-2 py-1 
          text-sm font-semibold hover:bg-[#b55d33]">+ Nuevo</button>
        </section>
        <section>
          <span className="text-sm py-2 border block min-w-[200px] w-[300px] ps-2 before:content-['🔎'] rounded-md border-slate-600 before:pr-1 my-4 text-slate-400">Buscar</span>
          <button className="rounded-2xl border border-slate-600 p-1 px-3 text-sm font-semibold">Mis productos</button>
          <button className="ms-2 rounded-2xl border border-slate-600 bg-slate-600 p-1 px-3 text-sm font-semibold">✓ | Todos</button>
        </section>
      </header>

      <section className="flex flex-wrap my-8">
      {
        /*
        findAllProducts(token).then
        (
          (res) => "<ProductCard />"
          ,
          (err) => 
        )
        */
      }
      </section>

      <header className="pb-3 border-slate-600">
        <section className="flex">
          <h1 className="text-lg font-semibold">Clientes</h1>
        </section>
        <section>
          <span className="text-sm py-2 border block min-w-[200px] w-[300px] ps-2 before:content-['🔎'] rounded-md border-slate-600 before:pr-1 my-4 text-slate-400">Buscar</span>
          <button className="rounded-2xl border border-slate-600 p-1 px-3 text-sm font-semibold">Mis clientes</button>
          <button className="ms-2 rounded-2xl border border-slate-600 bg-slate-600 p-1 px-3 text-sm font-semibold">✓ | Todos</button>
        </section>
      </header>

      <section className="flex flex-wrap mb-8 mt-6 items-start">
      {
        /*
        findAllUsersByOppositeRole(userRole,token).then
        (
          (res) => "<UserCard />"
          ,
          (err) => 
        )
        */
      }
      </section>

      <header className="pb-3 border-slate-600">
        <section className="flex">
          <h1 className="text-lg font-semibold">Pedidos</h1>
        </section>
        <section>
          <span className="text-sm py-2 border block min-w-[200px] w-[300px] ps-2 before:content-['🔎'] rounded-md border-slate-600 before:pr-1 my-4 text-slate-400">Buscar</span>
          <button className="rounded-2xl border border-slate-600 p-1 px-3 text-sm font-semibold">Pendientes</button>
          <button className=" ms-2 rounded-2xl border border-slate-600 p-1 px-3 text-sm font-semibold">Completados</button>
          <button className="ms-2 rounded-2xl border border-slate-600 bg-slate-600 p-1 px-3 text-sm font-semibold ">✓ | Todos</button>
        </section>
      </header>

      <section className="flex flex-wrap my-6 items-start">
      {
        /*
        findAllOrdersByRole(userRole,id,token).then
        (
          (res) => "<OrderCard />"
          ,
          (err) => 
        )
        */
      }
      </section>

    </section>

  </div>

  </main>

  </div>
)

    return view;
}