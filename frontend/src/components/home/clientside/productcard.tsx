'use client'
import { ChipFeature } from "@/components/chips";
import { getCategoryIcon, toSpecialFeature } from "@/private/utils/mappers";
import { SpecialFeature } from "@/private/utils/properties";
import { Skeleton, image } from "@nextui-org/react";
import Image from 'next/image'
import { useRouter } from "next/navigation";

export default function ProductCard({id,imageFile,published,category,
    name,description,price, withUser, orgName, feature})
{
    const router = useRouter();
    let view = (
        <article onClick={() => router.push(`/product/${id}`)}key={`product_${id}`} className="h-fit max-w-[300px] min-w-[250px] rounded-lg 
        p-3 border border-slate-600 
        hover:text-orange-200 text-slate-200 cursor-pointer bg-gray-800">

        <section className="overflow-hidden flex items-center border-b pb-2 border-slate-600 text-slate-200">
            <p className="text-gray-300 text-sm flex-shrink-0">{published}</p>
            <div className="flex items-center justify-end gap-x-2 flex-1 text-sm">
                <p>{category}</p>
                {getCategoryIcon(category)}
            </div>
        </section>

        <h1 className="my-3 font-semibold text-2xl h-8 overflow-hidden">{name}</h1>
        <img src={imageFile} className="h-[180px] mx-auto my-6 aspect-auto" alt='product picture'/>
        <p className="text-sm my-3 text-slate-200 h-[80px] overflow-hidden">{description}</p>

        <section className="flex items-center my-4">
            <h1 className="font-bold text-3xl flex-1 text-slate-200 flex-shrink-0">${price}</h1>
            <ChipFeature feature={feature}/>
        </section>

        {withUser ? <UserSection orgName={orgName}/> : <UserSectionSkeleton finished={true}/> }
        
        </article>
    )

    return view;
}

async function UserSection({orgName} : {orgName : string})
{
    const view = 
    (
      <section className="border-t border-slate-600 pt-2 text-slate-200 overflow-hidden">
            <h1 className="px-2 border rounded-lg py-1 bg-slate-900 border-slate-400 font-semibold">
            {orgName}<span className="text-sm text-slate-300 font-normal "> | Tienda oficial</span>
            </h1>
      </section> 
    )

    return view;
}
  
export function ProductCardSkeleton()
{
const view = 
(
    <article className="h-fit max-w-[300px] min-w-[250px] rounded-lg bg-gray-800 p-4 mt-2">
    <div className="flex items-center">
        <Skeleton className="w-3/5 rounded bg-gray-700 h-6 "/>
        <div className="flex-1">
        <Skeleton className=" ms-auto w-3/5 rounded bg-gray-700 h-6"/>
        </div>
    </div>

    <Skeleton  className="w-full rounded bg-gray-700 h-8 my-3 "/>
    <Skeleton  className=" mx-auto w-2/3 rounded bg-gray-700 h-[180px] my-3"/>
    <div>
        <Skeleton className="mx-auto rounded bg-gray-700 h-[80px] my-3"/>
        <Skeleton className="mx-auto rounded bg-gray-700 h-[40px] my-3"/>
        <div className="mx-auto rounded h-[60px] mt-3 flex items-center">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-700 flex-shrink-0"/>
        <div className="flex-1">
            <Skeleton className="w-2/3 bg-gray-700 ms-2 h-8 rounded"/>
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