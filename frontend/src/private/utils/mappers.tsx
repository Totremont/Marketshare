import { AudioIcon, BeautyIcon, ClothesIcon, ComputingIcon, DevicesIcon, ElectronicsIcon, IndustryIcon, OfficesIcon, OtherIcon, SportsIcon, ToolsIcon } from "@/components/icons/categories";
import { BackgroundColors, Categories, SpecialFeature } from "./properties";

export function formToProduct(formData : FormData)
{
    let products: any[] = [];

    const elements = Number(formData.get('elements'));
    const ids = formData.getAll('id');                  //Could be null
    const publishes = formData.getAll('published');
    const usersIds = formData.getAll('owner_id');
    const names = formData.getAll('name');
    const descriptions = formData.getAll('description');
    const categories = formData.getAll('category');
    const states = formData.getAll('state');
    const prices = formData.getAll('price');
    const stocks = formData.getAll('stock');

    // Reference : [[counts],[datas]] | Features text can also be optional
    const files = [formData.getAll('files_count'), formData.getAll('files')]    //[[counts],[files]]
    const colors = [formData.getAll('colors_count'), formData.getAll('colors') ];
    const featuresTexts = [formData.getAll('features_text_count'),formData.getAll('features_text')]
    const featuresRows = [formData.getAll('rows_count'),formData.getAll('features_rows')]
    const specials = [formData.getAll('special_count'),formData.getAll('special_features')]

    for(let i = 0; i < elements; i++)
    {
        let product = 
        {
            id : ids[i],
            published : publishes[i],
            owner_id : usersIds[i],
            name : names[i],
            description : descriptions[i],
            category : {name : categories[i]},
            state : states[i],
            images : getOwnValues(files,i),     //Will be casted
            colors : JSON.parse(getOwnValues(colors,i)),
            price : prices[i],
            stock : stocks[i],
            featuresText : getOwnValues(featuresTexts,i),
            featuresRows : JSON.parse(getOwnValues(featuresRows,i)),
            specialFeatures : JSON.parse(getOwnValues(specials,i))     
        }
        products = products.concat(product);
    }

    return products;
}

function getOwnValues(data : [number[], any[]], index : number)
{
    //My own amount of data from this collection
    let ownAmount : number = Number(data[0][index]);
    if(!ownAmount) return [];
    let start : number = 0;
    //Sum previous amounts and shift
    if(index != 0) data[0].slice(0,index).forEach(sum => start += Number(sum));
    return data[1].slice(start,start + ownAmount);
}

//Raw feature from product
export function toSpecialFeature(feature : string)
{
    switch(feature)
    {
        case 'envio_gratis':
            return SpecialFeature.ENVIO_GRATIS;
        case 'ahora_12':
            return SpecialFeature.AHORA_12;
        case 'garantia':
            return SpecialFeature.GARANTIA;
        case 'sustentable':
            return SpecialFeature.SUSTENTABLE;
        default:
            return -1;
    }
}

//Raw category from product
export function toCategory(category : string)
{
    switch(category)
    {
        case 'electronica':
        return Categories.ELECTRONICA;
        case 'audio':
        return Categories.AUDIO;
        case 'informatica':
        return Categories.INFORMATICA;
        case 'pequenios_dispositivos':
        return Categories.PEQUENIOS_DISPOSITIVOS;
        case 'herramientas':
        return Categories.HERRAMIENTAS;
        case 'belleza':
        return Categories.BELLEZA;
        case 'deporte_bienestar':
        return Categories.DEPORTE_BIENESTAR;
        case 'prendas_moda':
        return Categories.PRENDAS_MODA;
        case 'vehiculos':
        return Categories.VEHICULOS;
        case 'industrias':
        return Categories.INDUSTRIAS;
        case 'construccion':
        return Categories.CONSTRUCCION;
        case 'oficinas':
        return Categories.OFICINAS;
        default:
        return Categories.OTRAS; 
    }
}
//From YYYY-MM-DDTHH:mm:ss.sssZ to DD-MM-YYYY
export function formatDate(date : string, getTime = false)
{
    const splits = date.split('-');
    const day = splits[2].slice(0,2);
    const month = splits[1];
    const year = splits[0];
    const time = getTime ? splits[2].slice(3,11) : null;
    let monthName;
    switch(month)
    {
        case '01':
        monthName = 'Enero';
        break;
        case '02':
        monthName = 'Febrero';
        break;
        case '03':
        monthName = 'Marzo';
        break;
        case '04':
        monthName = 'Abril';
        break;
        case '05':
        monthName = 'Mayo';
        break;
        case '06':
        monthName = 'Junio';
        break;
        case '07':
        monthName = 'Julio';
        break;
        case '08':
        monthName = 'Agosto';
        break;
        case '09':
        monthName = 'Septiembre';
        break;
        case '10':
        monthName = 'Octubre';
        break;
        case '11':
        monthName = 'Noviembre';
        break;
        case '12':
        monthName = 'Diciembre';
        break;
    }

    return `${day} de ${monthName} ${year} ${time ? '| ' + time : '' }`;
}

export function formatPrice(price : number | string)
{
    const priceText = price.toString().split('.')[0];   //Para sacar posibles decimales
    const last = priceText.length - 1;
    if(last < 0) return "";

    let text = new Array<string>((last + 1) + Math.floor(last / 3));
    let index = text.length - 1;
    for(let i = last; i > -1; i--)
    {
        if((last - i) % 3 === 0 && i != last)
        {
            text[index] = "."
            index--;
        }
        text[index] = priceText[i];
        index--;  

    }
    return text.join('');
}

export function toBackgroundColor(color : string)
{
    switch(color)
    {
        case 'rojo':
            return BackgroundColors.RED;
        case 'azul':
            return BackgroundColors.BLUE;
        case 'verde':
            return BackgroundColors.GREEN;
        case 'amarillo':
            return BackgroundColors.YELLOW;
        case 'blanco':
            return BackgroundColors.WHITE;
        case 'negro':
            return BackgroundColors.BLACK;
        case 'gris':
            return BackgroundColors.GRAY;
        default:
            return '';
    }
}

export function getCategoryIcon(category : string)
{
    switch(category)
    {
        case Categories.ELECTRONICA:
            return <ElectronicsIcon/>
        case Categories.AUDIO:
            return <AudioIcon/>
        case Categories.BELLEZA:
            return <BeautyIcon/>
        case Categories.DEPORTE_BIENESTAR:
            return <SportsIcon/>
        case Categories.HERRAMIENTAS:
            return <ToolsIcon/>
        case Categories.INDUSTRIAS:
            return <IndustryIcon/>
        case Categories.INFORMATICA:
            return <ComputingIcon/>
        case Categories.PEQUENIOS_DISPOSITIVOS:
            return <DevicesIcon/>
        case Categories.OFICINAS:
            return <OfficesIcon/>
        case Categories.PRENDAS_MODA:
            return <ClothesIcon/>
        default:
            return <OtherIcon/>
        
    }
}

export function getAverageRating(ratings : number[])
{
    let sum = 0;
    ratings.forEach(it => sum += it);
    return sum / (ratings.length ? ratings.length : 1) ;
}

export function lastOrderStatus(order : any)
{
    return order.status_history[order.status_history.length - 1];
}