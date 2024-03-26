
import {useRef, useState} from "react"

export default function FeatureRow(
    props: {setAdded : any, setLimitReached : any})  //State externo
{
    const added = useRef<{feature : string, value : string}[]>([])
    const setPrevious = useRef(false);    //Si al estar agregando un elemento lo canceló, para recuperar lo escrito
    const [missingFeature, setMissingFeature] = useState(false); //Si trata de guardar pero le falta algún valor
    const [missingValue, setMissingValue] = useState(false);

    const [creatingState,setCreatingState] = useState(false);
    const [newFeature,setNewFeature] = useState("");
    const [newValue,setNewValue] = useState("");


    const addedView = function(feature : string, value : string, index : number) 
    { return (
        <tr id={`row_${index}`} key={`row_${index}`} className="border-b border-slate-600">
            <td className="py-4 font-semibold w-1/3"><p className="w-[95%]">{feature}</p></td>
            <td className="w-1/3"><p className="w-[95%]">{value}</p></td>
            <td><button onClick={(event) => removeRow(event,index)} className="bg-red-600 py-1 
          px-2 rounded-xl text-sm font-semibold mx-2 hover:bg-red-500">X</button></td>
        </tr>
    )
    }

    const addingView = (
    <tr key="adding_view">
        <td className="w-1/3 font-semibold py-3">
          <input type="text" id="feature_name" value={setPrevious ? newFeature : ''} 
          className={`border rounded-md py-1 px-1 bg-gray-800 
          ${missingFeature ? 'border-red-300' : 'border-slate-600'} me-1 w-[95%]`}
        onChange={(event) => setNewFeature(event.target.value)}/>
        </td>
        <td className="w-1/3">
           <input type="text" id="feature_value" value={setPrevious ? newValue : ''} 
           className={`border rounded-md py-1 px-1 bg-gray-800 
           ${missingValue ? 'border-red-300' : 'border-slate-600'} me-1 w-[95%]`}
          onChange={(event) => setNewValue(event.target.value)}/>
        </td>
        <td className="w-1/3">
          <button onClick={onFinishCreating} className="bg-teal-800 py-1 
          px-2 rounded-xl text-sm font-semibold mx-2 hover:bg-teal-700 inline">✓</button>
          <button onClick={onDismiss} className="bg-red-600 py-1 
          px-2 rounded-xl text-sm font-semibold hover:bg-red-500 inline">X</button>
        </td>
    </tr>
    )
    
    function removeRow(event : React.MouseEvent<HTMLElement>, removeIndex : number)
    {
        event.preventDefault();
        added.current = added.current.filter((_,index) => index != removeIndex);
        props.setAdded(added.current);
        
    }

    function onStartCreating(event : React.MouseEvent<HTMLElement>)
    {
        event.preventDefault();
        if(added.current.length > 14)
        {
            props.setLimitReached(true);
            return;
        }
        else 
        {
            props.setLimitReached(false);
            setCreatingState(true);
        }
    }

    function onFinishCreating(event : React.MouseEvent<HTMLElement>)
    {
        event.preventDefault();
        setMissingFeature(!newFeature);
        setMissingValue(!newValue);
        if(newValue && newFeature)
        {
            let obj = {feature : newFeature, value : newValue}
            added.current = added.current.concat(obj);
            props.setAdded(added.current);
            setPrevious.current = false;
            setNewFeature('');
            setNewValue('');
            setCreatingState(false);
        }
    }
    
    function onDismiss(event : React.MouseEvent<HTMLElement>) //Keep previous state
    {
        event.preventDefault();
        setPrevious.current = true;
        setCreatingState(false);
    }

    let amountAdded = added.current.length + (added.current.length != 1 ? " cargadas" : " cargada");

    const view = (
        <>
            <label htmlFor="features_table" className="mt-5 inline-block font-semibold">Tabla de valores
            <span className="text-sm font-normal text-slate-400">{` | ${amountAdded}` }</span>
            </label>
            <button onClick={onStartCreating} 
            className={ creatingState ? "hidden" : "" + " mx-2 rounded-xl bg-teal-800 px-2 py-1 text-sm font-semibold hover:bg-teal-700"}>Nuevo valor</button>
            <table className="mt-1 w-[100%] max-w-[600px] min-w-[400px]" id="features_table">
            <tbody className="">
                <tr className="border-b border-slate-600 text-left">
                    <th className="w-[40%] py-4 font-semibold">Característica</th>
                    <th className="w-[40%] font-semibold">Valor o dato</th>
                    <th className="w-[20%] font-semibold">Descartar</th>
                </tr>
                {added.current.map((it, index) => addedView(it.feature,it.value, index))}
                {creatingState ? addingView : null}
            </tbody>
            </table>
            {added.current.length == 0 && !creatingState ? 
                <p className="text-sm font-normal text-slate-400 mt-4">Ninguna agregada</p> : null }
        </>
    )

    return view;


}