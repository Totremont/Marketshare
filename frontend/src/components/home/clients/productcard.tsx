'use client'
import { ChipFeature } from "@/components/chip";
import formProductsToJson from "@/private/utils/formtojson";
import { Skeleton, image } from "@nextui-org/react";
import { use, useEffect, useState } from "react";

/*Private*/

export default function ProductCard({id,imageFile,published,category,name,description,price,orgName,userCountry})
{

    console.log(imageFile);
    let view = (
        <article key={`product_${id}`} className="h-fit max-w-[300px] min-w-[250px] rounded-lg p-3 border border-slate-600 me-3 mb-3 md:mb-0 hover:text-teal-200 text-slate-200 cursor-pointer">

        <section className="flex items-center border-b pb-2 border-slate-600 text-slate-200">
            <p className="text-gray-300 text-sm">{published}</p>
            <p className="text-end flex-1 text-sm">{category}</p>
        </section>

        <h1 className="my-3 font-semibold text-lg">{name}</h1>
        <img src={imageFile} className="h-[180px] mx-auto"/>
        <p className="text-sm my-3 text-slate-200">{description}</p>

        <section className="flex items-center my-4">
            <h1 className="font-bold text-3xl flex-1 text-slate-200">${price}</h1>
            <ChipFeature feature={0}/>
        </section>

        <UserSection orgName={orgName} country={userCountry} />
        
        </article>
    )

    return view;
}

async function UserSection({orgName, country} : {orgName : string, country : string})
{
    const view = 
    (
      <section className="flex items-center border-t border-slate-600 pt-2 text-slate-200">
            <h1 className="px-2 border rounded-lg py-1 bg-slate-900 border-slate-400 font-semibold">
            {orgName + " " + country}<span className="text-sm text-slate-300 font-normal "> | Tienda oficial</span></h1>
      </section> 
    )

    return view;
}
  
export function ProductCardSkeleton({finished} : {finished : boolean})
{
const view = 
(
    <article className="h-fit max-w-[300px] min-w-[250px] rounded-lg bg-gray-800 p-4 mt-2">
    <div className="flex items-center">
        <Skeleton disableAnimation={finished} className="w-3/5 rounded bg-gray-700 h-6 "/>
        <div className="flex-1">
        <Skeleton disableAnimation={finished} className=" ms-auto w-3/5 rounded bg-gray-700 h-6"/>
        </div>
    </div>

    <Skeleton disableAnimation={finished} className="w-full rounded bg-gray-700 h-8 my-3 "/>
    <Skeleton disableAnimation={finished} className=" mx-auto w-2/3 rounded bg-gray-700 h-[180px] my-3"/>
    <div>
        <Skeleton disableAnimation={finished} className="mx-auto rounded bg-gray-700 h-[80px] my-3"/>
        <Skeleton disableAnimation={finished} className="mx-auto rounded bg-gray-700 h-[40px] my-3"/>
        <div className="mx-auto rounded h-[60px] mt-3 flex items-center">
        <Skeleton disableAnimation={finished} className="h-12 w-12 rounded-full bg-gray-700 flex-shrink-0"/>
        <div className="flex-1">
            <Skeleton disableAnimation={finished} className="w-2/3 bg-gray-700 ms-2 h-8 rounded"/>
        </div>
        </div>
    </div>
    </article>
)
return view;
}

function UserSectionSkeleton({finished} : {finished : boolean})
{
  return (
  <div className="mx-auto rounded h-[60px] mt-3 flex items-center">
    <Skeleton disableAnimation={finished} className="h-12 w-12 rounded-full bg-gray-700 flex-shrink-0"/>
    <div className="flex-1">
      <Skeleton disableAnimation={finished} className="w-2/3 bg-gray-700 ms-2 h-8 rounded"/>
    </div>
  </div>
  );
}