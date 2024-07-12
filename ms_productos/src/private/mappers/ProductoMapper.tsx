import { Estado,Producto } from "@prisma/client";

//Cuasi DTOs
export default class ProductoMapper
{
    static toState(state : string) : Estado
    {
        switch(state.toLowerCase())
        {
            case 'nuevo':
                return Estado.NUEVO;
            case 'usado':
                return Estado.USADO;
            default:
                return Estado.NUEVO;
        }
    }

    static fromState(state : Estado) : string
    {
        switch(state)
        {
            case Estado.NUEVO:
                return 'nuevo';
            case Estado.USADO:
                return 'usado';
            default:
                return 'nuevo';
        }
    }

    //Los array se pueden obtener con getAll
    formToJSON(formData : FormData)
    {
        try 
        {
            const product =  
            {
                id : formData.get('id') ? Number(formData.get('id')) : -1,
                ownerId : Number(formData.get('owner_id')),
                name : formData.get('name'),
                description : formData.get('description'),
                category : {name : formData.get('category') },
                state : formData.get('state'),
                images : formData.getAll('files'), //Se obtiene un File - o Blob -
                colors : formData.getAll('colors'),
                price : Number(formData.get('price')),
                stock : Number(formData.get('stock')),
                featuresText : formData.get('features_text'),
                featuresRows : formData.getAll('features_rows'),        // '['{prop}:{value}']'
                specialFeatures : formData.getAll('special_features')   //['envio_gratis','12_cuotas']
            }      
            return product;

        } catch(e){console.log(e); throw new Error('Form data could not be converted to json');}
    }

    jsonToForm(products : Producto[]) : FormData
    {
        try
        {
            const formData = new FormData();
            formData.set('elements',products?.length.toString() ?? '0');
            products.forEach(it => 
                {
                    if(it.id) formData.append('id',it.id);
                    formData.append('published',it.published.toISOString()) //YYYY-MM-DDTHH:mm:ss.sssZ
                    formData.append('owner_id',it.owner_id);
                    formData.append('name',it.name);
                    formData.append('description',it.description);
                    formData.append('category',it.category.name);
                    formData.append('state',it.state);
                    //Imágenes
                    let images : File[] = (it.files ?? []);
                    formData.append('files_count',images.length)
                    images.forEach(img => formData.append('files',img));
                    //Colores
                    let colors = it.colors;
                    formData.append('colors_count', colors.length);
                    colors.forEach(color => formData.append('colors', color));
                    formData.append('price',it.price);
                    formData.append('stock',it.stock);
                    formData.append('features_text_count',it.features_text ? '1' : '0');
                    formData.append('features_text',it.features_text ? it.features_text : 'empty');
                    //Filas
                    let rows = it.features_rows;
                    formData.append('rows_count',rows.length);
                    rows.forEach(row => formData.append('features_rows',row));
                    //Especiales
                    let specials = it.features_special;
                    formData.append('special_count',specials.length);
                    specials.forEach(special => formData.append('special_features',special ));
                })
            
            return formData

        } catch(e)
        {
            console.log(e);
            throw new Error('Could not convert from json to form data');
        }
    }
}