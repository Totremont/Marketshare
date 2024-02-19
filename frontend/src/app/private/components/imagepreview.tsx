
export default function ImagePreview(props : {id : string, src : string, onRemove : (event  : any, src : string) => void})
{
    return (
    <div id={props.id} key={props.id} className="mb-4 me-3">
        <img src={props.src} className="h-[100px]" />
        <button onClick={(event) => props.onRemove(event, props.src)} className="bg-red-600 py-1 
          px-2 rounded-xl text-sm font-semibold hover:bg-red-500 inline">X</button>
    </div>
    )
}