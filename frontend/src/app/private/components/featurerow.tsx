
import {useRef, useState,useEffect} from "react"

export default function FeatureRow(
    props: {added : {feature : string, value : string}[], setAdded : any})
{
    let [creatingState,setCreatingState] = useState(false);
    let [newFeature,setNewFeature] = useState("");
    let [newValue,setNewValue] = useState("");


    let addedView = function(feature : string, value : string, index : number) 
    { return (
        <tr id={`row_${index}`} key={`row_${index}`}  className="border-b border-slate-600">
            <td className="py-4 font-semibold w-1/3"><p className="w-[95%]">{feature}</p></td>
            <td className="w-1/3"><p className="w-[95%]">{value}</p></td>
            <td><button onClick={(event) => removeRow(event,index)} className="bg-red-600 py-1 
          px-2 rounded-xl text-sm font-semibold mx-2 hover:bg-red-500">X</button></td>
        </tr>
    )
    }

    let addingView = (
    <tr>
        <td className="w-1/3 font-semibold py-3">
          <input type="text" id="feature_name" className="border 
          rounded-md py-1 px-1 bg-gray-800 border-slate-600 me-1 w-[95%]"
          onChange={(event) => setNewFeature(event.target.value)}/>
        </td>
        <td className="w-1/3">
           <input type="text" id="feature_value" className="border 
          rounded-md py-1 px-1 bg-gray-800 border-slate-600 me-1 w-[95%]"
          onChange={(event) => setNewValue(event.target.value)}/>
        </td>
        <td className="w-1/3">
          <button onClick={onFinishCreating} className="bg-teal-800 py-1 
          px-2 rounded-xl text-sm font-semibold mx-2 hover:bg-teal-700 inline">✓</button>
          <button onClick={() => setCreatingState(false)} className="bg-red-600 py-1 
          px-2 rounded-xl text-sm font-semibold hover:bg-red-500 inline">X</button>
        </td>
    </tr>
    )
    
    function removeRow(event : React.MouseEvent<HTMLElement>, index : number)
    {
        event.preventDefault();
        if(props.added.length > index)
        {
            let element = props.added.at(index);
            props.setAdded(props.added.filter(it => it != element));
        }
    }

    function onFinishCreating()
    {
        if(newValue && newFeature)
        {
            let obj = {feature : newFeature, value : newValue}
            props.setAdded(props.added.concat(obj));
            setCreatingState(false);
        }
    }

    let amountAdded = props.added.length + (props.added.length != 1 ? " cargadas" : " cargada");

    let view = (
        <>
            <label htmlFor="features_table" className="mt-5 inline-block font-semibold">Tabla de valores
            <span className="text-sm font-normal text-slate-400">{` | ${amountAdded}` }</span>
            </label>
            <button onClick={(event) => {event.preventDefault(); setCreatingState(true);}} 
            className={ creatingState ? "hidden" : "" + " mx-2 rounded-xl bg-teal-800 px-2 py-1 text-sm font-semibold hover:bg-teal-700"}>Nuevo valor</button>
            <table className="mt-1 w-[100%] max-w-[600px] min-w-[400px]" id="features_table">
            <tbody className="">
                <tr className="border-b border-slate-600 text-left">
                    <th className="w-[40%] py-4 font-semibold">Característica</th>
                    <th className="w-[40%] font-semibold">Valor o dato</th>
                    <th className="w-[20%] font-semibold">Descartar</th>
                </tr>
                {props.added.map((it, index) => addedView(it.feature,it.value, index))}
                {creatingState ? addingView : null}
            </tbody>
            </table>
            {props.added.length == 0 && !creatingState ? 
                <p className="text-sm font-normal text-slate-400 mt-4">Ninguna agregada</p> : null }
        </>
    )

    return view;


}