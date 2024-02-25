import Headline from "../private/components/headline";
import Logo from "../private/components/logo";
import OrderCard from "../private/components/ordercard";
import ProductCard from "../private/components/productcard";
import UserCard from "../private/components/usercard";

export default function Home()
{
    let view = (
        
<div className="h-fit w-full bg-gray-900 px-3 pb-3 text-slate-200">

<Header/>

<main className="max-w-[1500px] mx-auto">

<div className="md:flex mt-[60px]">

  <aside className="md:max-w-[250px] mb-3 md:mb-0 bg-gray-800 p-3 rounded-lg">

    <section>
      <header className="pb-3 border-b border-slate-600">
        <h1 className="text-lg font-semibold">Última actividad</h1>
      </header>

      <div className="flex md:block">
        <Headline />
      </div>
    </section>
      
    <section>
      <header className="mt-4 md:mt-10 pb-3 border-b flex border-slate-600 items-center">
        <h1 className="text-lg font-semibold">Últimos avisos</h1>
        <button className="mx-4 bg-[#A0522D] rounded-xl px-2 py-1 
          text-sm font-semibold hover:bg-[#b55d33]">+ Aviso</button>
      </header>

      <div className="flex md:block">
        <Headline />
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
      <ProductCard />
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

    <UserCard />

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
      <OrderCard />
    </section>

  </section>

</div>

</main>

</div>

    )

    return view;
}