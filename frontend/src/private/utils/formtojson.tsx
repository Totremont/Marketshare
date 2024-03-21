
export default function formProductsToJson(formData : FormData)
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
            id : ids,
            published : publishes[i],
            owner_id : usersIds[i],
            name : names[i],
            description : descriptions[i],
            category : {name : categories[i]},
            state : states[i],
            images : getOwnValues(files,i),     //Will be casted
            colors : getOwnValues(colors,i),
            price : prices[i],
            stock : stocks[i],
            featuresText : getOwnValues(featuresTexts,i),
            featuresRows : getOwnValues(featuresRows,i),
            specialFeatures : getOwnValues(specials,i)     
        }
        products = products.concat(product);
    }

    return products;
}

function getOwnValues(data : [number[], any[]], index : number)
{
    //My own amount of data from this collection
    let ownAmount = data[0][index];
    if(!ownAmount) return [];
    let start = 0;
    //Shift through all previous amounts
    data[0].slice(index + 1).forEach(sum => start += sum);

    return data[1].slice(start,start + ownAmount);
}
