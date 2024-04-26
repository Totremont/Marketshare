'use client'
import {useState, useRef, useEffect} from "react"
import { ChipData, ChipGroup } from "@/components/chips";
import ImagePreview from "@/components/product/create/imagepreview"
import { SnackBarType,SnackBar, SnackBarProps, SnackBarOption } from "@/components/snackbar";
import CheckBoxes, { CheckBoxData } from "@/components/checkboxes";
import FeatureRow from "@/components/product/create/featurerow";
import { createProductSSA } from "@/private/actions/product";
import { useFormState } from "react-dom";
import { SubmitButtonWithState } from "@/components/buttons";
import { useRouter} from "next/navigation";
import { formToProduct } from "@/private/utils/mappers";

//Pestaña principal

export default function CreateProduct(props : {isUpdating : boolean, productId : string | undefined, token : string}) 
{

    const [stateProduct,setStateProduct] = useState(["nuevo"]);                         
    const [images,setImages] = useState<{file : File, url : string}[]>([]);
    const [colors,setColors] = useState(["rojo"]); 
    const [featuresText, setFeaturesText] = useState('');                               
    const [addedRows, setAddedRows] = useState<{feature : string,value : string}[]>([]);
    const [specialFeatures,setSpecialFeatures] = useState([]);                          
    const fileInput = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [showSnack, setShowSnack] = useState(false);
    const snackProps = useRef<SnackBarProps>();
    const [rowLimitReached, setRowLimitReached] = useState(false);
    const [pending, setPending] = useState(false);
    const router = useRouter();

    const initialState = {title : props.isUpdating ? 'UPDATING' : ''};

    const [state, formAction] = useFormState(createProductSSA, initialState);

    let onBackHome = () => 
    {
        router.replace('/home');
    };

    //Load product to be updated if any
    const uProduct = useRef<any[]>([]);
    const id = useRef(-1);
    const [name,setName] = useState('');
    const [desc,setDesc] = useState('');
    const [category,setCategory] = useState('otra');
    const [price,setPrice] = useState('0');
    const [stock,setStock] = useState('0');
    const previousImages = useRef<File[]>([]);

    function handleUpdate()
    {
        if(props.isUpdating)
        {
            findProductByIdClient(props.productId!,props.token).then
            (
                res => 
                {
                    uProduct.current = formToProduct(res);
                    fillInputs();
                    showFetchToUpdateSuccess(setShowSnack,snackProps);
                },
                err => showFetchToUpdateFailed(setShowSnack,snackProps)
            )
        }
    }
    
    function fillInputs()
    {
        if(!uProduct.current[0]) return;
        id.current = uProduct.current[0].id;
        setName(uProduct.current[0].name);
        setDesc(uProduct.current[0].description);
        setCategory(uProduct.current[0].category.name);
        setStateProduct([uProduct.current[0].state.toLowerCase()]);

        previousImages.current = uProduct.current[0].images;
        const dataTransfer = new DataTransfer();
        let imagesData : {file : File, url: string}[] = [];
        previousImages.current.map
        (
            (it : File) => 
            { 
                dataTransfer.items.add(it); 
                imagesData = imagesData.concat({file : it, url: URL.createObjectURL(it)});
            }
        )
        fileInput.current!.files = dataTransfer.files;
        setImages(imagesData);
        setColors(uProduct.current[0].colors);
        setPrice(uProduct.current[0].price);
        setStock(uProduct.current[0].stock);
        setFeaturesText(uProduct.current[0].featuresText);
        setAddedRows(uProduct.current[0].featuresRows);
        setSpecialFeatures(uProduct.current[0].specialFeatures);
    }
    useEffect(handleUpdate,[]);
    
    //Data
    const stateValues = useRef([
        new CheckBoxData("nuevo","Nuevo"),
        new CheckBoxData("usado","Usado")
    ])

    const colorsValues = useRef([
        new CheckBoxData("rojo", "Rojo"),
        new CheckBoxData("azul", "Azul"),
        new CheckBoxData("verde", "Verde"),
        new CheckBoxData("amarillo","Amarillo"),
        new CheckBoxData("blanco","Blanco"),
        new CheckBoxData("negro","Negro"),
        new CheckBoxData("gris","Gris")
    ])

    const specialFeaturesValues = useRef([
        new ChipData("envio_gratis","Envío gratis"),
        new ChipData("ahora_12","Ahora 12"),
        new ChipData("garantia","12 meses de garantía"),
        new ChipData("sustentable","Origen sustentable"),
    ])

    const categories = useRef(
    [
        {value : "unknown" , text : "Seleccioná una categoría" },
        {value : "electronica" , text : "Electrónica" },
        {value : "audio" , text : "Audio y video" },
        {value : "informatica" , text : "Informática" },
        {value : "pequenios_dispositivos" , text : "Pequeños dispositivos" },
        {value : "herramientas" , text : "Herramientas" },
        {value : "belleza" , text : "Belleza" },
        {value : "deporte_bienestar" , text : "Deporte y bienestar" },
        {value : "prendas_moda" , text : "Prendas y moda" },
        {value : "vehiculos" , text : "Vehículos" },
        {value : "industrias" , text : "Industrias" },
        {value : "construccion" , text : "Construcción" },
        {value : "oficinas" , text : "Oficinas" },
        {value : "otra" , text : "Otra" },

    ])

    function onImageSubmit(event : React.SyntheticEvent)
    {
        if(props.isUpdating && previousImages.current.length)    //Añadimos las imágenes anteriores
        {
            const dataTransfer = new DataTransfer();
            previousImages.current.forEach((it : File) => { dataTransfer.items.add(it); })
            const newFilesLength = fileInput.current!.files?.length ?? 0;
            for(let i = 0; i < newFilesLength ; i++)
            {
                dataTransfer.items.add(fileInput.current!.files!.item(i)!);
            }

            fileInput.current!.files =  dataTransfer.files;
        }

        const max = 4 - images.length
        if(max <= 0)
        {
            showImagesLimit(setShowSnack,snackProps);
            return;
        }
        let target = event.currentTarget as HTMLInputElement

        let newImages : {file : File, url : string}[] = [];
        for(let i = 0; i < target.files!.length; i++)
        {
            const currentFile = target.files?.item(i);
            if(!images.find(obj => obj.file === currentFile))
            {
                const url = URL.createObjectURL(currentFile!);
                newImages = newImages.concat({file : currentFile!,url});
            }
        }
        if(newImages.length > max)
        {
            newImages = newImages.slice(0,max);
            showImagesLimit(setShowSnack,snackProps);
        }
        setImages(images.concat(newImages));
    }

    function onRemoveImage(event : React.SyntheticEvent, src : string)
    {
        event.preventDefault();

        let updateImages : {file : File, url : string}[] = [];

        const dataTransfer = new DataTransfer()

        if(props.isUpdating && previousImages.current.length)
        {
            const imageData = images.find(it => it.url === src);
            previousImages.current = previousImages.current.filter(it => it != imageData?.file); 
        }
        
        images.forEach(obj => 
            {
                if(obj.url != src)
                { 
                    updateImages = updateImages.concat(obj); 
                    dataTransfer.items.add(obj.file);
                }
            }
        )
        
        fileInput.current!.files = dataTransfer.files;
        setImages(updateImages);
        
    }

    const imagesCount = images.length + (images.length != 1 ? " cargadas" : " cargada");

    const featuresAmount = (featuresText && addedRows.length > 0) ? 2 : (featuresText || addedRows.length > 0) ? 1 : 0

    useEffect(() => {if(rowLimitReached) showRowsLimit(setShowSnack,snackProps)},[rowLimitReached]);

    function onSubmit(event : any) //action se ejecuta luego
    {
        event.preventDefault();
        const form = formRef.current;
        setPending(true);
        if(featuresAmount == 0 || images.length == 0)
        {
            showMissingData(setShowSnack,snackProps);
            setPending(false);
        }
        else form!.requestSubmit();
        
    }

    useEffect(() => 
    {
        if(state.title)
        {
            setPending(false);
            if(state.title === 'SUCCESS') showProductAdded(setShowSnack,snackProps,props.isUpdating,onProductPage,onBackHome)
            else if(state.title != 'UPDATING') showServerError(setShowSnack,snackProps);
            state.title = props.isUpdating ? 'UPDATING' : '';
        } 
    },[state])

    const view = (
    <div className="h-fit w-full px-3">
    <form action={formAction} ref={formRef} className="max-w-[800px] mx-auto">
        <p className="text-2xl font-semibold">{props.isUpdating ? 'Actualizar un producto' : 'Agregar un producto'}</p>
        <p className="text-slate-400">
            {
                props.isUpdating ? 'Modificá los campos que desees' 
                : 
                'Completá los siguientes campos para añadir un nuevo producto a tu tienda'
            }
            </p>

        <label htmlFor="name" className="mt-6 block font-semibold">Nombre</label>
        <input required type="text" id="name" name="name" value={name} onChange={(e) => setName(e.currentTarget.value)}
        className="mt-2 w-[80%] md:max-w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1"
         />

        <label htmlFor="description" className="mt-8 block font-semibold">Descripción</label>

        <textarea required id="description" name="description" rows={1} cols={1} value={desc} onChange={(e) => setDesc(e.currentTarget.value)}
        className="mt-2 h-[120px] w-[80%] md:max-w-[500px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1"></textarea>
        <label className="mt-2 block text-sm text-slate-400">Describe las cualidades de tu producto en pocas palabras</label>

        <label htmlFor="category" className="mt-8 block font-semibold">Categoría</label>
        <select id="category" required name="category" value={category} onChange={(e) => setCategory(e.currentTarget.value)}
        className="mt-2 w-[60%] md:max-w-[300px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1">
        {categories.current.map((it,index) => (<option disabled={index==0} key={`category_${index}`} value={it.value}>{it.text}</option>))}
        </select>

        <label htmlFor="state" className="mt-8 mb-2 block font-semibold">Estado</label>

        <CheckBoxes checked={stateProduct} setChecked={setStateProduct} data={stateValues.current} singleSelection/>

        <label htmlFor="images" className="mt-8 inline-block font-semibold">Imágenes
        <span className="text-sm font-normal text-slate-400"> | {imagesCount}</span></label>
        <input onChange={onImageSubmit} ref={fileInput} type="file" id="file_upload" name="files" multiple
        className="bg-teal-800 py-1 px-2 rounded-xl text-sm font-semibold mx-2 hover:bg-teal-700 w-[150px]"/>
        <label className="text-sm text-slate-400 block">Debes subir al menos 1 imagen</label>

        <div className="mt-3 flex flex-wrap">
            {images.map((it,index) => <ImagePreview key={`image_${index}`} src={it.url} onRemove={onRemoveImage}/> )}
        </div>

        <label htmlFor="colors" className="mb-2 mt-8 block font-semibold">Colores</label>
        
        <CheckBoxes checked={colors} setChecked={setColors} data={colorsValues.current} singleSelection={false}/>

        <label htmlFor="price" className="mt-8 block font-semibold">Precio</label>

        <input required type="number" min={0} id="price" name="price" value={price} onChange={(e) => setPrice(e.currentTarget.value)}
        className="mt-2 w-[60%] md:max-w-[200px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

        
        <label className="mt-2 block text-sm text-slate-400">Precio por unidad en pesos argentinos ($ARS)</label>

        <label htmlFor="stock" className="mt-8 block font-semibold">Stock disponible</label>

        <input required type="number" min={0} id="stock" name="stock" value={stock} onChange={(e) => setStock(e.currentTarget.value)}
        className="mt-2 w-[60%] md:max-w-[200px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1" />

        

        <div className="mt-8 block border-t border-slate-700"></div>

        <label htmlFor="features" className="mt-8 block font-semibold">Características
        <span className="ms-2 font-normal text-slate-400">{featuresAmount}/1</span></label>
        <label className="text-sm text-slate-400">Debes completar al menos 1 campo</label>
        <label htmlFor="features_text" className="mt-4 block font-semibold">Textual</label>
        <textarea id="features_text" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} 
        name="features_text" rows={1} cols={1} 
        className="mt-2 block h-[120px] w-[80%] md:max-w-[500px] rounded-md border border-slate-600 bg-gray-800 px-1 py-1"></textarea>
        
        <FeatureRow added={addedRows} setAdded={setAddedRows} setLimitReached={setRowLimitReached} />

        <label htmlFor="special_features" className="mt-8 block font-semibold">Otras características</label>
        <ChipGroup checked={specialFeatures} setChecked={setSpecialFeatures} 
        data={specialFeaturesValues.current} singleSelection={false} selectionRequired={false}/>
        
        <div className="my-6">
            <SubmitButtonWithState title='Crear producto' pending={pending} onClick={onSubmit} />
        </div>

        <input type="hidden" name="colors" value={JSON.stringify(colors)} />
        <input type="hidden" name="state" value={stateProduct} />
        <input type="hidden" name="features_text" value={featuresText} />
        <input type="hidden" name="features_rows" value={JSON.stringify(addedRows)} />
        <input type="hidden" name="special_features" value={JSON.stringify(specialFeatures)} />
        <input type="hidden" name="id" value={id.current} />
    </form>
    {showSnack ? <SnackBar title={snackProps.current!.title} key={"notification"}
    body={snackProps.current!.body} type={snackProps.current!.type} options={snackProps.current!.options}/> : null}
    </div>

    )



    return view;

}

function showMissingData(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.INFORMATIVE,"Faltan datos",
    "Hay campos obligatorios sin completar.",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)

}


function showProductAdded(setShowSnack : any, ref : any, wasUpdate : boolean, 
    onProductPage : any, onBackHome : any, time : number = SnackBarType.LONG_TIME )
{
    const backHome = new SnackBarOption("Volver a inicio", onBackHome);

    ref.current = new SnackBarProps(SnackBarType.SUCCESSFUL,
        wasUpdate ? 'Producto modificado' : 'Producto agregado',
    'El producto ha sido añadido correctamente!',[backHome]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

function showServerError(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.ERROR,"Error de servidor",
    "Ocurrió un error inesperado. Intentalo más tarde",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

function showImagesLimit(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.INFORMATIVE,"Demasiadas imágenes",
    "Solo podés agregar hasta un máximo de 4 imágenes",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

function showRowsLimit(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.INFORMATIVE,"Demasiadas filas",
    "Tu tabla de características no puede tener más de 15 filas. Considera utilizar otras opciones.",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

function showFetchToUpdateFailed(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.ERROR,"Error de actualización",
    "Se solicitó modificar un producto pero el producto no fue encontrado.",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

function showFetchToUpdateSuccess(setShowSnack : any, ref : any, time : number = SnackBarType.NORMAL_TIME )
{
    ref.current = new SnackBarProps(SnackBarType.INFORMATIVE,"Datos cargados",
    "Se han cargado los datos del producto a modificar.",[]);

    setShowSnack(true);
    setTimeout(() => setShowSnack(false),time)
}

async function findProductByIdClient(id : string, token : string, sendImages = true)
{
    return fetch(`${process.env.NEXT_PUBLIC_ms_productos_host}/api/products/${id}?send_images=${sendImages}`,
        { 
            method : 'GET',
            mode : 'cors',
            headers: 
            {
            "Authorization":    `Bearer ${token}`,
            //"Content-Type":     "application/x-www-form-urlencoded",
            "Accept":           "multipart/form-data",
            },
        }
    )
    .then
    (
        res => {if(res.ok) return res.formData(); else throw new Error(`Request for products resolved to ${res.status}`)  },
        err => {console.log(err); throw err}
    )

}

