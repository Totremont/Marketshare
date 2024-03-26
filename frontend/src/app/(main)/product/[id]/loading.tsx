import { Skeleton } from "@nextui-org/react"

export default async function LoadingProductPage()
{
    const view = 
    (
    <div className="h-fit max-w-[1500px] mx-auto">
        <Skeleton className="h-8 bg-gray-700 rounded-md"/>

        <Skeleton className="h-10 bg-gray-700 rounded-md my-2"/>

        <div className="sm:grid sm:grid-cols-[2fr_1fr] sm:gap-x-2 ">

            <section className="my-3">

                <article className="sm:grid sm:grid-cols-[1fr_1fr] sm:gap-x-3">

                    <Skeleton className="h-[400px] bg-gray-700 rounded-md"/>

                    <Skeleton className="h-full bg-gray-700 rounded-md"/>

                </article>

                <Skeleton className="my-3 h-[400px] bg-gray-700 rounded-md"/>

            </section>

            <section className="shrink-0">
                <Skeleton className="h-[400px] my-3 bg-gray-700 rounded-md"/>
                <Skeleton className="h-[400px] my-3 bg-gray-700 rounded-md"/>
            </section>

        </div>

        <article className="">
            <Skeleton className="h-8 my-3 bg-gray-700 rounded-md"/>
            <div className="flex flex-wrap gap-2">

                <Skeleton className="flex-1 h-[150px] my-3 bg-gray-700 rounded-md"/>
                <Skeleton className="flex-1 h-[150px] my-3 bg-gray-700 rounded-md"/>

            </div>
        </article>
    </div>
    )

    return view;
}