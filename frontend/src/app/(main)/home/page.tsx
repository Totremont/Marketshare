import { cookies, headers } from "next/headers";
import Headline, { HeadlineSkeleton, HeadlineType } from "../../../components/home/headline";
import { ACCESS_TOKEN, ROLE_COMPRADOR, USERNAME_HEADER, USER_ROLE_HEADER } from "@/middleware";
import { redirect } from "next/navigation";
import SearchBar from "@/components/home/searchbar";
import { Suspense, useRef, useState } from "react";
import { ProductCardSkeleton } from "@/components/home/clientside/productcard";
import ProductList from "@/components/home/productlist";
import { UserCardSkeleton } from "@/components/home/clientside/usercard";
import { OrderCardSkeleton } from "@/components/home/clientside/ordercard";
import UserList from "@/components/home/userlist";
import OrderList from "@/components/home/orderlist";
import { CreateReview } from "@/components/product/page/reviews";

export default async function Home()
{ 
  
  //Home es un server component. Los componentes son clients (y en ellos se encuentra la interactividad)
  //let username = headers().get(USERNAME_HEADER)!;
  let userRole = headers().get(USER_ROLE_HEADER);
  //let token = cookies().get(ACCESS_TOKEN)?.value;

  //Eliminar cookies y otros datos
  const onRefresh = () => 
  {
      cookies().getAll().forEach(cookie => cookies().delete(cookie));
      redirect('/');
  }

  let view = 
  (       
  <div className=" h-fit max-w-[1600px] mx-auto md:flex px-6">

    <aside className="md:max-w-[250px] mb-3 md:mb-0 bg-gray-800 p-3 rounded-lg">

      <section>
        <header className="pb-3 border-b border-slate-600">
          <h1 className="text-lg font-semibold">Última actividad</h1>
        </header>

        <div className="flex md:block">
          <HeadlineSkeleton/>
        </div>
      </section>
        
      <section>
        <header className="mt-4 md:mt-10 pb-3 border-b flex border-slate-600 items-center">
          <h1 className="text-lg font-semibold">Últimos avisos</h1>
          <button className="mx-4 bg-[#A0522D] rounded-lg px-2 py-1 
            text-sm font-semibold hover:bg-[#b55d33]">+ Aviso</button>
        </header>

        <div className="flex md:block">
          <HeadlineSkeleton/>
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
          
          <SearchBar setTextWritten={null}/>
          <button className="rounded-2xl border border-slate-600 p-1 px-3 text-sm font-semibold">Mis productos</button>
          <button className="ms-2 rounded-2xl border border-slate-600 bg-slate-600 p-1 px-3 text-sm font-semibold">✓ | Todos</button>
        </section>
      </header>

      <section className="flex flex-wrap gap-3 my-8">
      {
          <Suspense fallback={<ProductCardSkeleton />}>
            <ProductList />
          </Suspense>
      }
      </section>

      <header className="pb-3 border-slate-600">
        <section className="flex">
          <h1 className="text-lg font-semibold">{userRole === ROLE_COMPRADOR ? 'Vendedores' : 'Clientes'}</h1>
        </section>
        <section>
        <SearchBar setTextWritten={null}/>
          <button className="rounded-2xl border border-slate-600 p-1 px-3 text-sm font-semibold">Mis clientes</button>
          <button className="ms-2 rounded-2xl border border-slate-600 bg-slate-600 p-1 px-3 text-sm font-semibold">✓ | Todos</button>
        </section>
      </header>

      <section className="flex flex-wrap gap-3 mb-8 mt-6 items-start">
      {
        <Suspense fallback={<UserCardSkeleton/>}>
          <UserList/>
        </Suspense>
      }
      </section>

      <header className="pb-3 border-slate-600">
        <section className="flex">
          <h1 className="text-lg font-semibold">Pedidos</h1>
        </section>
        <section>
        <SearchBar setTextWritten={null}/>
          <button className="rounded-2xl border border-slate-600 p-1 px-3 text-sm font-semibold">Pendientes</button>
          <button className=" ms-2 rounded-2xl border border-slate-600 p-1 px-3 text-sm font-semibold">Completados</button>
          <button className="ms-2 rounded-2xl border border-slate-600 bg-slate-600 p-1 px-3 text-sm font-semibold ">✓ | Todos</button>
        </section>
      </header>

      <section className="flex flex-wrap gap-3 my-6 items-start">
      {
        <Suspense fallback={<OrderCardSkeleton/>}>
          <OrderList/>
        </Suspense>
      }
      </section>
    </section>
  </div>
)

    return view;
}