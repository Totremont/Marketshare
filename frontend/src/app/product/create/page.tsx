'use client'
import {useState, useRef} from "react"
import { ChipData, ChipGroup } from "@/components/chip";
import ImagePreview from "@/components/imagepreview"
import { NotificationType,NotificationComponent, NotificationProps } from "@/components/notification";
import Checkboxes, { CheckboxData } from "@/components/checkboxes";
import FeatureRow from "@/components/featurerow";

//Pestaña principal

export default function CreateProduct() 
{
    let [name,setName] = useState("");
    let [description,setDescription] = useState("");                        //Should be brief
    let [stateProduct,setStateProduct] = useState(["nuevo"]);               //States de ESTADO
    let [images,setImages] = useState(new Array<string>());
    let [colors,setColors] = useState(["rojo"]);                            //States de COLORES
    let [price,setPrice] = useState("");
    let [stock,setStock] = useState("");
    let [featuresText,setFeaturesText] = useState("");                      //Could be long
    let [addedFeatures,setAddedFeatures] = useState([]);                    //Table rows
    let [specialFeatures,setSpecialFeatures] = useState([""]);              //From chips

    let [show, setShow] = useState(false);
    let props = useRef(setIncompleteFieldsProps());

    let stateValues = [
        new CheckboxData("nuevo","Nuevo"),new CheckboxData("usado","Usado")
    ]

    let colorsValues = [
        new CheckboxData("rojo","Rojo"),
        new CheckboxData("azul","Azul"),
        new CheckboxData("verde","Verde"),
        new CheckboxData("amarillo","Amarillo"),
        new CheckboxData("naranja","Naranja"),
    ]

    let specialFeaturesValues = [
        new ChipData("envio_gratis","Envío gratis"),
        new ChipData("ahora_12","Ahora 12"),
        new ChipData("garantia","12 meses de garantía"),
        new ChipData("sustentable","Origen sustentable"),
    ]

    let onChange = function(event : React.SyntheticEvent)
    {
        let target = event.target as HTMLInputElement
        switch(target.id)
        {
            case "name":
                setName(target.value)
                break;
            case "description":
                setDescription(target.value)
                break;
            case "price":
                setPrice(target.value)
                break;
            case "stock":
                setStock(target.value)
                break;
            case "features_text":
                setFeaturesText(target.value);
                break;
        }
    }

    function onImageSubmit(event : React.SyntheticEvent)
    {
        let target = event.currentTarget as HTMLInputElement
        if(target.files)
            setImages(images.concat(URL.createObjectURL(target.files[0])));
    }

    function onRemoveImage(event : React.SyntheticEvent, src : string)
    {
        event.preventDefault();
        setImages(images.filter( it => it != src));
    }

    function onSubmit(event : React.SyntheticEvent)
    {
        event.preventDefault();
        if(!name || !price || !stock || featuresAmount == 0 || images.length == 0)
        {
            showNotification();
        }
    }

    let imagesAdded = images.length + (images.length != 1 ? " cargadas" : " cargada");

    let featuresAmount = (featuresText && addedFeatures.length > 0) ? 2 : (featuresText || addedFeatures.length > 0) ? 1 : 0

    function showNotification(time : number = NotificationType.NORMAL_TIME)
    {
      setShow(true);
      setTimeout(() => setShow(false),time)
    }

    let view = (
    <main className="h-fit w-full bg-gray-900 text-slate-200 bg-repeat py-8 px-3">
    <form onSubmit={onSubmit} className="max-w-[800px] mx-auto">
        <p className="text-lg font-semibold">Agregar un producto</p>
        <p className="text-slate-400">Completa los siguientes campos para añadir un nuevo producto a tu tienda</p>

        <label htmlFor="name" className="mt-6 block font-semibold">Nombre</label>
        <input onChange={onChange} type="text" id="name" className="mt-2 w-[80%] min-w-[250px] max-w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

        <label htmlFor="description" className="mt-8 block font-semibold">Descripción</label>
        <textarea onChange={onChange} id="description" rows={1} cols={1} className="mt-2 h-[80px] w-[80%] min-w-[300px] max-w-[450px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1"></textarea>
        <label className="mt-2 block text-sm text-slate-400">Describe las cualidades de tu producto en pocas palabras</label>

        <label htmlFor="state" className="mt-8 mb-2 block font-semibold">Estado</label>

        <Checkboxes checked={stateProduct} setChecked={setStateProduct} data={stateValues} singleSelection/>

        <label htmlFor="images" className="mt-8 inline-block font-semibold">Imágenes
        <span className="text-sm font-normal text-slate-400"> | {imagesAdded}</span></label>
        <input onChange={onImageSubmit}type="file" id="file_upload"
        className="bg-teal-800 py-1 px-2 rounded-xl text-sm font-semibold mx-2 hover:bg-teal-700 w-[150px]"/>

        <div className="mt-3 flex flex-wrap">
            {images.map((it,index) => <ImagePreview id={`image_${index}`} src={it} onRemove={onRemoveImage}/> )}
        </div>

        <label htmlFor="colors" className="mb-2 mt-8 block font-semibold">Colores</label>
        
        <Checkboxes checked={colors} setChecked={setColors} data={colorsValues} singleSelection={false}/>

        <label htmlFor="price" className="mt-8 block font-semibold">Precio</label>
        <input onChange={onChange} type="number" id="price" className="mt-2 w-[200px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />
        <label className="mt-2 block text-sm text-slate-400">Precio por unidad en pesos argentinos ($ARS)</label>

        <label htmlFor="stock" className="mt-8 block font-semibold">Stock disponible</label>
        <input onChange={onChange} type="number" id="stock" className="mt-2 w-[200px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

        <div className="mt-8 block border-t border-slate-700"></div>

        <label htmlFor="features" className="mt-8 block font-semibold">Características
        <span className="ms-2 font-normal text-slate-400">{featuresAmount}/1</span></label>
        <label className="text-sm text-slate-400">Debes completar al menos 1 campo</label>
        <label htmlFor="features_text" className="mt-4 block font-semibold">Textual</label>
        <textarea onChange={onChange} id="features_text" rows={1} cols={1} className="mt-2 block h-[80px] w-[80%] min-w-[350px] max-w-[450px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1"></textarea>
        
        <FeatureRow added={addedFeatures} setAdded={setAddedFeatures} />

        <label htmlFor="special_features" className="mt-8 block font-semibold">Otras características</label>
        <ChipGroup checked={specialFeatures} setChecked={setSpecialFeatures} data={specialFeaturesValues} singleSelection={false}/>

        <input className="mt-6 block rounded-xl bg-blue-900 px-6 py-2 font-semibold hover:bg-blue-700 cursor-pointer" type="submit" value="Crear producto" />
    </form>
    {show ? <NotificationComponent title={props.current.title} key={"notification"}
    body={props.current.body} type={props.current.type} options={props.current.options}/> : null}
    </main>

    )
    return view;


}

function setIncompleteFieldsProps()
{
    return new NotificationProps(NotificationType.ERROR,"Campos incompletos",
    "Te faltan completar campos obligatorios",[]);
}

