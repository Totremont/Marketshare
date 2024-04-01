
export default function EmptyComponent({missingElement} : {missingElement : string})
{
    const view = 
    (
      <article className="mt-2 flex h-[225px] min-w-[250px] md:w-[300px] flex-col rounded-lg bg-gray-800 p-3">
        <div className="justify-center text-center">       
          <h1 className="text-slate-200 text-2xl my-1 font-semibold">Oops!</h1>
          <h2 className="text-lg text-slate-300">Parece que no hay <span className="font-semibold">{missingElement}</span></h2>
          <svg className="fill-slate-400 w-20 mx-auto py-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>folder-open</title><path d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z" /></svg>
          <button className="text-sm font-semibold text-orange-200 rounded-md p-1 px-2 bg-gray-700 mt-2 hover:bg-gray-600">Reintentar</button>     
        </div>
      </article>
    )

    return view;
}