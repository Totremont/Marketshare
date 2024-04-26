import { cookies, headers } from "next/headers";
import { Headline, HeadlineSkeleton, HeadlineType,} from "../../../components/home/headline";
import { ROLE_COMPRADOR, USER_ROLE_HEADER } from "@/middleware";
import { redirect } from "next/navigation";
import SearchBar from "@/components/home/searchbar";
import { Suspense, useRef, useState } from "react";
import { ProductCardSkeleton } from "@/components/home/clientside/productcard";
import ProductList from "@/components/home/productlist";
import { UserCardSkeleton } from "@/components/home/clientside/usercard";
import { OrderCardSkeleton } from "@/components/home/clientside/ordercard";
import UserList from "@/components/home/userlist";
import OrderList from "@/components/home/orderlist";;
import { Metadata } from "next";
import { GeneralButton } from "@/components/buttons";
import Link from "next/link";
import { BackgroundColors } from "@/private/utils/properties";

export const metadata: Metadata = {
  title: 'Principal',
};

export default async function Home()
{ 
  
  //Home es un server component. Los componentes son clients (y en ellos se encuentra la interactividad)
  let userRole = headers().get(USER_ROLE_HEADER);

  //Eliminar cookies y otros datos
  const onRefresh = () => 
  {
      cookies().getAll().forEach(cookie => cookies().delete(cookie));
      redirect('/');
  }

  let view = 
  (       
  <div className=" h-fit max-w-[1600px] mx-auto md:flex px-6">

    <aside className="w-[400px] mb-3 md:mb-0 bg-gray-800 p-3 rounded-lg">

      <section>
        <header className="pb-3 border-b border-slate-600">
          <h1 className="text-lg font-semibold">Última actividad</h1>
        </header>

        <div className="flex md:block">
          <Headline date='05 de mayo 2024' title='Nuevo vendedor' 
          type={HeadlineType.NEW_USER} options={{orgName: 'IBM', userName: 'IBM_OK', price : '', message: '' }}/>

          <Headline date='02 de mayo 2024' title='Nuevo vendedor' 
          type={HeadlineType.NEW_USER} options={{orgName: 'General Motors', userName: 'GMotors', price : '', message: '' }}/>

          <Headline date='27 de abril 2024' title='Aceite para motor semi-sintético' 
          type={HeadlineType.NEW_PRODUCT} options={{orgName: 'General Motors', userName: 'GMotors', price : '38.000', 
          message: '' }}/>
        </div>
      </section>
        
      <section>
        <header className="mt-4 md:mt-10 pb-3 border-b flex border-slate-600 items-center">
          <h1 className="text-lg font-semibold">Últimos avisos</h1>
          <button className={`mx-2 py-1 px-2 ${BackgroundColors.SIENNA_BROWN} rounded-lg text-sm font-semibold`}>Nuevo aviso</button>
        </header>

        <div className="flex md:block">
          <Headline date='09 de mayo 2024' title='Aumento de precios' 
          type={HeadlineType.NEW_MESSAGE} options={{orgName: 'X Planes', userName: 'X_Planes', price : '', 
          message: 'Vamos a aumentar los precios un 500% porque podemos. Gracias por comprender ' }}/>

          <Headline date='09 de mayo 2024' title='Sobre los reembolsos' 
          type={HeadlineType.NEW_MESSAGE} options={{orgName: 'Colossal Order', userName: 'OrderParadox', price : '', 
          message: 'Vamos a regalar un DLC y pedirle disculpas para que se olviden del estado desastroso de CS2. Umm no debería decir eso.' }}/>
        </div>
      </section>

    </aside>

    <section className="md:mx-10 border-t py-4 border-slate-600 md:border-0 md:py-0">

      <header className="border-slate-600">
        <section className="flex">
          <h1 className="text-lg font-semibold">Productos</h1>
          <Link href='/products/create'>
            <button className={`mx-2 py-1 px-2 ${BackgroundColors.SIENNA_BROWN} rounded-lg text-sm font-semibold`}>Nuevo producto</button>
          </Link>
        </section>
        <section>
          
          <SearchBar setTextWritten={null}/>
          <button type="button" 
          className={`my-4 rounded-2xl flex items-center gap-x-2 
          border border-slate-600 py-1 px-3 text-sm font-semibold hover:bg-gray-800`}>Mis productos</button>
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